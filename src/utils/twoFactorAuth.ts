import speakeasy from 'speakeasy';
import QRCode from 'qrcode';
import logger from '@/utils/logger';
import User from '@/models/user.model';
import dbConnect from '@/utils/db';

export class TwoFactorAuth {
  private static instance: TwoFactorAuth;

  private constructor() { }

  static getInstance(): TwoFactorAuth {
    if (!TwoFactorAuth.instance) {
      TwoFactorAuth.instance = new TwoFactorAuth();
    }
    return TwoFactorAuth.instance;
  }

  async generateSecret(userId: string) {
    try {
      await dbConnect();
      const secret = speakeasy.generateSecret({
        name: `ISKCON Admin (${userId})`,
        issuer: 'ISKCON Website'
      });

      // Store in database
      await User.findByIdAndUpdate(userId, {
        twoFactorSecret: secret.base32
      });

      const qrCodeUrl = await QRCode.toDataURL(secret.otpauth_url!);

      return {
        secret: secret.base32,
        qrCode: qrCodeUrl
      };
    } catch (error) {
      logger.error('Error generating 2FA secret:', error);
      throw new Error('Failed to generate 2FA secret');
    }
  }

  async verifyToken(userId: string, token: string): Promise<boolean> {
    try {
      await dbConnect();
      const user = await User.findById(userId);

      if (!user || !user.twoFactorSecret) {
        logger.error(`No 2FA secret found for user: ${userId}`);
        return false;
      }

      return speakeasy.totp.verify({
        secret: user.twoFactorSecret,
        encoding: 'base32',
        token,
        window: 1
      });
    } catch (error) {
      logger.error('Error verifying 2FA token:', error);
      return false;
    }
  }

  async removeSecret(userId: string) {
    try {
      await dbConnect();
      await User.findByIdAndUpdate(userId, {
        $unset: { twoFactorSecret: 1 }
      });
      return true;
    } catch (error) {
      logger.error('Error removing 2FA secret:', error);
      throw new Error('Failed to remove 2FA secret');
    }
  }
}

export const twoFactorAuth = TwoFactorAuth.getInstance();
