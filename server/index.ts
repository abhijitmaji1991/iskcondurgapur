import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import logger from '../src/utils/logger';
import authRoutes from './routes/auth.routes';
import { protectRoute } from './middleware/auth.middleware';

dotenv.config();

const app = express();
const PORT = process.env.BACKEND_PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/iskcon_website';

mongoose.connect(MONGODB_URI)
    .then(() => logger.info('Express Backend: MongoDB connected'))
    .catch(err => logger.error('Express Backend: MongoDB connection error:', err));

import resourceRoutes from './routes/resource.routes';

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/resources', resourceRoutes);

// Basic Routes
app.get('/api/health', (req: Request, res: Response) => {
    res.json({ status: 'healthy', timestamp: new Date() });
});

// Sample Protected Route
app.get('/api/admin/dashboard', protectRoute, (req: Request, res: Response) => {
    res.json({ message: 'Welcome to the Admin Dashboard', user: req.user });
});

// Start Server
app.listen(PORT, () => {
    console.log(`
  🚀 ISKCON Backend Server running on port ${PORT}
  📍 URL: http://localhost:${PORT}
  `);
});
