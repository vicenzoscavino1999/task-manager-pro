import { PrismaClient, Status, Priority } from '@prisma/client';
import * as bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

async function main() {
    console.log('🌱 Starting seed...');

    // Clean up existing data
    await prisma.taskTag.deleteMany();
    await prisma.task.deleteMany();
    await prisma.tag.deleteMany();
    await prisma.user.deleteMany();

    // Create demo user
    const hashedPassword = await bcrypt.hash('demo1234', 12);
    const demoUser = await prisma.user.create({
        data: {
            email: 'demo@example.com',
            name: 'Demo User',
            hashedPassword,
        },
    });
    console.log('✅ Created demo user: demo@example.com / demo1234');

    // Create tags
    const tags = await Promise.all([
        prisma.tag.create({
            data: { name: 'Work', color: '#ef4444', userId: demoUser.id },
        }),
        prisma.tag.create({
            data: { name: 'Personal', color: '#3b82f6', userId: demoUser.id },
        }),
        prisma.tag.create({
            data: { name: 'Urgent', color: '#f97316', userId: demoUser.id },
        }),
        prisma.tag.create({
            data: { name: 'Learning', color: '#8b5cf6', userId: demoUser.id },
        }),
        prisma.tag.create({
            data: { name: 'Health', color: '#22c55e', userId: demoUser.id },
        }),
    ]);
    console.log('✅ Created 5 tags');

    // Helper to get random date
    const randomDate = (daysFromNow: number) => {
        const date = new Date();
        date.setDate(date.getDate() + daysFromNow);
        return date;
    };

    // Create demo tasks
    const tasksData = [
        {
            title: 'Complete project documentation',
            description: 'Write comprehensive README and API documentation for the Task Manager Pro project.',
            status: Status.DOING,
            priority: Priority.HIGH,
            dueDate: randomDate(2),
            tagIds: [tags[0].id, tags[2].id],
        },
        {
            title: 'Review pull requests',
            description: 'Review and approve pending pull requests from the team.',
            status: Status.TODO,
            priority: Priority.MEDIUM,
            dueDate: randomDate(1),
            tagIds: [tags[0].id],
        },
        {
            title: 'Set up CI/CD pipeline',
            description: 'Configure GitHub Actions for automated testing and deployment.',
            status: Status.DONE,
            priority: Priority.HIGH,
            dueDate: randomDate(-1),
            tagIds: [tags[0].id, tags[3].id],
        },
        {
            title: 'Learn TypeScript generics',
            description: 'Deep dive into TypeScript generics and advanced type patterns.',
            status: Status.TODO,
            priority: Priority.LOW,
            dueDate: randomDate(14),
            tagIds: [tags[3].id, tags[1].id],
        },
        {
            title: 'Morning exercise routine',
            description: '30 minutes of cardio and stretching.',
            status: Status.DOING,
            priority: Priority.MEDIUM,
            dueDate: null,
            tagIds: [tags[4].id, tags[1].id],
        },
        {
            title: 'Prepare for client meeting',
            description: 'Create presentation slides and gather project metrics.',
            status: Status.TODO,
            priority: Priority.HIGH,
            dueDate: randomDate(3),
            tagIds: [tags[0].id, tags[2].id],
        },
        {
            title: 'Update dependencies',
            description: 'Review and update project dependencies to latest stable versions.',
            status: Status.TODO,
            priority: Priority.LOW,
            dueDate: randomDate(7),
            tagIds: [tags[0].id],
        },
        {
            title: 'Write unit tests',
            description: 'Add tests for authentication and task CRUD operations.',
            status: Status.TODO,
            priority: Priority.MEDIUM,
            dueDate: randomDate(5),
            tagIds: [tags[0].id, tags[3].id],
        },
        {
            title: 'Schedule dentist appointment',
            description: 'Annual dental checkup.',
            status: Status.DONE,
            priority: Priority.LOW,
            dueDate: randomDate(-5),
            tagIds: [tags[4].id, tags[1].id],
        },
        {
            title: 'Database optimization',
            description: 'Analyze slow queries and add necessary indexes.',
            status: Status.TODO,
            priority: Priority.MEDIUM,
            dueDate: randomDate(-2),
            tagIds: [tags[0].id],
        },
    ];

    for (const taskData of tasksData) {
        const { tagIds, ...data } = taskData;
        await prisma.task.create({
            data: {
                ...data,
                userId: demoUser.id,
                tags: {
                    create: tagIds.map((tagId) => ({ tagId })),
                },
            },
        });
    }
    console.log('✅ Created 10 demo tasks');

    console.log('🌱 Seed completed successfully!');
}

main()
    .catch((e) => {
        console.error('❌ Seed failed:', e);
        process.exit(1);
    })
    .finally(async () => {
        await prisma.$disconnect();
    });
