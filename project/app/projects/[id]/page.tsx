"use client";

import { createPortal } from "react-dom";
import { DndContext, DragOverlay } from "@dnd-kit/core";
import { SortableContext, horizontalListSortingStrategy } from "@dnd-kit/sortable";
import ViewTaskModal from "@/components/modals/task/view-task-modal/ViewTaskModal";
import { ColumnContainer } from "@/components/board/ColumnContainer";
import { TaskCard } from "@/components/board/TaskCard";
import { useProjectBoard } from "@/hooks/project/useProjectBoard";

export default function BoardPage() {
    const {
        kanbanColumns,
        tasks,
        sensors,
        activeColumn,
        activeTask,
        isViewTaskOpen,
        selectedTask,
        handleOpenTask,
        handleUpdateTask,
        onDragStart,
        onDragOver,
        onDragEnd,
        closeViewTask,
    } = useProjectBoard();

    return (
        <div className="flex gap-6 overflow-x-auto px-4 py-6">
            <DndContext
                sensors={sensors}
                onDragStart={onDragStart}
                onDragOver={onDragOver}
                onDragEnd={onDragEnd}
            >
                <div className="flex gap-6">
                    <SortableContext items={kanbanColumns} strategy={horizontalListSortingStrategy}>
                        {kanbanColumns.map((columnTitle) => (
                            <ColumnContainer
                                key={columnTitle}
                                columnTitle={columnTitle}
                                tasks={tasks.filter((t) => t.status === columnTitle)}
                                onOpenTask={handleOpenTask}
                            />
                        ))}
                    </SortableContext>
                </div>

                {typeof window !== "undefined" &&
                    createPortal(
                        <DragOverlay>
                            {activeColumn && (
                                <div className="h-[400px] w-72 rounded-xl border border-french_gray-200 bg-platinum-100 p-4 opacity-80 shadow-lg sm:w-80 dark:border-payne's_gray-600 dark:bg-outer_space-500">
                                    <h3 className="font-semibold">{activeColumn}</h3>
                                </div>
                            )}
                            {activeTask && (
                                <TaskCard taskData={activeTask} onClick={() => {}} isOverlay />
                            )}
                        </DragOverlay>,
                        document.body
                    )}
            </DndContext>

            {selectedTask && (
                <ViewTaskModal
                    opened={isViewTaskOpen}
                    onClose={closeViewTask}
                    taskData={selectedTask}
                    onUpdateTask={handleUpdateTask}
                />
            )}
        </div>
    );
}