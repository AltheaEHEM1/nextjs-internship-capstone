import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Task } from "@/components/board/TaskCard";

type ProjectBoardState = {
	kanbanColumns: string[];
	setKanbanColumns: (cols: string[]) => void;
	isViewTaskOpen: boolean;
	setIsViewTaskOpen: (open: boolean) => void;
	selectedTask: Task | null;
	setSelectedTask: (task: Task | null) => void;
	activeColumn: string | null;
	setActiveColumn: (col: string | null) => void;
	activeTask: Task | null;
	setActiveTask: (task: Task | null) => void;
	tasks: Task[];
	setTasks: (tasks: Task[]) => void;
};

export const useProjectBoardStore = create<ProjectBoardState>()(
	devtools((set) => ({
		kanbanColumns: [],
		setKanbanColumns: (cols) => set({ kanbanColumns: cols }),
		isViewTaskOpen: false,
		setIsViewTaskOpen: (open) => set({ isViewTaskOpen: open }),
		selectedTask: null,
		setSelectedTask: (task) => set({ selectedTask: task }),
		activeColumn: null,
		setActiveColumn: (col) => set({ activeColumn: col }),
		activeTask: null,
		setActiveTask: (task) => set({ activeTask: task }),
		tasks: [],
		setTasks: (tasks) => set({ tasks }),
	})),
);
