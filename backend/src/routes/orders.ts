import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import Order from '../models/Order';
import Product from '../models/Product';
import User from '../models/User';
import { verifyToken } from '../middleware/auth';

const router = Router();

// POST /orders - Protected (requires authentication)
router.post('/', verifyToken, async (req: Request, res: Response) => {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
        const { userId, items, shippingAddress, total } = req.body;

        // 1. Validate stock & decrement
        for (const item of items) {
            const product = await Product.findById(item.productId).session(session);
            if (!product) {
                throw new Error(`Product ${item.productId} not found`);
            }
            if (product.stock < item.quantity) {
                throw new Error(`Insufficient stock for product ${product.name}`);
            }
            product.stock -= item.quantity;
            await product.save({ session });
        }

        // 2. Create Order
        const order = await Order.create([{
            userId,
            items: items.map((item: any) => ({
                productId: item.productId,
                name: item.name,
                price: item.price,
                quantity: item.quantity,
                image: item.image
            })),
            total,
            shippingAddress,
            status: 'pending'
        }], { session });

        await session.commitTransaction();
        res.status(201).json(order[0]);
    } catch (error: any) {
        await session.abortTransaction();
        console.error(error);
        res.status(500).json({ error: error.message || 'Failed to create order' });
    } finally {
        session.endSession();
    }
});

// GET /orders/my-orders - Protected
router.get('/my-orders', verifyToken, async (req: Request, res: Response) => {
    try {
        const userId = req.query.userId as string;
        if (!userId) {
            res.status(400).json({ error: 'Missing userId' });
            return;
        }

        const orders = await Order.find({ userId }).sort({ createdAt: -1 });
        res.json(orders);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// GET /orders/:id
router.get('/:id', async (req: Request, res: Response) => {
    try {
        const order = await Order.findById(req.params.id)
            .populate('items.productId')
            .lean();

        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }

        // Attach user info (lookup by Firebase UID)
        const user = await User.findOne({ uid: order.userId }).select('displayName email uid').lean();

        res.json({
            ...order,
            user: user || null
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});

export default router;
