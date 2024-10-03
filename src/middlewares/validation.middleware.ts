import { Request, Response, NextFunction } from 'express';
import { ZodError, ZodSchema } from 'zod';
import { fromError } from 'zod-validation-error';
import { errorResponseHandler } from '../utils/errorResponseHandler';

export function validateData(schema: ZodSchema) {
    return (req: Request, res: Response, next: NextFunction) => {
        try {
            schema.parse(req.body);
            next();
        } catch (error) {
            if (error instanceof ZodError) {
                const validationError = fromError(error, { prefix: null });
                errorResponseHandler(res, validationError.toString(), 422);
            } else {
                errorResponseHandler(res, error);
            }
        }
    };
}
