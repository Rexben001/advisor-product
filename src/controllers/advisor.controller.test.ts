import request from 'supertest';
import app from '../app';
import { Advisor } from '../models/index';
import bcrypt from 'bcryptjs';
import { sequelize } from '../models/setupDb';
import { UniqueConstraintError } from 'sequelize';
import logger from '../logger';

jest.mock('../models');

jest.mock('bcryptjs');

jest.mock('../services/auth.service', () => ({
    generateAccessToken: jest.fn(() => 'fakeAccessToken'),
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

describe('AdvisorController - Register', () => {
    it('should register a new advisor and return 201', async () => {
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword');
        (Advisor.create as jest.Mock).mockResolvedValue({
            id: 1,
            email: 'test@example.com',
            password: 'hashedPassword',
            name: 'Test Advisor',
        });

        const response = await request(app)
            .post('/api/advisors/register')
            .send({
                email: 'test@example.com',
                password: 'password123',
                name: 'Test Advisor',
            });

        expect(response.status).toBe(201);
        expect(response.body.email).toBe('test@example.com');
        expect(logger.info).toHaveBeenCalledWith(
            'Advisor created successfully',
            { advisorId: 1 },
        );
    });

    it('should return 400 if the advisor email already exists', async () => {
        (Advisor.create as jest.Mock).mockRejectedValue(
            new UniqueConstraintError({}),
        );

        const response = await request(app)
            .post('/api/advisors/register')
            .send({
                email: 'existing@example.com',
                password: 'password123',
                name: 'Test Advisor',
            });

        expect(response.status).toBe(400);
        expect(response.body.error).toBe(
            'Unable to register. Email may already exist.',
        );
        expect(logger.error).toHaveBeenCalledWith(
            '[ERROR] 400 - Unable to register. Email may already exist.',
        );
    });

    it('should return 422 if the request body is not valid', async () => {
        const response = await request(app)
            .post('/api/advisors/register')
            .send({
                email: '',
                password: 'password123',
                name: 'Test Advisor',
            });

        expect(response.status).toBe(422);
        expect(response.body.error).toBe('Invalid email at "email"');
        expect(logger.error).toHaveBeenCalledWith(
            '[ERROR] 422 - Invalid email at "email"',
        );
    });
});

describe('AdvisorController - Login', () => {
    it('should login an advisor and return access tokens', async () => {
        (bcrypt.compare as jest.Mock).mockResolvedValue(true);
        (Advisor.findOne as jest.Mock).mockResolvedValue({
            id: 1,
            email: 'test@example.com',
            password: 'hashedPassword',
        });

        const response = await request(app).post('/api/advisors/login').send({
            email: 'test@example.com',
            password: 'password123',
        });

        expect(response.status).toBe(200);
        expect(response.body.token).toBe('fakeAccessToken');
        expect(logger.info).toHaveBeenCalledWith(
            'Advisor logged in successfully',
            {
                advisorId: 1,
            },
        );
    });

    it('should return 401 if the password is incorrect', async () => {
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        const response = await request(app).post('/api/advisors/login').send({
            email: 'test@example.com',
            password: 'wrongPassword',
        });

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Invalid email or password');
        expect(logger.error).toHaveBeenCalledWith(
            '[ERROR] 404 - Invalid email or password',
        );
    });
});
