// Gantt Zustand store

import { type Task, ViewMode } from "gantt-task-react";
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { GanttViewModeOption } from "@/hooks/project/useGanttChart";

export interface GanttState {
	viewMode: ViewMode;
	setViewMode: (mode: ViewMode) => void;
	tasks: Task[];
	setTasks: (tasks: Task[]) => void;
	handleTaskChange: (task: Task) => void;
	handleTaskDelete: (task: Task) => void;
	handleProgressChange: (task: Task) => void;
}

export const useGanttStore = create<GanttState>()(
	devtools((set) => ({
		viewMode: ViewMode.Day,
		setViewMode: (mode) => set({ viewMode: mode }),
		tasks: [],
		setTasks: (tasks) => set({ tasks }),
		handleTaskChange: (task) =>
			set((state) => ({
				tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
			})),
		handleTaskDelete: (task) =>
			set((state) => ({ tasks: state.tasks.filter((t) => t.id !== task.id) })),
		handleProgressChange: (task) =>
			set((state) => ({
				tasks: state.tasks.map((t) => (t.id === task.id ? task : t)),
			})),
	})),
);
