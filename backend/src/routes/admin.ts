import { Router, Request, Response } from 'express';

const router = Router();

// GET /admin/stats
router.get('/stats', (req: Request, res: Response) => {
    res.json({ message: 'Get stats' });
});

// GET /admin/stats/sales-chart
router.get('/stats/sales-chart', (req: Request, res: Response) => {
    res.json({ message: 'Get sales chart' });
});

// GET /admin/customers
router.get('/customers', (req: Request, res: Response) => {
    res.json({ message: 'List customers' });
});

// PATCH /admin/orders/:id/status
router.patch('/orders/:id/status', (req: Request, res: Response) => {
    res.json({ message: 'Update order status', id: req.params.id });
});

export default router;
