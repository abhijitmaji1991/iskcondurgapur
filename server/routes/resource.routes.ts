import express from 'express';
import {
    getAllResources,
    getResourceById,
    createResource,
    updateResource,
    deleteResource
} from '../controllers/resource.controller';
// Assuming you have an auth middleware
import { protectRoute } from '../middleware/auth.middleware';

const router = express.Router();

router.get('/', getAllResources);
router.get('/:id', getResourceById);

// Protected routes
router.post('/', protectRoute, createResource);
router.put('/:id', protectRoute, updateResource);
router.delete('/:id', protectRoute, deleteResource);

export default router;
