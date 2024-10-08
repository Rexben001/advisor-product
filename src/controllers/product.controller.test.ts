import request from 'supertest';
import app from '../app';
import { Product } from '../models/index';
import { sequelize } from '../models/setupDb';
import logger from '../logger';

jest.mock('../models');

jest.mock('../middlewares/auth.middleware', () => ({
    authenticateToken: jest.fn((req, res, next) => {
        req.body.advisorId = 1;
        next();
    }),
}));

jest.mock('../logger', () => ({
    info: jest.fn(),
    error: jest.fn(),
}));

beforeAll(async () => {
    await sequelize.sync({ force: true });
});

afterAll(async () => {
    await sequelize.close();
});

afterEach(() => {
    jest.clearAllMocks();
});

describe('ProductController - Create Product', () => {
    it('should create a new product for the authenticated advisor', async () => {
        (Product.create as jest.Mock).mockResolvedValue({
            id: 1,
            name: 'Test Product',
            description: 'This is a test product',
            price: 100.0,
            advisorId: 1,
        });

        const response = await request(app)
            .post('/api/products')
            .set('Authorization', 'Bearer fakeAccessToken')
            .send({
                name: 'Test Product',
                description: 'This is a test product',
                price: 100.0,
            });

        expect(response.status).toBe(201);
        expect(response.body.name).toBe('Test Product');
        expect(response.body.advisorId).toBe(1);
        expect(logger.info).toHaveBeenCalledWith(
            'Product created successfully',
            {
                productId: 1,
                advisorId: 1,
            },
        );
    });

    it('should return 422 if product validation fails', async () => {
        const response = await request(app)
            .post('/api/products')
            .set('Authorization', 'Bearer fakeAccessToken')
            .send({
                name: '',
                description: 'Invalid product',
                price: 0,
            });

        expect(response.status).toBe(422);
        expect(response.body.error).toBe(
            'Number must be greater than 0 at "price"',
        );
        expect(logger.error).toHaveBeenCalledWith(
            '[ERROR] 422 - Number must be greater than 0 at "price"',
        );
    });

    it('should handle thrown errors', async () => {
        (Product.create as jest.Mock).mockRejectedValue(
            new Error('Internal server error'),
        );

        const response = await request(app)
            .post('/api/products')
            .set('Authorization', 'Bearer fakeAccessToken')
            .send({
                name: '',
                description: 'Invalid product',
                price: 10,
            });

        expect(response.status).toBe(500);
        expect(response.body.error).toBe('Error: Internal server error');
        expect(logger.error).toHaveBeenCalledWith(
            '[ERROR] 500 - Error: Internal server error',
        );
    });
});

describe('ProductController - Get Products', () => {
    it('should return products for the authenticated advisor', async () => {
        (Product.findAll as jest.Mock).mockResolvedValue([
            {
                id: 1,
                name: 'Test Product',
                description: 'This is a test product',
                price: 100.0,
                advisorId: 1,
            },
        ]);

        const response = await request(app)
            .get('/api/products')
            .set('Authorization', 'Bearer fakeAccessToken');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(1);
        expect(response.body[0].name).toBe('Test Product');
        expect(logger.info).toHaveBeenCalledWith('Total products fetched', {
            productLength: 1,
            advisorId: 1,
        });
    });

    it('should return an empty array if no products exist', async () => {
        (Product.findAll as jest.Mock).mockResolvedValue([]);

        const response = await request(app)
            .get('/api/products')
            .set('Authorization', 'Bearer fakeAccessToken');

        expect(response.status).toBe(200);
        expect(response.body.length).toBe(0);
        expect(logger.info).toHaveBeenCalledWith('Total products fetched', {
            productLength: 0,
            advisorId: 1,
        });
    });
});

describe('ProductController - Get Product By ID', () => {
    it('should return product for the authorized user', async () => {
        (Product.findByPk as jest.Mock).mockResolvedValue({
            id: 1,
            name: 'Test Product',
            description: 'This is a test product',
            price: 100.0,
            advisorId: 1,
        });

        const response = await request(app)
            .get('/api/products/1')
            .set('Authorization', 'Bearer fakeAccessToken');

        expect(response.status).toBe(200);
        expect(response.body.name).toBe('Test Product');
        expect(logger.info).toHaveBeenCalledWith(
            'Product retrieved successfully',
            {
                productId: 1,
                advisorId: 1,
            },
        );
    });

    it('should return 404 if the product does not exist', async () => {
        (Product.findByPk as jest.Mock).mockResolvedValue(null);

        const response = await request(app)
            .get('/api/products/1')
            .set('Authorization', 'Bearer fakeAccessToken');

        expect(response.status).toBe(404);
        expect(logger.error).toHaveBeenCalledWith(
            '[ERROR] 404 - Product not found {"advisorId":1,"productId":"1"}',
        );
    });

    it('should return unauthorized when the product does not belong to the advisor ', async () => {
        (Product.findByPk as jest.Mock).mockResolvedValue({
            id: 1,
            name: 'Test Product',
            description: 'This is a test product',
            price: 100.0,
            advisorId: 2,
        });
        const response = await request(app)
            .get('/api/products/1')
            .set('Authorization', 'Bearer fakeAccessToken');

        expect(response.status).toBe(403);
        expect(logger.error).toHaveBeenCalledWith(
            '[ERROR] 403 - Not authorized to get this product {"advisorId":1,"productId":1}',
        );
    });
});
