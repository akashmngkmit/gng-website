import express from 'express';
import MenuItem from '../models/menu-item.js';

const router = express.Router();

// @desc    Get all menu items
// @route   GET /api/menu
router.get('/', async (req, res) => {
    try {
        const items = await MenuItem.find(); // Find all
        res.status(200).json(items);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Create a new menu item
// @route   POST /api/menu
router.post('/', async (req, res) => {
    try {
        const newItem = await MenuItem.create(req.body);
        res.status(201).json(newItem); // 201 = Created
    } catch (error) {
        res.status(400).json({ message: error.message });
    }
});

// @desc    Update a menu item
// @route   PUT /api/menu/:id
router.put('/:id', async (req, res) => {
    try {
        const updatedItem = await MenuItem.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );

        if (!updatedItem) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json(updatedItem);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

// @desc    Delete a menu item
// @route   DELETE /api/menu/:id
router.delete('/:id', async (req, res) => {
    try {
        const item = await MenuItem.findByIdAndDelete(req.params.id);

        if (!item) {
            return res.status(404).json({ message: 'Item not found' });
        }

        res.status(200).json({ id: req.params.id, message: 'Item deleted' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
});

export default router;