import { z } from 'zod';

export const createTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title is too long'),
    description: z.string().max(2000, 'Description is too long').optional().nullable(),
    status: z.enum(['TODO', 'DOING', 'DONE']).default('TODO'),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).default('MEDIUM'),
    dueDate: z.string().datetime().optional().nullable(),
    tagIds: z.array(z.string()).optional().default([]),
});

export const updateTaskSchema = z.object({
    title: z.string().min(1, 'Title is required').max(200, 'Title is too long').optional(),
    description: z.string().max(2000, 'Description is too long').optional().nullable(),
    status: z.enum(['TODO', 'DOING', 'DONE']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    dueDate: z.string().datetime().optional().nullable(),
    tagIds: z.array(z.string()).optional(),
});

export const taskFiltersSchema = z.object({
    status: z.enum(['TODO', 'DOING', 'DONE']).optional(),
    priority: z.enum(['LOW', 'MEDIUM', 'HIGH']).optional(),
    tagId: z.string().optional(),
    search: z.string().optional(),
    dueDateFrom: z.string().datetime().optional(),
    dueDateTo: z.string().datetime().optional(),
    sortBy: z.enum(['dueDate', 'createdAt', 'priority', 'title']).optional().default('createdAt'),
    sortOrder: z.enum(['asc', 'desc']).optional().default('desc'),
});

export type CreateTaskInput = z.infer<typeof createTaskSchema>;
export type UpdateTaskInput = z.infer<typeof updateTaskSchema>;
export type TaskFilters = z.infer<typeof taskFiltersSchema>;
