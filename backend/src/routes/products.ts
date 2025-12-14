import { Router, Request, Response } from 'express';

const router = Router();

// GET /products
router.get('/', (req: Request, res: Response) => {
    res.json({ message: 'List products' });
});

// GET /products/:id
router.get('/:id', (req: Request, res: Response) => {
    res.json({ message: 'Get product details', id: req.params.id });
});

// POST /products (Admin)
router.post('/', (req: Request, res: Response) => {
    res.status(201).json({ message: 'Create product' });
});

// PUT /products/:id (Admin)
router.put('/:id', (req: Request, res: Response) => {
    res.json({ message: 'Update product', id: req.params.id });
});

export default router;
