'use client';

import { useState } from 'react';
import { format } from 'date-fns';
import {
    Calendar,
    Clock,
    Flag,
    MoreVertical,
    Edit2,
    Trash2,
    CheckCircle2,
    Circle,
    Timer,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { isOverdue, getRelativeDate } from '@/lib/utils';

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

interface TaskCardProps {
    task: Task;
    onEdit: (task: Task) => void;
    onDelete: (id: string) => void;
    onStatusChange: (id: string, status: 'TODO' | 'DOING' | 'DONE') => void;
}

const priorityConfig = {
    LOW: { label: 'Low', color: 'bg-slate-500', icon: Flag },
    MEDIUM: { label: 'Medium', color: 'bg-yellow-500', icon: Flag },
    HIGH: { label: 'High', color: 'bg-red-500', icon: Flag },
};

const statusConfig = {
    TODO: { label: 'To Do', color: 'bg-slate-500', icon: Circle },
    DOING: { label: 'In Progress', color: 'bg-blue-500', icon: Timer },
    DONE: { label: 'Done', color: 'bg-green-500', icon: CheckCircle2 },
};

export function TaskCard({ task, onEdit, onDelete, onStatusChange }: TaskCardProps) {
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [showMenu, setShowMenu] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const priority = priorityConfig[task.priority];
    const status = statusConfig[task.status];
    const StatusIcon = status.icon;
    const taskOverdue = task.status !== 'DONE' && isOverdue(task.dueDate);

    const handleDelete = async () => {
        setIsDeleting(true);
        await onDelete(task.id);
        setShowDeleteDialog(false);
        setIsDeleting(false);
    };

    const cycleStatus = () => {
        const statusOrder: ('TODO' | 'DOING' | 'DONE')[] = ['TODO', 'DOING', 'DONE'];
        const currentIndex = statusOrder.indexOf(task.status);
        const nextStatus = statusOrder[(currentIndex + 1) % 3];
        onStatusChange(task.id, nextStatus);
    };

    return (
        <>
            <div
                className={cn(
                    'group relative rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md',
                    task.status === 'DONE' && 'opacity-75',
                    taskOverdue && 'border-red-300 bg-red-50/50 dark:bg-red-950/20'
                )}
            >
                {/* Priority indicator */}
                <div
                    className={cn(
                        'absolute left-0 top-0 h-full w-1 rounded-l-lg',
                        priority.color
                    )}
                />

                <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                        {/* Title and Status */}
                        <div className="flex items-center gap-2">
                            <button
                                onClick={cycleStatus}
                                className="flex-shrink-0 text-muted-foreground hover:text-foreground transition-colors"
                                title={`Click to change status (${status.label})`}
                            >
                                <StatusIcon
                                    className={cn(
                                        'h-5 w-5',
                                        task.status === 'DONE' && 'text-green-500',
                                        task.status === 'DOING' && 'text-blue-500'
                                    )}
                                />
                            </button>
                            <h3
                                className={cn(
                                    'font-medium truncate',
                                    task.status === 'DONE' && 'line-through text-muted-foreground'
                                )}
                            >
                                {task.title}
                            </h3>
                        </div>

                        {/* Description */}
                        {task.description && (
                            <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                                {task.description}
                            </p>
                        )}

                        {/* Tags */}
                        {task.tags.length > 0 && (
                            <div className="mt-2 flex flex-wrap gap-1">
                                {task.tags.map((tag) => (
                                    <span
                                        key={tag.id}
                                        className="inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium"
                                        style={{
                                            backgroundColor: `${tag.color}20`,
                                            color: tag.color,
                                        }}
                                    >
                                        {tag.name}
                                    </span>
                                ))}
                            </div>
                        )}

                        {/* Meta info */}
                        <div className="mt-3 flex flex-wrap items-center gap-3 text-xs text-muted-foreground">
                            <Badge
                                variant={task.priority === 'HIGH' ? 'destructive' : 'secondary'}
                                className="text-xs"
                            >
                                {priority.label}
                            </Badge>

                            {task.dueDate && (
                                <span
                                    className={cn(
                                        'flex items-center gap-1',
                                        taskOverdue && 'text-red-500 font-medium'
                                    )}
                                >
                                    <Calendar className="h-3 w-3" />
                                    {getRelativeDate(task.dueDate)}
                                </span>
                            )}

                            <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {format(new Date(task.createdAt), 'MMM d')}
                            </span>
                        </div>
                    </div>

                    {/* Actions menu */}
                    <div className="relative">
                        <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 opacity-0 group-hover:opacity-100 transition-opacity"
                            onClick={() => setShowMenu(!showMenu)}
                        >
                            <MoreVertical className="h-4 w-4" />
                        </Button>

                        {showMenu && (
                            <>
                                <div
                                    className="fixed inset-0 z-10"
                                    onClick={() => setShowMenu(false)}
                                />
                                <div className="absolute right-0 top-8 z-20 w-36 rounded-md border bg-popover p-1 shadow-lg animate-fade-in">
                                    <button
                                        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm hover:bg-accent"
                                        onClick={() => {
                                            setShowMenu(false);
                                            onEdit(task);
                                        }}
                                    >
                                        <Edit2 className="h-4 w-4" />
                                        Edit
                                    </button>
                                    <button
                                        className="flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm text-destructive hover:bg-accent"
                                        onClick={() => {
                                            setShowMenu(false);
                                            setShowDeleteDialog(true);
                                        }}
                                    >
                                        <Trash2 className="h-4 w-4" />
                                        Delete
                                    </button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </div>

            {/* Delete confirmation dialog */}
            <Dialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Task</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;{task.title}&quot;? This action
                            cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button
                            variant="outline"
                            onClick={() => setShowDeleteDialog(false)}
                            disabled={isDeleting}
                        >
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting...' : 'Delete'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </>
    );
}
