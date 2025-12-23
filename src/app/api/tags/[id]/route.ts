import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import prisma from '@/lib/prisma';
import { updateTagSchema } from '@/lib/validations/tag';

// DELETE /api/tags/[id] - Delete tag
export async function DELETE(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const existingTag = await prisma.tag.findFirst({
            where: {
                id: params.id,
                userId: session.user.id,
            },
        });

        if (!existingTag) {
            return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
        }

        await prisma.tag.delete({
            where: { id: params.id },
        });

        return NextResponse.json({ message: 'Tag deleted successfully' });
    } catch (error) {
        console.error('Delete tag error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}

// PUT /api/tags/[id] - Update tag
export async function PUT(
    request: Request,
    { params }: { params: { id: string } }
) {
    try {
        const session = await getServerSession(authOptions);
        if (!session?.user?.id) {
            return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
        }

        const existingTag = await prisma.tag.findFirst({
            where: {
                id: params.id,
                userId: session.user.id,
            },
        });

        if (!existingTag) {
            return NextResponse.json({ error: 'Tag not found' }, { status: 404 });
        }

        const body = await request.json();
        const validation = updateTagSchema.safeParse(body);

        if (!validation.success) {
            return NextResponse.json(
                { error: validation.error.errors[0].message },
                { status: 400 }
            );
        }

        const { name, color } = validation.data;

        // Check if new name conflicts
        if (name && name !== existingTag.name) {
            const conflictTag = await prisma.tag.findUnique({
                where: {
                    userId_name: {
                        userId: session.user.id,
                        name,
                    },
                },
            });

            if (conflictTag) {
                return NextResponse.json(
                    { error: 'Tag with this name already exists' },
                    { status: 400 }
                );
            }
        }

        const tag = await prisma.tag.update({
            where: { id: params.id },
            data: {
                ...(name && { name }),
                ...(color && { color }),
            },
        });

        return NextResponse.json(tag);
    } catch (error) {
        console.error('Update tag error:', error);
        return NextResponse.json(
            { error: 'Internal server error' },
            { status: 500 }
        );
    }
}
