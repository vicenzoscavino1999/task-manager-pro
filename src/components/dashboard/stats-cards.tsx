'use client';

import {
    CheckCircle2,
    Clock,
    AlertTriangle,
    TrendingUp,
    ListTodo,
    Timer,
    CalendarClock,
    Target,
} from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { cn } from '@/lib/utils';

interface StatsData {
    total: number;
    byStatus: {
        todo: number;
        doing: number;
        done: number;
    };
    overdue: number;
    upcoming: number;
    highPriority: number;
    completionRate: number;
}

interface StatsCardsProps {
    stats: StatsData;
}

export function StatsCards({ stats }: StatsCardsProps) {
    const cards = [
        {
            title: 'Total Tasks',
            value: stats.total,
            icon: ListTodo,
            color: 'text-blue-500',
            bgColor: 'bg-blue-500/10',
        },
        {
            title: 'To Do',
            value: stats.byStatus.todo,
            icon: Clock,
            color: 'text-slate-500',
            bgColor: 'bg-slate-500/10',
        },
        {
            title: 'In Progress',
            value: stats.byStatus.doing,
            icon: Timer,
            color: 'text-yellow-500',
            bgColor: 'bg-yellow-500/10',
        },
        {
            title: 'Completed',
            value: stats.byStatus.done,
            icon: CheckCircle2,
            color: 'text-green-500',
            bgColor: 'bg-green-500/10',
        },
        {
            title: 'Overdue',
            value: stats.overdue,
            icon: AlertTriangle,
            color: 'text-red-500',
            bgColor: 'bg-red-500/10',
            highlight: stats.overdue > 0,
        },
        {
            title: 'Due Soon (7 days)',
            value: stats.upcoming,
            icon: CalendarClock,
            color: 'text-orange-500',
            bgColor: 'bg-orange-500/10',
        },
        {
            title: 'High Priority',
            value: stats.highPriority,
            icon: Target,
            color: 'text-purple-500',
            bgColor: 'bg-purple-500/10',
        },
        {
            title: 'Completion Rate',
            value: `${stats.completionRate}%`,
            icon: TrendingUp,
            color: 'text-emerald-500',
            bgColor: 'bg-emerald-500/10',
        },
    ];

    return (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            {cards.map((card) => (
                <Card
                    key={card.title}
                    className={cn(
                        'transition-all hover:shadow-md',
                        card.highlight && 'border-red-300 bg-red-50/50 dark:bg-red-950/20'
                    )}
                >
                    <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground">
                            {card.title}
                        </CardTitle>
                        <div className={cn('p-2 rounded-lg', card.bgColor)}>
                            <card.icon className={cn('h-4 w-4', card.color)} />
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className={cn('text-2xl font-bold', card.color)}>
                            {card.value}
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );
}
