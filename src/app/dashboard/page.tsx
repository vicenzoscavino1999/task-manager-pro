'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { ArrowRight, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner } from '@/components/ui/loading';
import { StatsCards } from '@/components/dashboard/stats-cards';

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

export default function DashboardPage() {
    const [stats, setStats] = useState<StatsData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    const fetchStats = async () => {
        try {
            setLoading(true);
            const res = await fetch('/api/tasks/stats');
            if (!res.ok) throw new Error('Failed to fetch stats');
            const data = await res.json();
            setStats(data);
            setError('');
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch stats');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStats();
    }, []);

    if (loading) {
        return (
            <div className="flex items-center justify-center min-h-[60vh]">
                <LoadingSpinner size="lg" />
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto max-w-5xl px-4 py-8">
                <div className="rounded-lg border border-destructive bg-destructive/10 p-4 text-destructive">
                    {error}
                    <Button
                        variant="outline"
                        size="sm"
                        className="ml-4"
                        onClick={fetchStats}
                    >
                        Retry
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-8">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                        Dashboard
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        Overview of your task progress
                    </p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" size="sm" onClick={fetchStats}>
                        <RefreshCw className="h-4 w-4 mr-2" />
                        Refresh
                    </Button>
                    <Button asChild>
                        <Link href="/">
                            View Tasks
                            <ArrowRight className="h-4 w-4 ml-2" />
                        </Link>
                    </Button>
                </div>
            </div>

            {/* Stats */}
            {stats && <StatsCards stats={stats} />}

            {/* Progress visualization */}
            {stats && stats.total > 0 && (
                <div className="mt-8">
                    <h2 className="text-lg font-semibold mb-4">Task Progress</h2>
                    <div className="rounded-lg border bg-card p-6">
                        <div className="space-y-4">
                            {/* Progress bar */}
                            <div>
                                <div className="flex justify-between text-sm mb-2">
                                    <span className="text-muted-foreground">Overall Progress</span>
                                    <span className="font-medium">{stats.completionRate}%</span>
                                </div>
                                <div className="h-4 bg-muted rounded-full overflow-hidden">
                                    <div className="h-full flex">
                                        <div
                                            className="bg-green-500 transition-all duration-500"
                                            style={{
                                                width: `${(stats.byStatus.done / stats.total) * 100}%`,
                                            }}
                                        />
                                        <div
                                            className="bg-blue-500 transition-all duration-500"
                                            style={{
                                                width: `${(stats.byStatus.doing / stats.total) * 100}%`,
                                            }}
                                        />
                                        <div
                                            className="bg-slate-300 dark:bg-slate-600 transition-all duration-500"
                                            style={{
                                                width: `${(stats.byStatus.todo / stats.total) * 100}%`,
                                            }}
                                        />
                                    </div>
                                </div>
                                <div className="flex justify-between mt-2 text-xs text-muted-foreground">
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-green-500" />
                                        Done ({stats.byStatus.done})
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-blue-500" />
                                        In Progress ({stats.byStatus.doing})
                                    </span>
                                    <span className="flex items-center gap-1">
                                        <span className="w-2 h-2 rounded-full bg-slate-300 dark:bg-slate-600" />
                                        To Do ({stats.byStatus.todo})
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Quick tips */}
            <div className="mt-8">
                <h2 className="text-lg font-semibold mb-4">Quick Tips</h2>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div className="rounded-lg border bg-card p-4">
                        <h3 className="font-medium mb-1">📌 Stay Organized</h3>
                        <p className="text-sm text-muted-foreground">
                            Use tags to categorize your tasks and find them easily later.
                        </p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <h3 className="font-medium mb-1">⏰ Set Due Dates</h3>
                        <p className="text-sm text-muted-foreground">
                            Tasks with due dates help you prioritize and stay on track.
                        </p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <h3 className="font-medium mb-1">🎯 Prioritize Wisely</h3>
                        <p className="text-sm text-muted-foreground">
                            Mark important tasks as high priority to focus on what matters.
                        </p>
                    </div>
                    <div className="rounded-lg border bg-card p-4">
                        <h3 className="font-medium mb-1">✅ Track Progress</h3>
                        <p className="text-sm text-muted-foreground">
                            Click the status icon on tasks to quickly update their progress.
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
