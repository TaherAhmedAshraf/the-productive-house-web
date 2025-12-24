"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Order_1 = __importDefault(require("../models/Order"));
const User_1 = __importDefault(require("../models/User"));
const Product_1 = __importDefault(require("../models/Product"));
const router = (0, express_1.Router)();
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
exports.default = router;
