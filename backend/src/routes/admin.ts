import { Router, Request, Response } from 'express';
import Order from '../models/Order';
import User from '../models/User';
import Product from '../models/Product';
import { verifyToken, requireAdmin } from '../middleware/auth';

const router = Router();

// Apply authentication to all admin routes
router.use(verifyToken);
router.use(requireAdmin);

// GET /admin/stats
router.get('/stats', async (req: Request, res: Response) => {
    try {
        const revenueAgg = await Order.aggregate([
            { $group: { _id: null, total: { $sum: "$total" } } }
        ]);
        const totalRevenue = revenueAgg.length > 0 ? revenueAgg[0].total : 0;

        const totalOrders = await Order.countDocuments();
        const totalCustomers = await User.countDocuments();

        // Low stock products
        const lowStock = await Product.countDocuments({ stock: { $lt: 10 } });

        res.json({
            revenue: { total: totalRevenue, growth: 0 },
            activeOrders: totalOrders,
            customers: { total: totalCustomers, newThisMonth: 0 },
            lowStockProducts: lowStock
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch stats' });
    }
});

// GET /admin/customers
router.get('/customers', async (req: Request, res: Response) => {
    try {
        const customers = await User.find({}).lean();

        const orderCounts = await Order.aggregate([
            { $group: { _id: "$userId", count: { $sum: 1 }, totalSpent: { $sum: "$total" } } }
        ]);

        const countsMap = new Map(orderCounts.map(o => [o._id && o._id.toString(), o]));

        const result = customers.map((c: any) => {
            // Match by uid
            const stats = countsMap.get(c.uid) || { count: 0, totalSpent: 0 };
            return {
                ...c,
                totalOrders: stats.count,
                totalSpent: stats.totalSpent
            };
        });

        res.json({ data: result });

    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to list customers' });
    }
});

// GET /admin/orders
router.get('/orders', async (req: Request, res: Response) => {
    try {
        const orders = await Order.find({})
            .sort({ createdAt: -1 })
            .lean();

        // Since userId is a Firebase UID string, we manually fetch users
        const userIds = [...new Set(orders.map(o => o.userId))];
        const users = await User.find({ uid: { $in: userIds } }).select('displayName email uid').lean();
        const userMap = new Map(users.map(u => [u.uid, u]));

        const results = orders.map(o => ({
            ...o,
            user: userMap.get(o.userId)
        }));

        res.json({ data: results });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// PATCH /admin/orders/:id/status
router.patch('/orders/:id/status', async (req: Request, res: Response) => {
    try {
        const { status, trackingNumber } = req.body;

        const updateData: any = { status };
        if (trackingNumber) {
            updateData.trackingNumber = trackingNumber;
        }

        const order = await Order.findByIdAndUpdate(
            req.params.id,
            updateData,
            { new: true, runValidators: true }
        );

        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }

        res.json(order);
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to update order status' });
    }
});

export default router;

