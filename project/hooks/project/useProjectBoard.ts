import {
	type DragEndEvent,
	type DragOverEvent,
	type DragStartEvent,
	PointerSensor,
	useSensor,
	useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import { useCallback } from "react";
import type { Task } from "@/components/board/TaskCard";
import { useProjectBoardStore } from "@/stores/project/project-board-store";

/**
 * Custom hook that encapsulates all Kanban board logic:
 * drag-and-drop handling, task selection, and modal state.
 */
export function useProjectBoard() {
	const {
		kanbanColumns,
		tasks,
		setTasks,
		activeColumn,
		setActiveColumn,
		activeTask,
		setActiveTask,
		isViewTaskOpen,
		setIsViewTaskOpen,
		selectedTask,
		setSelectedTask,
	} = useProjectBoardStore();

	// Require a minimum drag distance to avoid accidental drags on click
	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: { distance: 10 },
		}),
	);

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
							return { ...t, status: (overData?.task as Task).status };
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

			// Reorder tasks within the same column
			if (activeData?.type === "Task" && overData?.type === "Task") {
				const activeIndex = tasks.findIndex((t) => t.id === activeId);
				const overIndex = tasks.findIndex((t) => t.id === overId);
				if (activeIndex !== -1 && overIndex !== -1) {
					setTasks(arrayMove(tasks, activeIndex, overIndex));
				}
			}
		},
		[tasks, setTasks, setActiveColumn, setActiveTask],
	);

	const handleOpenTask = useCallback(
		(task: Task) => {
			setSelectedTask(task);
			setIsViewTaskOpen(true);
		},
		[setSelectedTask, setIsViewTaskOpen],
	);

	const handleUpdateTask = useCallback(
		(updatedFields: Record<string, any>) => {
			if (!selectedTask) return;
			setTasks(
				tasks.map((t) =>
					t.id === selectedTask.id ? { ...t, ...updatedFields } : t,
				),
			);
			setSelectedTask({ ...selectedTask, ...updatedFields } as Task);
		},
		[tasks, selectedTask, setTasks, setSelectedTask],
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
