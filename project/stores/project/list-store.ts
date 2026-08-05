// List Zustand store
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import { Task } from '@/hooks/project/useTaskList';

export interface ListState {
  tasks: Task[];
  setTasks: (tasks: Task[]) => void;
}

export const useListStore = create<ListState>()(
  devtools((set) => ({
    tasks: [],
    setTasks: (tasks) => set({ tasks }),
  }))
);
