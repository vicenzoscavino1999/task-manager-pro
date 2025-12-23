import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { createTagSchema } from '@/lib/validations/tag';

// GET /api/tags - List user's tags
export async function GET() {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const tags = await prisma.tag.findMany({
            where: { userId: session.user.id },
            orderBy: { name: 'asc' },
            include: {
                _count: {
                    select: { tasks: true },
                },
            },
        });

        const transformedTags = tags.map((tag) => ({
            id: tag.id,
            name: tag.name,
            color: tag.color,
            taskCount: tag._count.tasks,
        }));

        return NextResponse.json(transformedTags);
    } catch (error) {
        console.error('Get tags error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// POST /api/tags - Create new tag
export async function POST(request: Request) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const body = await request.json();
        const validation = createTagSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { name, color } = validation.data;

        // Check if tag with same name exists
        const existingTag = await prisma.tag.findUnique({
            where: {
                userId_name: {
                    userId: session.user.id,
                    name,
                },
            },
        });

        if (existingTag) {
            return NextResponse.json(
                { error: 'Tag with this name already exists' },
                { status: 400 }
            );
        }

        const tag = await prisma.tag.create({
            data: {
                name,
                color,
                userId: session.user.id,
            },
        });

        return NextResponse.json(tag, { status: 201 });
    } catch (error) {
        console.error('Create tag error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
