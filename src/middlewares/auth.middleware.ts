import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { errorResponseHandler } from '../utils/errorResponseHandler';

interface AdvisorPayload {
    id: number;
}

export function authenticateToken(
    req: Request,
    res: Response,
    next: NextFunction,
) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
        errorResponseHandler(res, 'Not authenticated', 401);
    } else {
        jwt.verify(token, process.env.JWT_SECRET as string, (err, payload) => {
            if (err) errorResponseHandler(res, 'Not authenticated', 401);
            else {
                req.body.advisorId = (payload as AdvisorPayload).id;
                next();
            }
        });
    }
}
