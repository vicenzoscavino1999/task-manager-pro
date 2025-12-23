import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';

// GET /api/tasks/stats - Get task statistics
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const userId = session.user.id;
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const sevenDaysFromNow = new Date();
        sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7);
        sevenDaysFromNow.setHours(23, 59, 59, 999);

        // Get all counts in parallel
        const [
            total,
            todoCount,
            doingCount,
            doneCount,
            overdueCount,
            upcomingCount,
            highPriorityCount,
        ] = await Promise.all([
            prisma.task.count({ where: { userId } }),
            prisma.task.count({ where: { userId, status: 'TODO' } }),
            prisma.task.count({ where: { userId, status: 'DOING' } }),
            prisma.task.count({ where: { userId, status: 'DONE' } }),
            prisma.task.count({
                where: {
                    userId,
                    status: { not: 'DONE' },
                    dueDate: { lt: today },
                },
            }),
            prisma.task.count({
                where: {
                    userId,
                    status: { not: 'DONE' },
                    dueDate: {
                        gte: today,
                        lte: sevenDaysFromNow,
                    },
                },
            }),
            prisma.task.count({
                where: {
                    userId,
                    status: { not: 'DONE' },
                    priority: 'HIGH',
                },
            }),
        ]);

        return NextResponse.json({
            total,
            byStatus: {
                todo: todoCount,
                doing: doingCount,
                done: doneCount,
            },
            overdue: overdueCount,
            upcoming: upcomingCount,
            highPriority: highPriorityCount,
            completionRate: total > 0 ? Math.round((doneCount / total) * 100) : 0,
        });
    } catch (error) {
        console.error('Get stats error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
