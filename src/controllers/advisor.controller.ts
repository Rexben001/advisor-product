import { Request, Response } from 'express';

import bcrypt from 'bcryptjs';
import { Advisor } from '../models';
import { generateAccessToken } from '../services/auth.service';
import { UniqueConstraintError } from 'sequelize';
import { errorResponseHandler } from '../utils/errorResponseHandler';

export async function register(req: Request, res: Response) {
    try {
        const advisor = await Advisor.create(req.body);

        const { id, name, email } = advisor;

        const token = generateAccessToken(id);

        res.status(201).json({
            name,
            email,
            token,
        });
    } catch (error) {
        if (error instanceof UniqueConstraintError)
            errorResponseHandler(
                res,
                'Unable to register. Email may already exist.',
                400,
            );
        else errorResponseHandler(res, error);
    }
}

export async function login(req: Request, res: Response) {
    const { email, password } = req.body;

    try {
        const advisor = await Advisor.findOne({ where: { email } });

        if (!advisor || !(await bcrypt.compare(password, advisor.password)))
            res.status(401).json({ error: 'Invalid email or password' });
        else {
            const token = generateAccessToken(advisor.id);

            res.json({ token });
        }
    } catch (error) {
        errorResponseHandler(res, error);
    }
}
