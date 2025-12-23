import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createTaskSchema, taskFiltersSchema } from '@/lib/validations/task';
import { Prisma } from '@prisma/client';

// GET /api/tasks - List tasks with filters
export async function GET(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const { searchParams } = new URL(request.url);
        const params = Object.fromEntries(searchParams.entries());

        const filters = taskFiltersSchema.parse(params);

        // Build where clause
        const where: Prisma.TaskWhereInput = {
            userId: session.user.id,
        };

        if (filters.status) {
            where.status = filters.status;
        }

        if (filters.priority) {
            where.priority = filters.priority;
        }

        if (filters.tagId) {
            where.tags = {
                some: {
                    tagId: filters.tagId,
                },
            };
        }

        if (filters.search) {
            where.OR = [
                { title: { contains: filters.search, mode: 'insensitive' } },
                { description: { contains: filters.search, mode: 'insensitive' } },
            ];
        }

        if (filters.dueDateFrom || filters.dueDateTo) {
            where.dueDate = {};
            if (filters.dueDateFrom) {
                where.dueDate.gte = new Date(filters.dueDateFrom);
            }
            if (filters.dueDateTo) {
                where.dueDate.lte = new Date(filters.dueDateTo);
            }
        }

        // Build orderBy
        const orderBy: Prisma.TaskOrderByWithRelationInput = {};
        if (filters.sortBy === 'dueDate') {
            orderBy.dueDate = filters.sortOrder;
        } else if (filters.sortBy === 'priority') {
            orderBy.priority = filters.sortOrder;
        } else if (filters.sortBy === 'title') {
            orderBy.title = filters.sortOrder;
        } else {
            orderBy.createdAt = filters.sortOrder;
        }

        const tasks = await prisma.task.findMany({
            where,
            orderBy,
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        // Transform to flatten tags
        const transformedTasks = tasks.map((task) => ({
            ...task,
            tags: task.tags.map((t) => t.tag),
        }));

        return NextResponse.json(transformedTasks);
    } catch (error) {
        console.error('Get tasks error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/tasks - Create task
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const validation = createTaskSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { title, description, status, priority, dueDate, tagIds } = validation.data;

        const task = await prisma.task.create({
            data: {
                title,
                description,
                status,
                priority,
                dueDate: dueDate ? new Date(dueDate) : null,
                userId: session.user.id,
                tags: tagIds.length > 0 ? {
                    create: tagIds.map((tagId) => ({ tagId })),
                } : undefined,
            },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        const transformedTask = {
            ...task,
            tags: task.tags.map((t) => t.tag),
        };

        return NextResponse.json(transformedTask, { status: 201 });
    } catch (error) {
        console.error('Create task error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
