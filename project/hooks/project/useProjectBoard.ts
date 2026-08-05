import { useState } from "react";
import { PointerSensor, useSensor, useSensors } from "@dnd-kit/core";
import type { DragEndEvent, DragOverEvent, DragStartEvent } from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import type { Task } from "@/components/board/TaskCard";

export function useProjectBoard() {
	const [kanbanColumns, setKanbanColumns] = useState<string[]>(["To Do", "In Progress", "Done"]);
	const [isViewTaskOpen, setIsViewTaskOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);
	const [activeColumn, setActiveColumn] = useState<string | null>(null);
	const [activeTask, setActiveTask] = useState<Task | null>(null);
	const [tasks, setTasks] = useState<Task[]>([
		{
			id: "task-1",
			workType: "Feature",
			title: "Design System Update #1",
			description: "Refactor color tokens and component documentation for the layout migration.",
			status: "To Do",
			assignee: "U",
			priority: "medium",
			dueDate: "2026-06-15",
			label: "Frontend",
			startDate: "2026-06-01",
			reporter: "Admin",
		},
		{
			id: "task-2",
			workType: "Feature",
			title: "Design System Update #1",
			description: "Refactor color tokens and component documentation for the layout migration.",
			status: "To Do",
			assignee: "U",
			priority: "medium",
			dueDate: "2026-06-15",
			label: "Frontend",
			startDate: "2026-06-01",
			reporter: "Admin",
		},
		{
			id: "task-3",
			workType: "Feature",
			title: "Design System Update #1",
			description: "Refactor color tokens and component documentation for the layout migration.",
			status: "To Do",
			assignee: "U",
			priority: "medium",
			dueDate: "2026-06-15",
			label: "Frontend",
			startDate: "2026-06-01",
			reporter: "Admin",
		},
		{
			id: "task-4",
			workType: "Feature",
			title: "Design System Update #1",
			description: "Refactor color tokens and component documentation for the layout migration.",
			status: "To Do",
			assignee: "U",
			priority: "medium",
			dueDate: "2026-06-15",
			label: "Frontend",
			startDate: "2026-06-01",
			reporter: "Admin",
		},
	]);

	const sensors = useSensors(
		useSensor(PointerSensor, {
			activationConstraint: {
				distance: 5,
			},
		}),
	);

	const handleOpenTask = (task: Task) => {
		setSelectedTask(task);
		setIsViewTaskOpen(true);
	};

	const handleUpdateTask = (updatedFields: Record<string, any>) => {
		if (!selectedTask) return;
		setTasks((prev) => prev.map((t) => (t.id === selectedTask.id ? { ...t, ...updatedFields } : t)));
		setSelectedTask((prev) => (prev ? { ...prev, ...updatedFields } : null));
	};

	const onDragStart = (event: DragStartEvent) => {
		const { active } = event;
		const data = active.data.current;

		if (data?.type === "Column") {
			setActiveColumn(active.id as string);
			return;
		}

		if (data?.type === "Task") {
			setActiveTask(data.task);
		}
	};

	const onDragOver = (event: DragOverEvent) => {
		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;

		if (activeId === overId) return;

		const isActiveATask = active.data.current?.type === "Task";
		const isOverATask = over.data.current?.type === "Task";

		if (!isActiveATask) return;

		if (isActiveATask && isOverATask) {
			setTasks((tasks) => {
				const activeIndex = tasks.findIndex((t) => t.id === activeId);
				const overIndex = tasks.findIndex((t) => t.id === overId);

				if (tasks[activeIndex].status !== tasks[overIndex].status) {
					tasks[activeIndex].status = tasks[overIndex].status;
				}

				return arrayMove(tasks, activeIndex, overIndex);
			});
		}

		const isOverAColumn = kanbanColumns.includes(overId as string);
		if (isActiveATask && isOverAColumn) {
			setTasks((tasks) => {
				const activeIndex = tasks.findIndex((t) => t.id === activeId);
				tasks[activeIndex].status = overId as string;
				return arrayMove(tasks, activeIndex, activeIndex);
			});
		}
	};

	const onDragEnd = (event: DragEndEvent) => {
		setActiveColumn(null);
		setActiveTask(null);

		const { active, over } = event;
		if (!over) return;

		const activeId = active.id;
		const overId = over.id;

		if (activeId === overId) return;

		const isActiveAColumn = active.data.current?.type === "Column";
		if (isActiveAColumn) {
			setKanbanColumns((columns) => {
				const activeIndex = columns.indexOf(activeId as string);
				const overIndex = columns.indexOf(overId as string);
				return arrayMove(columns, activeIndex, overIndex);
			});
		}
	};

	const closeViewTask = () => setIsViewTaskOpen(false);

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
