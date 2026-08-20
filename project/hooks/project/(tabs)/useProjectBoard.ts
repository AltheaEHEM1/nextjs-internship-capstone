import {
	type DragEndEvent,
	type DragOverEvent,
	type DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback, useMemo } from "react";
import type { Task } from "@/components/board/TaskCard";
import { useProjectBoardStore } from "@/stores/project/(tabs)/ProjectBoardStore";
import { updateTaskAction } from "@/actions/task/Task";
import { useToast } from "@/hooks/toast/use-toast";

//Custom hook that encapsulates all Kanban board logic:
//drag-and-drop handling, task selection, and modal state.

export function useProjectBoard() {
	const { toast } = useToast();
	const kanbanColumns = useProjectBoardStore((state) => state.kanbanColumns);
	const setKanbanColumns = useProjectBoardStore(
		(state) => state.setKanbanColumns,
	);
	const tasks = useProjectBoardStore((state) => state.tasks);
	const setTasks = useProjectBoardStore((state) => state.setTasks);
	const activeColumn = useProjectBoardStore((state) => state.activeColumn);
	const setActiveColumn = useProjectBoardStore(
		(state) => state.setActiveColumn,
	);
	const activeTask = useProjectBoardStore((state) => state.activeTask);
	const setActiveTask = useProjectBoardStore((state) => state.setActiveTask);
	const isViewTaskOpen = useProjectBoardStore((state) => state.isViewTaskOpen);
	const setIsViewTaskOpen = useProjectBoardStore(
		(state) => state.setIsViewTaskOpen,
	);
	const selectedTask = useProjectBoardStore((state) => state.selectedTask);
	const setSelectedTask = useProjectBoardStore(
		(state) => state.setSelectedTask,
	);

	// Require a minimum drag distance to avoid accidental drags on click
	const pointerSensorOptions = useMemo(
		() => ({
			activationConstraint: { distance: 10 },
		}),
		[],
	);
	const sensors = useSensors(useSensor(PointerSensor, pointerSensorOptions));

	const onDragStart = useCallback(
		(event: DragStartEvent) => {
			const { active } = event;
			const data = active.data.current;

			if (data?.type === "Column") {
				setActiveColumn(active.id as string);
				return;
			}

			if (data?.type === "Task") {
				setActiveTask(data.task as Task);
			}
		},
		[setActiveColumn, setActiveTask],
	);

	const onDragOver = useCallback(
		(event: DragOverEvent) => {
			const { active, over } = event;
			if (!over) return;

			const activeId = active.id;
			const overId = over.id;
			if (activeId === overId) return;

			const activeData = active.data.current;
			const overData = over.data.current;

			const isActiveTask = activeData?.type === "Task";
			const isOverTask = overData?.type === "Task";
			const isOverColumn = overData?.type === "Column";

			if (!isActiveTask) return;

			// Dropping a task over another task
			if (isOverTask) {
				setTasks(
					tasks.map((t) => {
						if (t.id === activeId) {
							return {
								...t,
								status:
									(overData?.task as Task | undefined)?.status ?? t.status,
							};
						}
						return t;
					}),
				);
			}

			// Dropping a task over a column
			if (isOverColumn) {
				setTasks(
					tasks.map((t) => {
						if (t.id === activeId) {
							return { ...t, status: overId as string };
						}
						return t;
					}),
				);
			}
		},
		[tasks, setTasks],
	);

	const onDragEnd = useCallback(
		(event: DragEndEvent) => {
			setActiveColumn(null);
			setActiveTask(null);

			const { active, over } = event;
			if (!over) return;

			const activeId = active.id;
			const overId = over.id;
			if (activeId === overId) return;

			const activeData = active.data.current;
			const overData = over.data.current;

			// Reorder columns
			if (activeData?.type === "Column" && overData?.type === "Column") {
				const activeIndex = kanbanColumns.indexOf(activeId as string);
				const overIndex = kanbanColumns.indexOf(overId as string);
				if (activeIndex !== -1 && overIndex !== -1) {
					setKanbanColumns(arrayMove(kanbanColumns, activeIndex, overIndex));
				}
				return;
			}

			// Reorder tasks within the same column
			if (activeData?.type === "Task" && overData?.type === "Task") {
				const activeIndex = tasks.findIndex((t) => t.id === activeId);
				const overIndex = tasks.findIndex((t) => t.id === overId);
				if (activeIndex !== -1 && overIndex !== -1) {
					setTasks(arrayMove(tasks, activeIndex, overIndex));
				}
			}
		},
		[
			tasks,
			setTasks,
			kanbanColumns,
			setKanbanColumns,
			setActiveColumn,
			setActiveTask,
		],
	);

	const handleOpenTask = useCallback(
		(task: Task) => {
			setSelectedTask(task);
			setIsViewTaskOpen(true);
		},
		[setSelectedTask, setIsViewTaskOpen],
	);

	const handleUpdateTask = useCallback(
		async (updatedFields: Record<string, unknown>, projectId?: string) => {
			if (!selectedTask) return;

			// Optimistic UI update
			setTasks(
				tasks.map((t) =>
					t.id === selectedTask.id ? { ...t, ...updatedFields } : t,
				),
			);
			setSelectedTask({ ...selectedTask, ...updatedFields } as Task);

			// Server update
			if (projectId) {
				try {
					const res = await updateTaskAction(selectedTask.id, {
						...updatedFields,
						projectId,
					});
					if (res.success) {
						toast({
							title: "Saved",
							description: "Your changes have been saved.",
							variant: "success",
						});
					} else {
						toast({
							title: "Error",
							description: res.error || "Failed to save changes.",
							variant: "destructive",
						});
					}
				} catch (error) {
					console.error("Failed to update task", error);
				}
			}
		},
		[tasks, selectedTask, setTasks, setSelectedTask, toast],
	);

	const closeViewTask = useCallback(() => {
		setIsViewTaskOpen(false);
		setSelectedTask(null);
	}, [setIsViewTaskOpen, setSelectedTask]);

	return {
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
	};
}
