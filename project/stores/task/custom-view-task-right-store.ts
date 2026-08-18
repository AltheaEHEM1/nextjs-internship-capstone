"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

type TaskData = {
	status: string;
	assignee: string;
	priority: "low" | "medium" | "high";
	dueDate: string;
	label: string;
	startDate: string;
};

type UpdateTaskCallback = (updatedFields: Record<string, unknown>) => void;

export interface CustomViewTaskRightState {
	// fields
	status: string;
	assignee: string;
	priority: "low" | "medium" | "high";
	dueDate: string;
	label: string;
	startDate: string;
	projectMembers: { id: string; name: string | null }[];
	// callback
	onUpdateTask?: UpdateTaskCallback;
	// setters
	setStatus: (s: string) => void;
	setAssignee: (a: string) => void;
	setPriority: (p: "low" | "medium" | "high") => void;
	setDueDate: (d: string) => void;
	setLabel: (l: string) => void;
	setStartDate: (d: string) => void;
	setProjectMembers: (members: { id: string; name: string | null }[]) => void;
	// initializer
	initialize: (taskData: TaskData, onUpdateTask?: UpdateTaskCallback) => void;
	// handler to propagate changes
	handleFieldChange: (field: string, value: unknown) => void;
	fetchProjectMembers: (projectId: string) => Promise<void>;
}

export const useCustomViewTaskRightStore = create<CustomViewTaskRightState>()(
	devtools((set, get) => ({
		// defaults
		status: "",
		assignee: "",
		priority: "low",
		dueDate: "",
		label: "",
		startDate: "",
		projectMembers: [],
		onUpdateTask: undefined,
		// setters
		setStatus: (s) => set({ status: s }),
		setAssignee: (a) => set({ assignee: a }),
		setPriority: (p) => set({ priority: p }),
		setDueDate: (d) => set({ dueDate: d }),
		setLabel: (l) => set({ label: l }),
		setStartDate: (d) => set({ startDate: d }),
		setProjectMembers: (members) => set({ projectMembers: members }),
		// initializer
		initialize: (taskData, onUpdateTask) => {
			set({
				status: taskData.status,
				assignee: taskData.assignee,
				priority: taskData.priority,
				dueDate: taskData.dueDate ? taskData.dueDate.split("T")[0] : "",
				label: taskData.label,
				startDate: taskData.startDate ? taskData.startDate.split("T")[0] : "",
				onUpdateTask,
			});
		},
		// handler to forward updates
		handleFieldChange: (field, value) => {
			const { onUpdateTask } = get();
			if (onUpdateTask) {
				onUpdateTask({ [field]: value });
			}
		},
		fetchProjectMembers: async (projectId: string) => {
			const { getProjectMembersAction } = await import(
				"@/actions/project/Project"
			);
			const res = await getProjectMembersAction(projectId);
			if (res.success && res.data) {
				set({ projectMembers: res.data });
			}
		},
	})),
);
