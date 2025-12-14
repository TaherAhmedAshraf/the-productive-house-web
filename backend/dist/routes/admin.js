"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
// GET /admin/stats
router.get('/stats', (req, res) => {
    res.json({ message: 'Get stats' });
});
// GET /admin/stats/sales-chart
router.get('/stats/sales-chart', (req, res) => {
    res.json({ message: 'Get sales chart' });
});
// GET /admin/customers
router.get('/customers', (req, res) => {
    res.json({ message: 'List customers' });
});
// PATCH /admin/orders/:id/status
router.patch('/orders/:id/status', (req, res) => {
    res.json({ message: 'Update order status', id: req.params.id });
});
exports.default = router;
