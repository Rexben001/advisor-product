import express, { Request, Response } from 'express';
import dotenv from 'dotenv';
import helmet from 'helmet';
import { sequelize } from './models/setupDb';
import advisorRoutes from './routes/advisor.route';
import productRoutes from './routes/product.route';

dotenv.config();
const app = express();

app.use(express.json());
app.use(helmet());

app.use('/api/advisors', advisorRoutes);
app.use('/api/products', productRoutes);

app.use((_req: Request, res: Response) => {
    res.status(404).json({ error: 'Not Found' });
});

sequelize.sync().then(() => {});

export default app;
