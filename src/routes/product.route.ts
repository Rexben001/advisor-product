import { Router } from 'express';
import {
    createProduct,
    getProductById,
    getProducts,
} from '../controllers/product.controller';
import { authenticateToken } from '../middlewares/auth.middleware';
import { validateData } from '../middlewares/validation.middleware';
import { productRequest } from '../schemas/product.schema';

const router = Router();

router
    .route('/')
    .post(validateData(productRequest), authenticateToken, createProduct)
    .get(authenticateToken, getProducts);

router.get('/:id', authenticateToken, getProductById);

export default router;
