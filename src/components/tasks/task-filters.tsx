'use client';

import { Search, X, SlidersHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { useState } from 'react';

interface Tag {
    id: string;
    name: string;
    color: string;
}

interface TaskFiltersProps {
    status: string;
    priority: string;
    tagId: string;
    search: string;
    sortBy: string;
    sortOrder: string;
    tags: Tag[];
    onFilterChange: (filters: {
        status?: string;
        priority?: string;
        tagId?: string;
        search?: string;
        sortBy?: string;
        sortOrder?: string;
    }) => void;
    onClearFilters: () => void;
}

export function TaskFilters({
    status,
    priority,
    tagId,
    search,
    sortBy,
    sortOrder,
    tags,
    onFilterChange,
    onClearFilters,
}: TaskFiltersProps) {
    const [showAdvanced, setShowAdvanced] = useState(false);
    const hasActiveFilters = status || priority || tagId || search;

    return (
        <div className="space-y-4">
            {/* Search and quick filters */}
            <div className="flex flex-col sm:flex-row gap-3">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search tasks..."
                        value={search}
                        onChange={(e) => onFilterChange({ search: e.target.value })}
                        className="pl-9"
                    />
                </div>

                <div className="flex gap-2">
                    <Select
                        value={status || 'all'}
                        onValueChange={(value) =>
                            onFilterChange({ status: value === 'all' ? '' : value })
                        }
                    >
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Status" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Status</SelectItem>
                            <SelectItem value="TODO">To Do</SelectItem>
                            <SelectItem value="DOING">In Progress</SelectItem>
                            <SelectItem value="DONE">Done</SelectItem>
                        </SelectContent>
                    </Select>

                    <Select
                        value={priority || 'all'}
                        onValueChange={(value) =>
                            onFilterChange({ priority: value === 'all' ? '' : value })
                        }
                    >
                        <SelectTrigger className="w-[130px]">
                            <SelectValue placeholder="Priority" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All Priority</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="MEDIUM">Medium</SelectItem>
                            <SelectItem value="LOW">Low</SelectItem>
                        </SelectContent>
                    </Select>

                    <Button
                        variant="outline"
                        size="icon"
                        onClick={() => setShowAdvanced(!showAdvanced)}
                        className={showAdvanced ? 'bg-accent' : ''}
                    >
                        <SlidersHorizontal className="h-4 w-4" />
                    </Button>
                </div>
            </div>

            {/* Advanced filters */}
            {showAdvanced && (
                <div className="flex flex-wrap gap-3 p-4 rounded-lg border bg-muted/50 animate-slide-up">
                    <div className="flex-1 min-w-[150px]">
                        <label className="text-xs text-muted-foreground mb-1 block">Tag</label>
                        <Select
                            value={tagId || 'all'}
                            onValueChange={(value) =>
                                onFilterChange({ tagId: value === 'all' ? '' : value })
                            }
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="All Tags" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Tags</SelectItem>
                                {tags.map((tag) => (
                                    <SelectItem key={tag.id} value={tag.id}>
                                        <span className="flex items-center gap-2">
                                            <span
                                                className="w-2 h-2 rounded-full"
                                                style={{ backgroundColor: tag.color }}
                                            />
                                            {tag.name}
                                        </span>
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex-1 min-w-[150px]">
                        <label className="text-xs text-muted-foreground mb-1 block">Sort By</label>
                        <Select
                            value={sortBy || 'createdAt'}
                            onValueChange={(value) => onFilterChange({ sortBy: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="createdAt">Created Date</SelectItem>
                                <SelectItem value="dueDate">Due Date</SelectItem>
                                <SelectItem value="priority">Priority</SelectItem>
                                <SelectItem value="title">Title</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>

                    <div className="flex-1 min-w-[150px]">
                        <label className="text-xs text-muted-foreground mb-1 block">Order</label>
                        <Select
                            value={sortOrder || 'desc'}
                            onValueChange={(value) => onFilterChange({ sortOrder: value })}
                        >
                            <SelectTrigger>
                                <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="desc">Newest First</SelectItem>
                                <SelectItem value="asc">Oldest First</SelectItem>
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            )}

            {/* Active filters badge */}
            {hasActiveFilters && (
                <div className="flex items-center gap-2">
                    <span className="text-sm text-muted-foreground">Active filters:</span>
                    <Button
                        variant="ghost"
                        size="sm"
                        onClick={onClearFilters}
                        className="h-7 text-xs"
                    >
                        <X className="h-3 w-3 mr-1" />
                        Clear all
                    </Button>
                </div>
            )}
        </div>
    );
}
