"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Order_1 = __importDefault(require("../models/Order"));
const User_1 = __importDefault(require("../models/User"));
const Product_1 = __importDefault(require("../models/Product"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// Apply authentication to all admin routes
router.use(auth_1.verifyToken);
router.use(auth_1.requireAdmin);
// GET /admin/stats
router.get('/stats', async (req, res) => {
    try {
        const revenueAgg = await Order_1.default.aggregate([
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;
        const totalOrders = await Order_1.default.countDocuments();
        const totalCustomers = await User_1.default.countDocuments();
        // Low stock products
        const lowStock = await Product_1.default.countDocuments({ stock: { $lt: 10 } });
        res.json({
            revenue: { total: totalRevenue, growth: 0 },
            activeOrders: totalOrders,
            customers: { total: totalCustomers, newThisMonth: 0 },
            lowStockProducts: lowStock
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});
// GET /admin/customers
router.get('/customers', async (req, res) => {
    try {
        const customers = await User_1.default.find({}).lean();
        const orderCounts = await Order_1.default.aggregate([
            { $group: { _id: "$userId", count: { $sum: 1 }, totalSpent: { $sum: "$total" } } }
        ]);
        const countsMap = new Map(orderCounts.map(o => [o._id && o._id.toString(), o]));
        const result = customers.map((c) => {
            // Match by uid
            const stats = countsMap.get(c.uid) || { count: 0, totalSpent: 0 };
            return {
                ...c,
                totalOrders: stats.count,
                totalSpent: stats.totalSpent
            };
        });
        res.json({ data: result });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to list customers' });
    }
});
// GET /admin/orders
router.get('/orders', async (req, res) => {
    try {
        const orders = await Order_1.default.find({})
            .sort({ createdAt: -1 })
            .lean();
        // Since userId is a Firebase UID string, we manually fetch users
        const userIds = [...new Set(orders.map(o => o.userId))];
        const users = await User_1.default.find({ uid: { $in: userIds } }).select('displayName email uid').lean();
        const userMap = new Map(users.map(u => [u.uid, u]));
        const results = orders.map(o => ({
            ...o,
            user: userMap.get(o.userId)
        }));
        res.json({ data: results });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});
// PATCH /admin/orders/:id/status
router.patch('/orders/:id/status', async (req, res) => {
    try {
        const { status, trackingNumber } = req.body;
        const updateData = { status };
        if (trackingNumber) {
            updateData.trackingNumber = trackingNumber;
        }
        const order = await Order_1.default.findByIdAndUpdate(req.params.id, updateData, { new: true, runValidators: true });
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        res.json(order);
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});
exports.default = router;
