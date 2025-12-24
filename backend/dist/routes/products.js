"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Product_1 = __importDefault(require("../models/Product"));
const router = (0, express_1.Router)();
// GET /products
router.get('/', async (req, res) => {
    try {
        const products = await Product_1.default.find({}).sort({ createdAt: -1 });
        // Mongoose result is already formatted, virtuals should be included if configured
        res.json({ data: products });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});
// GET /products/:id
router.get('/:id', async (req, res) => {
    try {
        const product = await Product_1.default.findById(req.params.id);
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json({ data: product });
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch product' });
    }
});
// POST /products (Admin)
router.post('/', async (req, res) => {
    try {
        // categoryId -> category in Mongoose schema (assuming string)
        const { name, description, price, stock, categoryId, category, images, specifications } = req.body;
        const product = await Product_1.default.create({
            name,
            description,
            price,
            stock,
            category: category || categoryId,
            images: images || [], // Array
            specifications: specifications || {}, // Object
            image: (images && images.length > 0) ? images[0] : ''
        });
        res.status(201).json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to create product' });
    }
});
// PUT /products/:id (Admin)
router.put('/:id', async (req, res) => {
    try {
        const { name, description, price, stock, images, specifications, category } = req.body;
        const updateData = {};
        if (name)
            updateData.name = name;
        if (description)
            updateData.description = description;
        if (price !== undefined)
            updateData.price = price;
        if (stock !== undefined)
            updateData.stock = stock;
        if (images) {
            updateData.images = images;
            if (images.length > 0)
                updateData.image = images[0];
        }
        if (specifications)
            updateData.specifications = specifications;
        if (category)
            updateData.category = category;
        const product = await Product_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!product) {
            res.status(404).json({ error: 'Product not found' });
            return;
        }
        res.json(product);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});
exports.default = router;
