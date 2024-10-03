import request from 'supertest';
import app from '../app'; // Import the Express app
import { Advisor } from '../models/index';
import bcrypt from 'bcryptjs';
import { sequelize } from '../models/setupDb';
import { UniqueConstraintError } from 'sequelize';

// Mocking the Sequelize model methods
jest.mock('../models');

// Mock bcrypt functions
jest.mock('bcryptjs');

// Mock JWT generation
jest.mock('../services/auth.service', () => ({
    generateAccessToken: jest.fn(() => 'fakeAccessToken'),
}));

beforeAll(async () => {
    await sequelize.sync({ force: true }); // Sync the database before tests
});

afterAll(async () => {
    await sequelize.close(); // Close the connection after tests
});

describe('AdvisorController - Register', () => {
    it('should register a new advisor and return 201', async () => {
        (bcrypt.hash as jest.Mock).mockResolvedValue('hashedPassword'); // Mock password hashing
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
    });
});

describe('AdvisorController - Login', () => {
    it('should login an advisor and return access tokens', async () => {
        (bcrypt.compare as jest.Mock).mockResolvedValue(true); // Mock successful password comparison
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
    });

    it('should return 401 if the password is incorrect', async () => {
        (bcrypt.compare as jest.Mock).mockResolvedValue(false);

        const response = await request(app).post('/api/advisors/login').send({
            email: 'test@example.com',
            password: 'wrongPassword',
        });

        expect(response.status).toBe(401);
        expect(response.body.error).toBe('Invalid email or password');
    });
});
