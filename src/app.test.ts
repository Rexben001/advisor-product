import request from 'supertest';
import app from './app';

describe('App', () => {
    it('should return resource not found', async () => {
        const response = await request(app).get('/invalid-path').send();

        expect(response.status).toBe(404);
        expect(response.body.error).toBe('Not Found');
    });
});
