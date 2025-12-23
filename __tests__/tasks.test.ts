import { createTaskSchema, updateTaskSchema, taskFiltersSchema } from '@/lib/validations/task';

describe('Task Validation Schemas', () => {
    describe('createTaskSchema', () => {
        it('should validate a minimal valid task', () => {
            const validData = {
                title: 'Test Task',
            };
            const result = createTaskSchema.safeParse(validData);
            expect(result.success).toBe(true);
            if (result.success) {
                expect(result.data.status).toBe('TODO');
                expect(result.data.priority).toBe('MEDIUM');
            }
        });

        it('should validate a complete task', () => {
            const validData = {
                title: 'Complete Task',
                description: 'This is a description',
                status: 'DOING',
                priority: 'HIGH',
                dueDate: '2024-12-31T00:00:00.000Z',
                tagIds: ['tag1', 'tag2'],
            };
            const result = createTaskSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject empty title', () => {
            const invalidData = {
                title: '',
            };
            const result = createTaskSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.errors[0].message).toContain('Title is required');
            }
        });

        it('should reject invalid status', () => {
            const invalidData = {
                title: 'Test Task',
                status: 'INVALID',
            };
            const result = createTaskSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });

        it('should reject invalid priority', () => {
            const invalidData = {
                title: 'Test Task',
                priority: 'URGENT',
            };
            const result = createTaskSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });

    describe('updateTaskSchema', () => {
        it('should allow partial updates', () => {
            const validData = {
                title: 'Updated Title',
            };
            const result = updateTaskSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should validate status updates', () => {
            const validData = {
                status: 'DONE',
            };
            const result = updateTaskSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });
    });

    describe('taskFiltersSchema', () => {
        it('should validate filter parameters', () => {
            const validFilters = {
                status: 'TODO',
                priority: 'HIGH',
                search: 'test',
                sortBy: 'dueDate',
                sortOrder: 'asc',
            };
            const result = taskFiltersSchema.safeParse(validFilters);
            expect(result.success).toBe(true);
        });

        it('should accept empty filters', () => {
            const result = taskFiltersSchema.safeParse({});
            expect(result.success).toBe(true);
        });
    });
});
