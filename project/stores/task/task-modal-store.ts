"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type WorkType = "Epic" | "Story" | "Bug" | "Task" | "Request";
export type Status = string;

export type TaskComment = {
	id?: string;
	content: string;
	createdAt?: string | Date;
	author?: {
		name?: string | null;
	} | null;
};

export type TaskActivity = {
	id?: string;
	action: string;
	createdAt?: string | Date;
	author?: {
		name?: string | null;
	} | null;
};

export type TaskData = {
	id?: string;
	title: string;
	description: string;
	status: string;
	assignee: string;
	priority: "low" | "medium" | "high" | "urgent";
	dueDate: string;
	label: string;
	startDate: string;
	reporter?: string;
	workType?: string;
};

type UpdateTaskCallback = (updatedFields: Record<string, unknown>) => void;

export interface TaskModalState {
	// Mode and Callbacks
	mode: "create" | "view";
	taskId: string | null;
	onUpdateTask?: UpdateTaskCallback;

	// Form Fields
	taskName: string;
	project: string;
	workType: WorkType;
	status: Status;
	description: string;
	assignee: string; // Used for "team" as well
	priority: string;
	dueDate: string;
	startDate: string;
	labels: string; // Also used for "label"
	reporter: string;

	// View Mode Specific
	activeTab: "comments" | "history";
	comments: TaskComment[];
	history: TaskActivity[];
	newComment: string;

	// Actions
	setMode: (m: "create" | "view") => void;
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
	setReporter: (v: string) => void;

	setActiveTab: (tab: "comments" | "history") => void;
	setNewComment: (c: string) => void;
	setComments: (c: TaskComment[]) => void;
	setHistory: (h: TaskActivity[]) => void;

	// Data fetching for view mode
	fetchComments: (taskId: string) => Promise<void>;
	fetchHistory: (taskId: string) => Promise<void>;
	handleAddComment: (taskId: string, projectId: string) => Promise<void>;

	// Handlers for View mode
	handleFieldChange: (field: string, value: unknown) => void;

	// Lifecycle
	initializeForView: (
		taskData: TaskData,
		onUpdateTask?: UpdateTaskCallback,
	) => void;
	reset: () => void;
}

export const useTaskModalStore = create<TaskModalState>()(
	devtools((set, get) => ({
		// defaults
		mode: "create",
		taskId: null,
		onUpdateTask: undefined,

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
		reporter: "",

		activeTab: "comments",
		comments: [],
		history: [],
		newComment: "",

		// setters
		setMode: (m) => set({ mode: m }),
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
		setReporter: (v) => set({ reporter: v }),

		setActiveTab: (tab) => set({ activeTab: tab }),
		setNewComment: (c) => set({ newComment: c }),
		setComments: (c) => set({ comments: c }),
		setHistory: (h) => set({ history: h }),

		// fetching
		fetchComments: async (taskId: string) => {
			const { getTaskCommentsAction } = await import("@/actions/task/Task");
			const res = await getTaskCommentsAction(taskId);
			if (res.success && res.data) {
				set({ comments: res.data });
			}
		},
		fetchHistory: async (taskId: string) => {
			const { getTaskHistoryAction } = await import("@/actions/task/Task");
			const res = await getTaskHistoryAction(taskId);
			if (res.success && res.data) {
				set({ history: res.data });
			}
		},
		handleAddComment: async (taskId: string, projectId: string) => {
			const { newComment, comments, setComments, setNewComment } = get();
			if (!newComment.trim() || !taskId) return;

			const { createTaskCommentAction } = await import("@/actions/task/Task");
			const res = await createTaskCommentAction(taskId, newComment, projectId);

			if (res.success && res.data) {
				setComments([...comments, { ...res.data, author: { name: "You" } }]);
				setNewComment("");
			}
		},

		// View Mode auto-save handler
		handleFieldChange: (field, value) => {
			const { mode, onUpdateTask } = get();
			if (mode === "view" && onUpdateTask) {
				onUpdateTask({ [field]: value });
			}
		},

		// Initializers
		initializeForView: (taskData, onUpdateTask) => {
			set({
				mode: "view",
				taskId: taskData.id || null,
				taskName: taskData.title || "",
				description: taskData.description || "",
				status: taskData.status || "",
				assignee: taskData.assignee || "",
				priority: taskData.priority || "low",
				dueDate: taskData.dueDate ? taskData.dueDate.split("T")[0] : "",
				startDate: taskData.startDate ? taskData.startDate.split("T")[0] : "",
				labels: taskData.label || "",
				reporter: taskData.reporter || "",
				workType: (taskData.workType as WorkType) || "Task",
				onUpdateTask,

				// Reset tabs
				activeTab: "comments",
				newComment: "",
			});

			if (taskData.id) {
				get().fetchComments(taskData.id);
				get().fetchHistory(taskData.id);
			}
		},

		// reset all fields
		reset: () =>
			set({
				mode: "create",
				taskId: null,
				onUpdateTask: undefined,
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
				reporter: "",
				activeTab: "comments",
				comments: [],
				history: [],
				newComment: "",
			}),
	})),
);
