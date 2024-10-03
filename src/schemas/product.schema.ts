import { z } from 'zod';

export const productRequest = z.object({
    name: z.string(),
    description: z.string().optional(),
    price: z.number().positive(),
});
