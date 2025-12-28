"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const User_1 = __importDefault(require("../models/User"));
const auth_1 = require("../middleware/auth");
const router = (0, express_1.Router)();
// POST /orders - Protected (requires authentication)
router.post('/', auth_1.verifyToken, async (req, res) => {
    const session = await mongoose_1.default.startSession();
    session.startTransaction();
    try {
        const { userId, items, shippingAddress, total } = req.body;
        // 1. Validate stock & decrement
        for (const item of items) {
            const product = await Product_1.default.findById(item.productId).session(session);
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
        const order = await Order_1.default.create([{
                userId,
                items: items.map((item) => ({
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
    }
    catch (error) {
        await session.abortTransaction();
        console.error(error);
        res.status(500).json({ error: error.message || 'Failed to create order' });
    }
    finally {
        session.endSession();
    }
});
// GET /orders/my-orders - Protected
router.get('/my-orders', auth_1.verifyToken, async (req, res) => {
    try {
        const userId = req.query.userId;
        if (!userId) {
            res.status(400).json({ error: 'Missing userId' });
            return;
        }
        const orders = await Order_1.default.find({ userId }).sort({ createdAt: -1 });
        res.json(orders);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});
// GET /orders/:id
router.get('/:id', async (req, res) => {
    try {
        const order = await Order_1.default.findById(req.params.id)
            .populate('items.productId')
            .lean();
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        // Attach user info (lookup by Firebase UID)
        const user = await User_1.default.findOne({ uid: order.userId }).select('displayName email uid').lean();
        res.json({
            ...order,
            user: user || null
        });
    }
    catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});
exports.default = router;
