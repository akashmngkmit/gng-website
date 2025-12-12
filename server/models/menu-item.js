import mongoose from 'mongoose';

const menuItemSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: [true, 'Please add a food name'],
        },
        price: {
            type: Number,
            required: [true, 'Please add a price'],
        },
        category: {
            type: String,
            required: [true, 'Please select a category'],
            enum: ['burger', 'starter', 'desert', 'drink'], 
        },
        description: {
            type: String,
            required: [true, 'Please add a description'],
        },
        image: {
            type: String,
            required: false,
            default: 'https://placehold.co/600x400',
        },
    },
    {
        timestamps: true,
    }
);

export default mongoose.model('MenuItem', menuItemSchema);