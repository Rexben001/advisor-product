import jwt from 'jsonwebtoken';

export function generateAccessToken(advisorId: number): string {
    return jwt.sign({ id: advisorId }, process.env.JWT_SECRET as string, {
        expiresIn: process.env.JWT_EXPIRATION || '1h',
    });
}

export function verifyToken(token: string, secret: string) {
    return jwt.verify(token, secret);
}
