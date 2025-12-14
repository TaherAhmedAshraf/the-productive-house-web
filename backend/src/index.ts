import express, { Request, Response } from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import productsRouter from './routes/products';
import ordersRouter from './routes/orders';
import usersRouter from './routes/users';
import adminRouter from './routes/admin';

dotenv.config();

const app = express();
const port = process.env.PORT || 3001;

app.use(cors());
app.use(express.json());

app.get('/health', (req: Request, res: Response) => {
    res.send('Server is healthy');
});

// Routes
app.use('/products', productsRouter);
app.use('/orders', ordersRouter);
app.use('/users', usersRouter);
app.use('/admin', adminRouter);

app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
