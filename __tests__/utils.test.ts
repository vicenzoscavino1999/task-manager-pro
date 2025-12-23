import { cn, formatDate, isOverdue, isUpcoming, getRelativeDate } from '@/lib/utils';

describe('Utility Functions', () => {
    describe('cn (classnames)', () => {
        it('should merge class names', () => {
            const result = cn('text-red-500', 'bg-blue-500');
            expect(result).toBe('text-red-500 bg-blue-500');
        });

        it('should handle conditional classes', () => {
            const result = cn('base', false && 'hidden', true && 'visible');
            expect(result).toBe('base visible');
        });

        it('should merge tailwind classes correctly', () => {
            const result = cn('px-4', 'px-6');
            expect(result).toBe('px-6');
        });
    });

    describe('formatDate', () => {
        it('should format a date correctly', () => {
            const date = new Date('2024-12-25');
            const result = formatDate(date);
            expect(result).toContain('Dec');
            expect(result).toContain('25');
        });

        it('should return empty string for null', () => {
            expect(formatDate(null)).toBe('');
        });
    });

    describe('isOverdue', () => {
        it('should return true for past dates', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            expect(isOverdue(yesterday)).toBe(true);
        });

        it('should return false for future dates', () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            expect(isOverdue(tomorrow)).toBe(false);
        });

        it('should return false for null', () => {
            expect(isOverdue(null)).toBe(false);
        });
    });

    describe('isUpcoming', () => {
        it('should return true for dates within 7 days', () => {
            const inThreeDays = new Date();
            inThreeDays.setDate(inThreeDays.getDate() + 3);
            expect(isUpcoming(inThreeDays)).toBe(true);
        });

        it('should return false for dates beyond 7 days', () => {
            const inTenDays = new Date();
            inTenDays.setDate(inTenDays.getDate() + 10);
            expect(isUpcoming(inTenDays, 7)).toBe(false);
        });
    });

    describe('getRelativeDate', () => {
        it('should return "Today" for today', () => {
            expect(getRelativeDate(new Date())).toBe('Today');
        });

        it('should return "Tomorrow" for tomorrow', () => {
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            expect(getRelativeDate(tomorrow)).toBe('Tomorrow');
        });

        it('should return "Yesterday" for yesterday', () => {
            const yesterday = new Date();
            yesterday.setDate(yesterday.getDate() - 1);
            expect(getRelativeDate(yesterday)).toBe('Yesterday');
        });
    });
});
