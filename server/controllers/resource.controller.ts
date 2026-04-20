import { Request, Response } from 'express';
import Resource from '../../src/models/resource.model';
import logger from '../../src/utils/logger';

export const getAllResources = async (req: Request, res: Response) => {
    try {
        const { type, category, search, limit = 20, page = 1 } = req.query;
        const query: any = {};

        if (type) query.type = type;
        if (category) query.category = category;
        if (search) {
            query.$or = [
                { title: { $regex: search, $options: 'i' } },
                { description: { $regex: search, $options: 'i' } },
                { author: { $regex: search, $options: 'i' } }
            ];
        }

        const skip = (Number(page) - 1) * Number(limit);
        const resources = await Resource.find(query)
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(Number(limit));

        const total = await Resource.countDocuments(query);

        res.json({
            success: true,
            data: resources,
            pagination: {
                total,
                page: Number(page),
                pages: Math.ceil(total / Number(limit))
            }
        });
    } catch (error) {
        logger.error('Error fetching resources:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const getResourceById = async (req: Request, res: Response) => {
    try {
        const resource = await Resource.findById(req.params.id);
        if (!resource) {
            return res.status(404).json({ success: false, message: 'Resource not found' });
        }
        res.json({ success: true, data: resource });
    } catch (error) {
        logger.error('Error fetching resource:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const createResource = async (req: Request, res: Response) => {
    try {
        const resource = await Resource.create(req.body);
        logger.info(`Resource created: ${resource.title}`);
        res.status(201).json({ success: true, data: resource });
    } catch (error) {
        logger.error('Error creating resource:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const updateResource = async (req: Request, res: Response) => {
    try {
        const resource = await Resource.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!resource) {
            return res.status(404).json({ success: false, message: 'Resource not found' });
        }

        logger.info(`Resource updated: ${resource.title}`);
        res.json({ success: true, data: resource });
    } catch (error) {
        logger.error('Error updating resource:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};

export const deleteResource = async (req: Request, res: Response) => {
    try {
        const resource = await Resource.findByIdAndDelete(req.params.id);

        if (!resource) {
            return res.status(404).json({ success: false, message: 'Resource not found' });
        }

        logger.info(`Resource deleted: ${req.params.id}`);
        res.json({ success: true, message: 'Resource deleted successfully' });
    } catch (error) {
        logger.error('Error deleting resource:', error);
        res.status(500).json({ success: false, message: 'Server error' });
    }
};
