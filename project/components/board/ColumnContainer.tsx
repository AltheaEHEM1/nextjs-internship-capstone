"use client";

import { MoreHorizontal } from "lucide-react";
import { useSortable, SortableContext, verticalListSortingStrategy } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { TaskCard, Task } from "./TaskCard";

interface ColumnContainerProps {
    columnTitle: string;
    tasks: Task[];
    onOpenTask: (task: Task) => void;
}

export function ColumnContainer({ columnTitle, tasks, onOpenTask }: ColumnContainerProps) {
    const { setNodeRef, attributes, listeners, transform, transition, isDragging } = useSortable({
        id: columnTitle,
        data: {
            type: "Column",
            columnTitle,
        },
    });

    const style = {
        transform: CSS.Transform.toString(transform),
        transition,
    };

    if (isDragging) {
        return (
            <div
                ref={setNodeRef}
                style={style}
                className="h-[500px] w-72 rounded-xl border-2 border-dashed border-blue_munsell-400 bg-platinum-100 opacity-40 sm:w-80 dark:border-payne's_gray-600 dark:bg-outer_space-500"
            />
        );
    }

    const taskIds = tasks.map((t) => t.id);

    return (
        <div
            ref={setNodeRef}
            style={style}
            className="flex max-h-[calc(100vh-100px)] w-72 flex-shrink-0 flex-col rounded-xl border border-french_gray-200 bg-platinum-100 sm:w-80 dark:border-payne's_gray-600 dark:bg-outer_space-500"
        >
            {/* Column Header (Drag Handle for Columns) */}
            <div
                {...attributes}
                {...listeners}
                className="flex cursor-grab active:cursor-grabbing items-center justify-between border-b border-french_gray-200 p-4 dark:border-payne's_gray-600"
            >
                <h3 className="flex items-center font-semibold text-outer_space-700 dark:text-platinum-200">
                    {columnTitle}
                    <span className="ml-2 rounded-full bg-french_gray-200 px-2.5 py-0.5 text-xs text-outer_space-600 dark:bg-payne's_gray-500 dark:text-platinum-300">
                        {tasks.length}
                    </span>
                </h3>
                <button
                    type="button"
                    className="rounded-lg p-1 text-outer_space-400 hover:bg-french_gray-200 dark:text-platinum-400 dark:hover:bg-payne's_gray-400"
                >
                    <MoreHorizontal size={16} />
                </button>
            </div>

            {/* Task Cards Container */}
            <div className="min-h-[350px] flex-1 space-y-3 overflow-y-auto p-4">
                <SortableContext items={taskIds} strategy={verticalListSortingStrategy}>
                    {tasks.map((taskData) => (
                        <TaskCard key={taskData.id} taskData={taskData} onClick={() => onOpenTask(taskData)} />
                    ))}
                </SortableContext>

                {/* Add Task Button */}
                <button
                    type="button"
                    className="w-full rounded-lg border-2 border-dashed border-french_gray-300 py-2.5 text-sm font-medium text-outer_space-500 transition-colors hover:border-blue_munsell-500 hover:bg-blue_munsell-50/50 hover:text-blue_munsell-600 dark:border-payne's_gray-500 dark:text-platinum-400 dark:hover:bg-blue_munsell-950/20 dark:hover:text-blue_munsell-400"
                >
                    + Add task
                </button>
            </div>
        </div>
    );
}