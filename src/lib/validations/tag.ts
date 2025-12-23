import { z } from 'zod';

export const createTagSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name is too long'),
    color: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format')
        .default('#3b82f6'),
});

export const updateTagSchema = z.object({
    name: z.string().min(1, 'Name is required').max(50, 'Name is too long').optional(),
    color: z
        .string()
        .regex(/^#[0-9A-Fa-f]{6}$/, 'Invalid color format')
        .optional(),
});

export type CreateTagInput = z.infer<typeof createTagSchema>;
export type UpdateTagInput = z.infer<typeof updateTagSchema>;
