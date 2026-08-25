import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Task } from "@/hooks/project/(tabs)/useList";

export interface ListState {
	tasks: Task[];
	setTasks: (tasks: Task[]) => void;
}

export const useListStore = create<ListState>()(
	devtools((set) => ({
		tasks: [],
		setTasks: (tasks) => set({ tasks }),
	})),
);
