import { Response } from 'express';

export const errorResponseHandler = (
    res: Response,
    error: Error | string,
    statusCode?: number,
) => {
    const errorMessage = error?.toString();
    const status = statusCode || 500;

    console.error(`[ERROR] ${status} - ${errorMessage}`);

    res.status(status).json({
        error: errorMessage,
    });
};
