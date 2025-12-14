import { Router, Request, Response } from 'express';

const router = Router();

// POST /users/profile
router.post('/profile', (req: Request, res: Response) => {
    res.json({ message: 'Update profile' });
});

export default router;
