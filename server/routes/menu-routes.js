import express from 'express';
import mongoose from 'mongoose';
import MenuItem from '../models/menu-item.js';
import { HTTP_STATUS } from '../utils/http-status.js';

const router = express.Router();

// Helper to validate Mongo ID
const isValidId = (id) => mongoose.Types.ObjectId.isValid(id);

// @desc    Get all menu items
// @route   GET /api/menu
router.get('/', async (req, res) => {
    try {
        const items = await MenuItem.find();
        res.status(HTTP_STATUS.OK).json(items);
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
});

// @desc    Create a new menu item
// @route   POST /api/menu
router.post('/', async (req, res) => {
    try {
        const { name, price, category, description } = req.body;

        if (!name || !price || !category || !description) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Please provide all required fields' });
        }

        const newItem = await MenuItem.create(req.body);
        res.status(HTTP_STATUS.CREATED).json(newItem);
    } catch (error) {
        res.status(HTTP_STATUS.BAD_REQUEST).json({ message: error.message });
    }
});

// @desc    Update a menu item
// @route   PUT /api/menu/:id
router.put('/:id', async (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category, description } = req.body;

        if (!isValidId(id)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid ID format' });
        }

        if (!name || !price || !category || !description) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Please provide all required fields' });
        }

        const updatedItem = await MenuItem.findByIdAndUpdate(
            id,
            req.body,
            { new: true } 
        );

        if (!updatedItem) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Item not found' });
        }

        res.status(HTTP_STATUS.OK).json(updatedItem);
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
});

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
router.delete('/:id', async (req, res) => {
    try {
        const { id } = req.params;

        if (!isValidId(id)) {
            return res.status(HTTP_STATUS.BAD_REQUEST).json({ message: 'Invalid ID format' });
        }

        const item = await MenuItem.findByIdAndDelete(id);

        if (!item) {
            return res.status(HTTP_STATUS.NOT_FOUND).json({ message: 'Item not found' });
        }

        res.status(HTTP_STATUS.OK).json({ id, message: 'Item deleted' });
    } catch (error) {
        res.status(HTTP_STATUS.INTERNAL_SERVER_ERROR).json({ message: error.message });
    }
});

export default router;