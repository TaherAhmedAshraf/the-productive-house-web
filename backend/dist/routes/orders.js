"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// POST /orders
router.post('/', (req, res) => {
    res.status(201).json({ message: 'Create order' });
});
// GET /orders/my-orders
router.get('/my-orders', (req, res) => {
    res.json({ message: 'List my orders' });
});
// GET /orders/:id
router.get('/:id', (req, res) => {
    res.json({ message: 'Get order details', id: req.params.id });
});
exports.default = router;
