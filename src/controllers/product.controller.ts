import { Request, Response } from 'express';
import { Product } from '../models';
import { errorResponseHandler } from '../utils/errorResponseHandler';

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
        res.status(201).json(product);
    } catch (error) {
        errorResponseHandler(res, error);
    }
}

export async function getProducts(req: Request, res: Response) {
    try {
        const advisorId = req.body.advisorId;
        const products = await Product.findAll({ where: { advisorId } });
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

        if (product?.advisorId !== advisorId)
            errorResponseHandler(res, 'Not authorized', 403);
        else res.json(product);
    } catch (error) {
        console.error(error);
        errorResponseHandler(res, error);
    }
}
