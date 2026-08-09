import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { Task } from "@/hooks/project/(tabs)/useList";

export interface ListState {
    tasks: Task[];
    setTasks: (tasks: Task[]) => void;
}

const INITIAL_TASKS: Task[] = [
    {
        id: "TASK-001",
        title: "Design system tokens",
        status: "Done",
        priority: "High",
        assignee: "Alice",
        dueDate: "Aug 5",
        estimate: "3h",
    },
    {
        id: "TASK-002",
        title: "Build kanban board",
        status: "In Progress",
        priority: "Critical",
        assignee: "Bob",
        dueDate: "Aug 10",
        estimate: "8h",
    },
    {
        id: "TASK-003",
        title: "Implement auth flow",
        status: "In Review",
        priority: "High",
        assignee: "Carol",
        dueDate: "Aug 12",
        estimate: "5h",
    },
    {
        id: "TASK-004",
        title: "Write unit tests",
        status: "Todo",
        priority: "Medium",
        assignee: "Dave",
        dueDate: "Aug 20",
        estimate: "4h",
    },
    {
        id: "TASK-005",
        title: "API rate limiting",
        status: "Todo",
        priority: "Low",
        assignee: "Eve",
        dueDate: "Aug 25",
        estimate: "2h",
    },
];

export const useListStore = create<ListState>()(
    devtools((set) => ({
        tasks: INITIAL_TASKS,
        setTasks: (tasks) => set({ tasks }),
    }))
);