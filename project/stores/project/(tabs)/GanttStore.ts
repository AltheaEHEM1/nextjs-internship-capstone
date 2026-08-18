import { type Task, ViewMode } from "gantt-task-react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface GanttState {
	viewMode: ViewMode;
	tasks: Task[];
	setViewMode: (mode: ViewMode) => void;
	setTasks: (tasks: Task[]) => void;
	handleTaskChange: (task: Task) => void;
	handleTaskDelete: (task: Task) => void;
	handleProgressChange: (task: Task) => void;
}

const INITIAL_TASKS: Task[] = [
	{
		start: new Date(2026, 7, 1),
		end: new Date(2026, 7, 15),
		name: "Project Planning",
		id: "task-1",
		type: "task",
		progress: 100,
		isDisabled: false,
		styles: { progressColor: "#0ea5e9", progressSelectedColor: "#0284c7" },
	},
	{
		start: new Date(2026, 7, 10),
		end: new Date(2026, 7, 25),
		name: "UI/UX Design & Wireframing",
		id: "task-2",
		type: "task",
		progress: 60,
		dependencies: ["task-1"],
		isDisabled: false,
		styles: { progressColor: "#0ea5e9", progressSelectedColor: "#0284c7" },
	},
	{
		start: new Date(2026, 7, 20),
		end: new Date(2026, 8, 10),
		name: "Frontend & Backend Development",
		id: "task-3",
		type: "task",
		progress: 25,
		dependencies: ["task-2"],
		isDisabled: false,
		styles: { progressColor: "#0ea5e9", progressSelectedColor: "#0284c7" },
	},
];

export const useGanttStore = create<GanttState>()(
	devtools((set) => ({
		viewMode: ViewMode.Day,
		tasks: INITIAL_TASKS,
		setViewMode: (mode) => set({ viewMode: mode }),
		setTasks: (tasks) => set({ tasks }),
		handleTaskChange: (task) =>
			set((state) => ({
				tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
			})),
		handleTaskDelete: (task) =>
			set((state) => ({
				tasks: state.tasks.filter((t) => t.id !== task.id),
			})),
		handleProgressChange: (task) =>
			set((state) => ({
				tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
			})),
	})),
);
