// stores/custom-view-task-left-store.ts
"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

type TaskData = { title: string; description: string; status: string };

type UpdateTaskCallback = (updatedFields: Record<string, any>) => void;

export interface CustomViewTaskLeftState {
	// Form fields
	title: string;
	isEditingTitle: boolean;
	description: string;
	isEditingDesc: boolean;
	activeTab: "comments" | "history";
	comments: string[];
	newComment: string;
	// Callback
	onUpdateTask?: UpdateTaskCallback;
	// Setters
	setTitle: (title: string) => void;
	setIsEditingTitle: (edit: boolean) => void;
	setDescription: (desc: string) => void;
	setIsEditingDesc: (edit: boolean) => void;
	setActiveTab: (tab: "comments" | "history") => void;
	setComments: (c: string[]) => void;
	setNewComment: (c: string) => void;
	// Initializer
	initialize: (taskData: TaskData, onUpdateTask?: UpdateTaskCallback) => void;
	// Handlers
	handleTitleBlur: () => void;
	handleDescBlur: () => void;
	handleAddComment: () => void;
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
		newComment: "",
		onUpdateTask: undefined,
		// setters
		setTitle: (title) => set({ title }),
		setIsEditingTitle: (edit) => set({ isEditingTitle: edit }),
		setDescription: (desc) => set({ description: desc }),
		setIsEditingDesc: (edit) => set({ isEditingDesc: edit }),
		setActiveTab: (tab) => set({ activeTab: tab }),
		setComments: (c) => set({ comments: c }),
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
		handleAddComment: () => {
			const { newComment, comments, setComments, setNewComment } = get();
			if (!newComment.trim()) return;
			setComments([...comments, newComment]);
			setNewComment("");
		},
	})),
);
