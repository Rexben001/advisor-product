import { z } from 'zod';

export const advisorRegistrationRequest = z.object({
    email: z.string().email(),
    password: z.string().min(6),
    name: z.string(),
});

export const advisorLoginRequest = z.object({
    email: z.string().email(),
    password: z.string().min(6),
});
