"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const mongoose_1 = __importDefault(require("mongoose"));
const Order_1 = __importDefault(require("../models/Order"));
const Product_1 = __importDefault(require("../models/Product"));
const router = (0, express_1.Router)();
// POST /orders
router.post('/', async (req, res) => {
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
                    name: item.name, // Assuming passed or fetched (fetching is safer but trying to match logic)
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
// GET /orders/my-orders
router.get('/my-orders', async (req, res) => {
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
            .populate('items.productId'); // populate product details
        if (!order) {
            res.status(404).json({ error: 'Order not found' });
            return;
        }
        res.json(order);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch order' });
    }
});
exports.default = router;
