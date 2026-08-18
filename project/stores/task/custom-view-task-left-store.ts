// stores/custom-view-task-left-store.ts
"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

type TaskData = { title: string; description: string; status: string };

type TaskComment = {
	id?: string;
	content: string;
	createdAt?: string | Date;
	author?: {
		name?: string | null;
	} | null;
};

type UpdateTaskCallback = (updatedFields: Record<string, unknown>) => void;

type TaskActivity = {
	id?: string;
	action: string;
	createdAt?: string | Date;
	author?: {
		name?: string | null;
	} | null;
};

export interface CustomViewTaskLeftState {
	// Form fields
	title: string;
	isEditingTitle: boolean;
	description: string;
	isEditingDesc: boolean;
	activeTab: "comments" | "history";
	comments: TaskComment[];
	history: TaskActivity[];
	newComment: string;
	// Callback
	onUpdateTask?: UpdateTaskCallback;
	// Setters
	setTitle: (title: string) => void;
	setIsEditingTitle: (edit: boolean) => void;
	setDescription: (desc: string) => void;
	setIsEditingDesc: (edit: boolean) => void;
	setActiveTab: (tab: "comments" | "history") => void;
	setComments: (c: TaskComment[]) => void;
	setHistory: (h: TaskActivity[]) => void;
	setNewComment: (c: string) => void;
	// Initializer
	initialize: (taskData: TaskData, onUpdateTask?: UpdateTaskCallback) => void;
	// Handlers
	handleTitleBlur: () => void;
	handleDescBlur: () => void;
	fetchComments: (taskId: string) => Promise<void>;
	fetchHistory: (taskId: string) => Promise<void>;
	handleAddComment: (taskId: string, projectId: string) => Promise<void>;
}

export const useCustomViewTaskLeftStore = create<CustomViewTaskLeftState>()(
	devtools((set, get) => ({
		// defaults
		title: "",
		isEditingTitle: false,
		description: "",
		isEditingDesc: false,
		activeTab: "comments",
		comments: [],
		history: [],
		newComment: "",
		onUpdateTask: undefined,
		// setters
		setTitle: (title) => set({ title }),
		setIsEditingTitle: (edit) => set({ isEditingTitle: edit }),
		setDescription: (desc) => set({ description: desc }),
		setIsEditingDesc: (edit) => set({ isEditingDesc: edit }),
		setActiveTab: (tab) => set({ activeTab: tab }),
		setComments: (c) => set({ comments: c }),
		setHistory: (h) => set({ history: h }),
		setNewComment: (c) => set({ newComment: c }),
		// initializer
		initialize: (taskData, onUpdateTask) => {
			set({
				title: taskData.title,
				description: taskData.description,
				onUpdateTask,
			});
		},
		// handlers
		handleTitleBlur: () => {
			const { title, onUpdateTask } = get();
			set({ isEditingTitle: false });
			if (onUpdateTask && title !== "") {
				onUpdateTask({ title });
			}
		},
		handleDescBlur: () => {
			const { description, onUpdateTask } = get();
			set({ isEditingDesc: false });
			if (onUpdateTask && description !== "") {
				onUpdateTask({ description });
			}
		},
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
	})),
);
