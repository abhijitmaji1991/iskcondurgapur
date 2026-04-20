import { NextResponse } from 'next/server';
import { twoFactorAuth } from '@/utils/twoFactorAuth';
import logger from '@/utils/logger';

export async function POST(request: Request) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: 'User ID is required' }),
        { status: 400 }
      );
    }

    const { secret, qrCode } = await twoFactorAuth.generateSecret(userId);

    logger.info('2FA setup initiated for user:', userId);

    return NextResponse.json({
      secret,
      qrCode,
      message: '2FA setup successful'
    });

  } catch (error) {
    logger.error('2FA setup error:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to setup 2FA' }),
      { status: 500 }
    );
  }
}

export async function DELETE(request: Request) {
  try {
    const { userId } = await request.json();
    
    if (!userId) {
      return new NextResponse(
        JSON.stringify({ message: 'User ID is required' }),
        { status: 400 }
      );
    }

    twoFactorAuth.removeSecret(userId);
    logger.info('2FA disabled for user:', userId);

    return NextResponse.json({
      message: '2FA disabled successfully'
    });

  } catch (error) {
    logger.error('2FA disable error:', error);
    return new NextResponse(
      JSON.stringify({ message: 'Failed to disable 2FA' }),
      { status: 500 }
    );
  }
}
