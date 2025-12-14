"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// GET /products
router.get('/', (req, res) => {
    res.json({ message: 'List products' });
});
// GET /products/:id
router.get('/:id', (req, res) => {
    res.json({ message: 'Get product details', id: req.params.id });
});
// POST /products (Admin)
router.post('/', (req, res) => {
    res.status(201).json({ message: 'Create product' });
});
// PUT /products/:id (Admin)
router.put('/:id', (req, res) => {
    res.json({ message: 'Update product', id: req.params.id });
});
exports.default = router;
