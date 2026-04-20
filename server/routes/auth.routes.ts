import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';
import User from '../../src/models/user.model';
import { twoFactorAuth } from '../../src/utils/twoFactorAuth';
import logger from '../../src/utils/logger';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';

// Login Route
router.post('/login', async (req: Request, res: Response) => {
    try {
        const { username, password, totpToken } = req.body;

        if (!username || !password) {
            return res.status(400).json({ message: 'Username and password are required' });
        }

        const user = await User.findOne({ username });
        if (!user || !(await bcrypt.compare(password, user.password))) {
            logger.warn(`Failed login attempt for user: ${username}`);
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Check 2FA if enabled
        if (user.twoFactorEnabled) {
            if (!totpToken) {
                return res.status(428).json({
                    message: '2FA token required',
                    require2FA: true,
                    userId: user._id
                });
            }

            const isValid2FA = await twoFactorAuth.verifyToken(user._id.toString(), totpToken);
            if (!isValid2FA) {
                logger.warn(`Invalid 2FA token for user: ${username}`);
                return res.status(401).json({ message: 'Invalid 2FA token' });
            }
        }

        // Generate JWT
        const token = jwt.sign(
            { sub: user._id, username: user.username, role: user.role },
            JWT_SECRET,
            { expiresIn: '1d' }
        );

        // Update last login
        user.lastLogin = new Date();
        await user.save();

        logger.info(`Successful login: ${username}`);
        res.json({
            message: 'Login successful',
            token,
            user: { id: user._id, username: user.username, role: user.role }
        });
    } catch (error) {
        logger.error('Login error:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
});

// Logout Route (Informational as client should just delete token)
router.post('/logout', (req: Request, res: Response) => {
    res.json({ message: 'Logout successful' });
});

export default router;
