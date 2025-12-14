import { Router, Request, Response } from 'express';

const router = Router();

// POST /orders
router.post('/', (req: Request, res: Response) => {
    res.status(201).json({ message: 'Create order' });
});

// GET /orders/my-orders
router.get('/my-orders', (req: Request, res: Response) => {
    res.json({ message: 'List my orders' });
});

// GET /orders/:id
router.get('/:id', (req: Request, res: Response) => {
    res.json({ message: 'Get order details', id: req.params.id });
});

export default router;
