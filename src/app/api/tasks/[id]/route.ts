import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { updateTaskSchema } from '@/lib/validations/task';

// GET /api/tasks/[id] - Get single task
export async function GET(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const task = await prisma.task.findFirst({
            where: {
                id: params.id,
                userId: session.user.id,
            },
            include: {
                tags: {
                    include: {
                        tag: true,
                    },
                },
            },
        });

        if (!task) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        const transformedTask = {
            ...task,
            tags: task.tags.map((t) => t.tag),
        };

        return NextResponse.json(transformedTask);
    } catch (error) {
        console.error('Get task error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/tasks/[id] - Update task
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check task exists and belongs to user
        const existingTask = await prisma.task.findFirst({
            where: {
                id: params.id,
                userId: session.user.id,
            },
        });

        if (!existingTask) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        const body = await request.json();
        const validation = updateTaskSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { title, description, status, priority, dueDate, tagIds } = validation.data;

        // If tagIds provided, update tags
        if (tagIds !== undefined) {
            // Delete existing tags
            await prisma.taskTag.deleteMany({
                where: { taskId: params.id },
            });
        }

        const task = await prisma.task.update({
            where: { id: params.id },
            data: {
                ...(title !== undefined && { title }),
                ...(description !== undefined && { description }),
                ...(status !== undefined && { status }),
                ...(priority !== undefined && { priority }),
                ...(dueDate !== undefined && { dueDate: dueDate ? new Date(dueDate) : null }),
                ...(tagIds !== undefined && tagIds.length > 0 && {
                    tags: {
                        create: tagIds.map((tagId) => ({ tagId })),
                    },
                }),
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

        return NextResponse.json(transformedTask);
    } catch (error) {
        console.error('Update task error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// DELETE /api/tasks/[id] - Delete task
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        // Check task exists and belongs to user
        const existingTask = await prisma.task.findFirst({
            where: {
                id: params.id,
                userId: session.user.id,
            },
        });

        if (!existingTask) {
            return NextResponse.json({ error: 'Task not found' }, { status: 404 });
        }

        await prisma.task.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Task deleted successfully' });
    } catch (error) {
        console.error('Delete task error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
