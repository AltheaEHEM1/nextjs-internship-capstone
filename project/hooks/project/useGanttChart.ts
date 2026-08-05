import { type Task, ViewMode } from "gantt-task-react";
import { useMemo, useState } from "react";

export type GanttViewModeOption = {
	mode: ViewMode;
	label: string;
};

export function useGanttChart() {
	const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);

	const [tasks, setTasks] = useState<Task[]>([
		{
			start: new Date(2026, 7, 1),
			end: new Date(2026, 7, 10),
			name: "Design System Refactor",
			id: "Task 1",
			type: "task",
			progress: 65,
			isDisabled: false,
			styles: { progressColor: "#0ea5e9", progressSelectedColor: "#0284c7" },
		},
		{
			start: new Date(2026, 7, 5),
			end: new Date(2026, 7, 18),
			name: "Role-Based Access Control (RBAC)",
			id: "Task 2",
			type: "task",
			progress: 30,
			dependencies: ["Task 1"],
			isDisabled: false,
			styles: { progressColor: "#22c55e", progressSelectedColor: "#16a34a" },
		},
		{
			start: new Date(2026, 7, 15),
			end: new Date(2026, 7, 25),
			name: "Docker Deployment Setup",
			id: "Task 3",
			type: "task",
			progress: 10,
			dependencies: ["Task 2"],
			isDisabled: false,
			styles: { progressColor: "#a855f7", progressSelectedColor: "#9333ea" },
		},
	]);

	const viewModeOptions = useMemo<GanttViewModeOption[]>(
		() => [
			{ mode: ViewMode.Day, label: "Day" },
			{ mode: ViewMode.Week, label: "Week" },
			{ mode: ViewMode.Month, label: "Month" },
		],
		[],
	);

	const columnWidth = useMemo(() => {
		if (viewMode === ViewMode.Month) return 150;
		if (viewMode === ViewMode.Week) return 250;
		return 65;
	}, [viewMode]);

	const handleTaskChange = (task: Task) => {
		setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
	};

	const handleTaskDelete = (task: Task) => {
		setTasks(tasks.filter((t) => t.id !== task.id));
	};

	const handleProgressChange = (task: Task) => {
		setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
	};

	return {
		viewMode,
		setViewMode,
		viewModeOptions,
		tasks,
		columnWidth,
		handleTaskChange,
		handleTaskDelete,
		handleProgressChange,
	};
}
