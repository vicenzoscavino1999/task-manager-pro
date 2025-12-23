'use client';

import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';

interface Tag {
    id: string;
    name: string;
    color: string;
}

interface TaskFormData {
    title: string;
    description: string;
    status: 'TODO' | 'DOING' | 'DONE';
    priority: 'LOW' | 'MEDIUM' | 'HIGH';
    dueDate: string;
    tagIds: string[];
}

interface TaskFormProps {
    open: boolean;
    onClose: () => void;
    onSubmit: (data: TaskFormData) => Promise<void>;
    initialData?: {
        id?: string;
        title: string;
        description: string | null;
        status: 'TODO' | 'DOING' | 'DONE';
        priority: 'LOW' | 'MEDIUM' | 'HIGH';
        dueDate: string | null;
        tags: Tag[];
    };
    tags: Tag[];
}

export function TaskForm({ open, onClose, onSubmit, initialData, tags }: TaskFormProps) {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [error, setError] = useState('');
    const [formData, setFormData] = useState<TaskFormData>({
        title: '',
        description: '',
        status: 'TODO',
        priority: 'MEDIUM',
        dueDate: '',
        tagIds: [],
    });

    const isEditing = !!initialData?.id;

    useEffect(() => {
        if (initialData) {
            setFormData({
                title: initialData.title,
                description: initialData.description || '',
                status: initialData.status,
                priority: initialData.priority,
                dueDate: initialData.dueDate
                    ? new Date(initialData.dueDate).toISOString().split('T')[0]
                    : '',
                tagIds: initialData.tags.map((t) => t.id),
            });
        } else {
            setFormData({
                title: '',
                description: '',
                status: 'TODO',
                priority: 'MEDIUM',
                dueDate: '',
                tagIds: [],
            });
        }
        setError('');
    }, [initialData, open]);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        if (!formData.title.trim()) {
            setError('Title is required');
            return;
        }

        setIsSubmitting(true);
        try {
            await onSubmit({
                ...formData,
                dueDate: formData.dueDate
                    ? new Date(formData.dueDate).toISOString()
                    : '',
            });
            onClose();
        } catch (err) {
            setError(err instanceof Error ? err.message : 'Something went wrong');
        } finally {
            setIsSubmitting(false);
        }
    };

    const toggleTag = (tagId: string) => {
        setFormData((prev) => ({
            ...prev,
            tagIds: prev.tagIds.includes(tagId)
                ? prev.tagIds.filter((id) => id !== tagId)
                : [...prev.tagIds, tagId],
        }));
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[500px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</DialogTitle>
                </DialogHeader>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="rounded-md bg-destructive/15 p-3 text-sm text-destructive">
                            {error}
                        </div>
                    )}

                    <div className="space-y-2">
                        <Label htmlFor="title">Title *</Label>
                        <Input
                            id="title"
                            value={formData.title}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, title: e.target.value }))
                            }
                            placeholder="Enter task title"
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={formData.description}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, description: e.target.value }))
                            }
                            placeholder="Enter task description (optional)"
                            rows={3}
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                            <Label htmlFor="status">Status</Label>
                            <Select
                                value={formData.status}
                                onValueChange={(value: 'TODO' | 'DOING' | 'DONE') =>
                                    setFormData((prev) => ({ ...prev, status: value }))
                                }
                                disabled={isSubmitting}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="TODO">To Do</SelectItem>
                                    <SelectItem value="DOING">In Progress</SelectItem>
                                    <SelectItem value="DONE">Done</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="priority">Priority</Label>
                            <Select
                                value={formData.priority}
                                onValueChange={(value: 'LOW' | 'MEDIUM' | 'HIGH') =>
                                    setFormData((prev) => ({ ...prev, priority: value }))
                                }
                                disabled={isSubmitting}
                            >
                                <SelectTrigger>
                                    <SelectValue />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="LOW">Low</SelectItem>
                                    <SelectItem value="MEDIUM">Medium</SelectItem>
                                    <SelectItem value="HIGH">High</SelectItem>
                                </SelectContent>
                            </Select>
                        </div>
                    </div>

                    <div className="space-y-2">
                        <Label htmlFor="dueDate">Due Date</Label>
                        <Input
                            id="dueDate"
                            type="date"
                            value={formData.dueDate}
                            onChange={(e) =>
                                setFormData((prev) => ({ ...prev, dueDate: e.target.value }))
                            }
                            disabled={isSubmitting}
                        />
                    </div>

                    <div className="space-y-2">
                        <Label>Tags</Label>
                        <div className="flex flex-wrap gap-2">
                            {tags.map((tag) => (
                                <button
                                    key={tag.id}
                                    type="button"
                                    onClick={() => toggleTag(tag.id)}
                                    className={`rounded-full px-3 py-1 text-xs font-medium transition-all ${formData.tagIds.includes(tag.id)
                                            ? 'ring-2 ring-offset-2'
                                            : 'opacity-60 hover:opacity-100'
                                        }`}
                                    style={{
                                        backgroundColor: `${tag.color}30`,
                                        color: tag.color,
                                        borderColor: tag.color,
                                    }}
                                    disabled={isSubmitting}
                                >
                                    {tag.name}
                                </button>
                            ))}
                            {tags.length === 0 && (
                                <p className="text-sm text-muted-foreground">No tags available</p>
                            )}
                        </div>
                    </div>

                    <div className="flex justify-end gap-3 pt-4">
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={isSubmitting}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={isSubmitting}>
                            {isSubmitting
                                ? 'Saving...'
                                : isEditing
                                    ? 'Update Task'
                                    : 'Create Task'}
                        </Button>
                    </div>
                </form>
            </DialogContent>
        </Dialog>
    );
}
