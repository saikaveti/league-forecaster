import { authUser } from '../routes/protected';
import jwt from 'jsonwebtoken';
import { app } from '../server.js';
import request from 'supertest';

describe('protectedRoutes', () => {
    it('should route all protected routes requests through authUser', async () => {
        const response = await request(app).get('/a').send();
        expect(response.status).toBe(403);
    });
});

describe('authUser', () => {
    it('should send a 200 for CORS preflight requests', () => {
        const req = {
            method: 'OPTIONS',
        };
        const res = {
            sendStatus: jest.fn(),
        };
        const next = jest.fn();
        authUser(req, res, next);
        expect(res.sendStatus).toHaveBeenCalledWith(200);
        expect(next).not.toHaveBeenCalled();
    });
    it('should send 403 rejection to requests with no jwt cookie', () => {
        const req = {
            method: 'GET',
        };
        const res = {
            sendStatus: jest.fn(),
        };
        const next = jest.fn();
        authUser(req, res, next);
        expect(res.sendStatus).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });
    it('should send 403 rejection to requests with invalid jwt cookie', () => {
        const req = {
            method: 'GET',
            cookies: {
                token: 'aaa',
            },
        };
        const res = {
            sendStatus: jest.fn(),
        };
        const next = jest.fn();
        authUser(req, res, next);
        expect(res.sendStatus).toHaveBeenCalledWith(403);
        expect(next).not.toHaveBeenCalled();
    });
    it('should call next for requests with valid jwt cookie', () => {
        const req = {
            method: 'GET',
            cookies: {
                token: jwt.sign('username', process.env.jwt_secret),
            },
        };
        const res = {};
        const next = jest.fn();
        authUser(req, res, next);
        expect(next).toHaveBeenCalled();
    });
});
