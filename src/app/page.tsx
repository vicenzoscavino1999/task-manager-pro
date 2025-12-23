'use client';

import { useEffect, useState, useCallback } from 'react';
import { Plus, ClipboardList } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { LoadingSpinner, EmptyState } from '@/components/ui/loading';
import { TaskCard } from '@/components/tasks/task-card';
import { TaskForm } from '@/components/tasks/task-form';
import { TaskFilters } from '@/components/tasks/task-filters';

interface Tag {
    id: string;
    name: string;
    color: string;
}

interface Task {
    id: string;
    title: string;
    description: string | null;
    status: 'TODO' | 'DOING' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate: string | null;
    tags: Tag[];
    createdAt: string;
}

interface Filters {
    status: string;
    priority: string;
    tagId: string;
    search: string;
    sortBy: string;
    sortOrder: string;
}

export default function TasksPage() {
    const [tasks, setTasks] = useState<Task[]>([]);
    const [tags, setTags] = useState<Tag[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [formOpen, setFormOpen] = useState(false);
    const [editingTask, setEditingTask] = useState<Task | null>(null);
    const [filters, setFilters] = useState<Filters>({
        status: '',
        priority: '',
        tagId: '',
        search: '',
        sortBy: 'createdAt',
        sortOrder: 'desc',
    });

    const fetchTasks = useCallback(async () => {
        try {
            const params = new URLSearchParams();
            if (filters.status) params.append('status', filters.status);
            if (filters.priority) params.append('priority', filters.priority);
            if (filters.tagId) params.append('tagId', filters.tagId);
            if (filters.search) params.append('search', filters.search);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);

            const res = await fetch(`/api/tasks?${params.toString()}`);
            if (!res.ok) throw new Error('Failed to fetch tasks');
            const data = await res.json();
            setTasks(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
        } finally {
            setLoading(false);
        }
    }, [filters]);

    const fetchTags = async () => {
        try {
            const res = await fetch('/api/tags');
            if (res.ok) {
                const data = await res.json();
                setTags(data);
            }
        } catch (err) {
            console.error('Failed to fetch tags:', err);
        }
    };

    useEffect(() => {
        fetchTasks();
        fetchTags();
    }, [fetchTasks]);

    const handleCreateTask = async (data: {
        title: string;
        description: string;
        status: 'TODO' | 'DOING' | 'DONE';
        priority: 'LOW' | 'MEDIUM' | 'HIGH';
        dueDate: string;
        tagIds: string[];
    }) => {
        const res = await fetch('/api/tasks', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Failed to create task');
        }

        await fetchTasks();
    };

    const handleUpdateTask = async (data: {
        title: string;
        description: string;
        status: 'TODO' | 'DOING' | 'DONE';
        priority: 'LOW' | 'MEDIUM' | 'HIGH';
        dueDate: string;
        tagIds: string[];
    }) => {
        if (!editingTask) return;

        const res = await fetch(`/api/tasks/${editingTask.id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
        });

        if (!res.ok) {
            const error = await res.json();
            throw new Error(error.error || 'Failed to update task');
        }

        await fetchTasks();
        setEditingTask(null);
    };

    const handleDeleteTask = async (id: string) => {
        const res = await fetch(`/api/tasks/${id}`, { method: 'DELETE' });
        if (!res.ok) {
            throw new Error('Failed to delete task');
        }
        await fetchTasks();
    };

    const handleStatusChange = async (id: string, status: 'TODO' | 'DOING' | 'DONE') => {
        const res = await fetch(`/api/tasks/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ status }),
        });

        if (res.ok) {
            setTasks((prev) =>
                prev.map((task) => (task.id === id ? { ...task, status } : task))
            );
        }
    };

    const handleFilterChange = (newFilters: Partial<Filters>) => {
        setFilters((prev) => ({ ...prev, ...newFilters }));
    };

    const handleClearFilters = () => {
        setFilters({
            status: '',
            priority: '',
            tagId: '',
            search: '',
            sortBy: 'createdAt',
            sortOrder: 'desc',
        });
    };

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
                </div>
            </div>
        );
    }

    return (
        <div className="container mx-auto max-w-5xl px-4 py-8">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <div>
                    <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-blue-400 bg-clip-text text-transparent">
                        My Tasks
                    </h1>
                    <p className="text-muted-foreground mt-1">
                        {tasks.length} tasks total
                    </p>
                </div>
                <Button onClick={() => setFormOpen(true)}>
                    <Plus className="h-4 w-4 mr-2" />
                    New Task
                </Button>
            </div>

            {/* Filters */}
            <div className="mb-6">
                <TaskFilters
                    {...filters}
                    tags={tags}
                    onFilterChange={handleFilterChange}
                    onClearFilters={handleClearFilters}
                />
            </div>

            {/* Task list */}
            {tasks.length === 0 ? (
                <EmptyState
                    icon={<ClipboardList className="h-12 w-12" />}
                    title="No tasks found"
                    description={
                        filters.search || filters.status || filters.priority || filters.tagId
                            ? 'Try adjusting your filters'
                            : 'Create your first task to get started'
                    }
                    action={
                        !filters.search && !filters.status && !filters.priority && !filters.tagId ? (
                            <Button onClick={() => setFormOpen(true)}>
                                <Plus className="h-4 w-4 mr-2" />
                                Create Task
                            </Button>
                        ) : undefined
                    }
                />
            ) : (
                <div className="space-y-3">
                    {tasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onEdit={(t) => {
                                setEditingTask(t);
                                setFormOpen(true);
                            }}
                            onDelete={handleDeleteTask}
                            onStatusChange={handleStatusChange}
                        />
                    ))}
                </div>
            )}

            {/* Task form modal */}
            <TaskForm
                open={formOpen}
                onClose={() => {
                    setFormOpen(false);
                    setEditingTask(null);
                }}
                onSubmit={editingTask ? handleUpdateTask : handleCreateTask}
                initialData={editingTask || undefined}
                tags={tags}
            />
        </div>
    );
}
