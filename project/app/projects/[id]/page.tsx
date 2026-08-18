"use client";

import { DndContext, type DragEndEvent, DragOverlay } from "@dnd-kit/core";
import {
	horizontalListSortingStrategy,
	SortableContext,
} from "@dnd-kit/sortable";
import { use, useCallback, useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { getProjectDetailAction } from "@/actions/project/Project";
import { reorderTasksAction } from "@/actions/task/Task";
import { ColumnContainer } from "@/components/board/ColumnContainer";
import type { Task } from "@/components/board/TaskCard";
import { TaskCardDisplay } from "@/components/board/TaskCard";
import ViewTaskModal from "@/components/modals/task/view-task-modal/ViewTaskModal";
import { useProjectBoard } from "@/hooks/project/(tabs)/useProjectBoard";
import { pusherClient } from "@/lib/pusher-client";
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

	const [statusesMap, setStatusesMap] = useState<Record<string, string>>({});

	const fetchProjectData = useCallback(() => {
		getProjectDetailAction(id).then((res) => {
			if (res.success && res.data?.statuses && res.data.statuses.length > 0) {
				setKanbanColumns(res.data.statuses.map((s) => s.name));
				const sMap: Record<string, string> = {};
				res.data.statuses.forEach((s) => {
					sMap[s.name] = s.id;
				});
				setStatusesMap(sMap);

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
								assignee: t.assigneeId || "",
								assigneeName: (t as any).assignee?.name || "UN",
								dueDate: t.dueDate ? new Date(t.dueDate).toISOString() : "",
								workType: "Task",
								label: "",
								startDate: t.createdAt
									? new Date(t.createdAt).toISOString()
									: "",
								reporter:
									(t as { reporter?: { name?: string } }).reporter?.name ||
									"System",
							}) as Task,
					),
				);

				setTasks(allTasks);
			}
		});
	}, [id, setKanbanColumns, setTasks]);

	useEffect(() => {
		setIsMounted(true);
		fetchProjectData();
	}, [fetchProjectData]);

	useEffect(() => {
		if (!id || !pusherClient) return;
		const channelName = `project-${id}`;
		const channel = pusherClient.subscribe(channelName);

		channel.bind("task-updated", () => {
			fetchProjectData();
		});

		return () => {
			pusherClient?.unsubscribe(channelName);
		};
	}, [id, fetchProjectData]);

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

	const handleDragEnd = (event: DragEndEvent) => {
		onDragEnd(event);

		// Allow Zustand state to update first
		setTimeout(() => {
			const updatedTasks = useProjectBoardStore.getState().tasks;
			const payload = updatedTasks
				.map((t, index) => ({
					id: t.id,
					statusId: statusesMap[t.status],
					position: index,
				}))
				.filter((t) => t.statusId);

			if (payload.length > 0) {
				reorderTasksAction(payload, id);
			}
		}, 0);
	};

	if (!isMounted) {
		return null;
	}

	return (
		<div className="flex gap-6 overflow-x-auto px-4 py-6">
			<DndContext
				sensors={sensors}
				onDragStart={onDragStart}
				onDragOver={onDragOver}
				onDragEnd={handleDragEnd}
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
					projectId={id}
				/>
			)}
		</div>
	);
}
