import { registerSchema, loginSchema } from '@/lib/validations/auth';

describe('Auth Validation Schemas', () => {
    describe('registerSchema', () => {
        it('should validate a correct registration', () => {
            const validData = {
                email: 'test@example.com',
                password: 'password123',
                name: 'Test User',
            };
            const result = registerSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject invalid email', () => {
            const invalidData = {
                email: 'invalid-email',
                password: 'password123',
            };
            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.errors[0].message).toBe('Invalid email address');
            }
        });

        it('should reject short password', () => {
            const invalidData = {
                email: 'test@example.com',
                password: '123',
            };
            const result = registerSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
            if (!result.success) {
                expect(result.error.errors[0].message).toContain('at least 6 characters');
            }
        });
    });

    describe('loginSchema', () => {
        it('should validate correct login credentials', () => {
            const validData = {
                email: 'test@example.com',
                password: 'password123',
            };
            const result = loginSchema.safeParse(validData);
            expect(result.success).toBe(true);
        });

        it('should reject empty password', () => {
            const invalidData = {
                email: 'test@example.com',
                password: '',
            };
            const result = loginSchema.safeParse(invalidData);
            expect(result.success).toBe(false);
        });
    });
});
