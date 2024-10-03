import { Request, Response } from 'express';
import { Product } from '../models';
import { errorResponseHandler } from '../utils/errorResponseHandler';
import logger from '../logger';
export async function createProduct(req: Request, res: Response) {
    try {
        const { name, description, price } = req.body;
        const advisorId = req.body.advisorId;

        const product = await Product.create({
            name,
            description,
            price,
            advisorId,
        });
        logger.info('Product created successfully', {
            productId: product.id,
            advisorId,
        });
        res.status(201).json(product);
    } catch (error) {
        errorResponseHandler(res, error);
    }
}

export async function getProducts(req: Request, res: Response) {
    try {
        const advisorId = req.body.advisorId;
        const products = await Product.findAll({ where: { advisorId } });
        logger.info('Total products fetched', {
            advisorId,
            productLength: products.length,
        });
        res.json(products);
    } catch (error) {
        errorResponseHandler(res, error);
    }
}

export async function getProductById(req: Request, res: Response) {
    try {
        const advisorId = parseInt(req.body.advisorId);
        const { id } = req.params;
        const product = await Product.findByPk(id);

        if (!product) {
            const query = JSON.stringify({ advisorId, productId: id });
            errorResponseHandler(res, `Product not found ${query}`, 404);
            return;
        }
        if (product?.advisorId !== advisorId) {
            const query = JSON.stringify({
                advisorId,
                productId: product.id,
            });

            errorResponseHandler(
                res,
                `Not authorized to get this product ${query}`,
                403,
            );
            return;
        }
        logger.info('Product retrieved successfully', {
            advisorId,
            productId: product.id,
        });
        res.json(product);
    } catch (error) {
        console.error(error);
        errorResponseHandler(res, error);
    }
}
