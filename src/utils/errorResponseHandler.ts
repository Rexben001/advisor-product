import { Response } from 'express';
import logger from '../logger';

export const errorResponseHandler = (
    res: Response,
    error: Error | string,
    statusCode?: number,
) => {
    const errorMessage = error?.toString();
    const status = statusCode || 500;

    logger.error(`[ERROR] ${status} - ${errorMessage}`);

    res.status(status).json({
        error: errorMessage,
    });
};
