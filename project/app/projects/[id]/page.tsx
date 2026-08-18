"use client";

import { DndContext, DragOverlay } from "@dnd-kit/core";
import {
	horizontalListSortingStrategy,
	SortableContext,
} from "@dnd-kit/sortable";
import { use, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getProjectDetailAction } from "@/actions/project/Project";
import { ColumnContainer } from "@/components/board/ColumnContainer";
import type { Task } from "@/components/board/TaskCard";
import { TaskCardDisplay } from "@/components/board/TaskCard";
import ViewTaskModal from "@/components/modals/task/view-task-modal/ViewTaskModal";
import { useProjectBoard } from "@/hooks/project/(tabs)/useProjectBoard";
import { useProjectBoardStore } from "@/stores/project/(tabs)/ProjectBoardStore";

export default function BoardPage({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const [isMounted, setIsMounted] = useState(false);
	const setKanbanColumns = useProjectBoardStore(
		(state) => state.setKanbanColumns,
	);
	const setTasks = useProjectBoardStore((state) => state.setTasks);

	useEffect(() => {
		setIsMounted(true);

		getProjectDetailAction(id).then((res) => {
			if (res.success && res.data?.statuses && res.data.statuses.length > 0) {
				setKanbanColumns(res.data.statuses.map((s) => s.name));
				const allTasks = res.data.statuses.flatMap((s) =>
					(s.tasks || []).map(
						(t) =>
							({
								id: t.id,
								title: t.title || "Untitled Task",
								description: t.description || "",
								status: s.name,
								priority: (t.priority === "urgent"
									? "high"
									: t.priority || "low") as "low" | "medium" | "high",
								assignee: t.assigneeId
									? t.assigneeId.substring(0, 2).toUpperCase()
									: "UN",
								dueDate: t.dueDate ? new Date(t.dueDate).toISOString() : "",
								workType: "Task",
								label: "",
								startDate: t.createdAt
									? new Date(t.createdAt).toISOString()
									: "",
								reporter: (t as any).reporter?.name || "System",
							}) as Task,
					),
				);

				// Overwrite dummy tasks with database tasks
				setTasks(allTasks);
			}
		});
	}, [id, setKanbanColumns, setTasks]);

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

	if (!isMounted) {
		return null;
	}

	return (
		<div className="flex gap-6 overflow-x-auto px-4 py-6">
			<DndContext
				sensors={sensors}
				onDragStart={onDragStart}
				onDragOver={onDragOver}
				onDragEnd={onDragEnd}
			>
				<div className="flex gap-6">
					<SortableContext
						items={kanbanColumns}
						strategy={horizontalListSortingStrategy}
					>
						{kanbanColumns.map((columnTitle: string) => (
							<ColumnContainer
								key={columnTitle}
								columnTitle={columnTitle}
								tasks={tasks.filter((t: Task) => t.status === columnTitle)}
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
								<TaskCardDisplay
									taskData={activeTask}
									onClick={() => {}}
									isOverlay
								/>
							)}
						</DragOverlay>,
						document.body,
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
