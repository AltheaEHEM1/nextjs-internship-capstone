// stores/custom-create-task-store.ts
"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type WorkType = "Epic" | "Story" | "Bug" | "Task" | "Request";

export type Status = string;

export interface CustomCreateTaskState {
	// fields
	taskName: string;
	project: string;
	workType: WorkType;
	status: Status;
	description: string;
	assignee: string;
	priority: string;
	dueDate: string;
	startDate: string;
	labels: string;
	team: string;
	reporter: string;
	// setters
	setTaskName: (v: string) => void;
	setProject: (v: string) => void;
	setWorkType: (v: WorkType) => void;
	setStatus: (v: Status) => void;
	setDescription: (v: string) => void;
	setAssignee: (v: string) => void;
	setPriority: (v: string) => void;
	setDueDate: (v: string) => void;
	setStartDate: (v: string) => void;
	setLabels: (v: string) => void;
	setTeam: (v: string) => void;
	setReporter: (v: string) => void;
	// utility
	reset: () => void;
}

export const useCustomCreateTaskStore = create<CustomCreateTaskState>()(
	devtools((set) => ({
		// defaults
		taskName: "",
		project: "",
		workType: "Task",
		status: "",
		description: "",
		assignee: "",
		priority: "medium",
		dueDate: "",
		startDate: "",
		labels: "",
		team: "",
		reporter: "",
		// setters
		setTaskName: (v) => set({ taskName: v }),
		setProject: (v) => set({ project: v }),
		setWorkType: (v) => set({ workType: v }),
		setStatus: (v) => set({ status: v }),
		setDescription: (v) => set({ description: v }),
		setAssignee: (v) => set({ assignee: v }),
		setPriority: (v) => set({ priority: v }),
		setDueDate: (v) => set({ dueDate: v }),
		setStartDate: (v) => set({ startDate: v }),
		setLabels: (v) => set({ labels: v }),
		setTeam: (v) => set({ team: v }),
		setReporter: (v) => set({ reporter: v }),
		// reset all fields
		reset: () =>
			set({
				taskName: "",
				project: "",
				workType: "Task",
				status: "",
				description: "",
				assignee: "",
				priority: "medium",
				dueDate: "",
				startDate: "",
				labels: "",
				team: "",
				reporter: "",
			}),
	})),
);
