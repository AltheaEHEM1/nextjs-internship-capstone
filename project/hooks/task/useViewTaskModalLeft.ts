import { useState } from "react";

export interface ViewTaskLeftProps {
	taskData: {
		title: string;
		description: string;
		status: string;
	};
	onUpdateTask?: (updatedFields: Record<string, any>) => void;
}

export interface ViewTaskLeftHookResult {
	title: string;
	setTitle: (title: string) => void;
	isEditingTitle: boolean;
	setIsEditingTitle: (edit: boolean) => void;
	description: string;
	setDescription: (desc: string) => void;
	isEditingDesc: boolean;
	setIsEditingDesc: (edit: boolean) => void;
	activeTab: "comments" | "history";
	setActiveTab: (tab: "comments" | "history") => void;
	comments: string[];
	setComments: (c: string[]) => void;
	newComment: string;
	setNewComment: (c: string) => void;
	handleTitleBlur: () => void;
	handleDescBlur: () => void;
	handleAddComment: () => void;
}

export function useViewTaskModalLeft({
	taskData,
	onUpdateTask,
}: ViewTaskLeftProps): ViewTaskLeftHookResult {
	const [title, setTitle] = useState(taskData.title);
	const [isEditingTitle, setIsEditingTitle] = useState(false);
	const [description, setDescription] = useState(taskData.description);
	const [isEditingDesc, setIsEditingDesc] = useState(false);
	const [activeTab, setActiveTab] = useState<"comments" | "history">(
		"comments",
	);
	const [comments, setComments] = useState<string[]>([]);
	const [newComment, setNewComment] = useState("");

	const handleTitleBlur = () => {
		setIsEditingTitle(false);
		if (title !== taskData.title && onUpdateTask) {
			onUpdateTask({ title });
		}
	};

	const handleDescBlur = () => {
		setIsEditingDesc(false);
		if (description !== taskData.description && onUpdateTask) {
			onUpdateTask({ description });
		}
	};

	const handleAddComment = () => {
		if (!newComment.trim()) return;
		setComments((prev) => [...prev, newComment]);
		setNewComment("");
	};

	return {
		title,
		setTitle,
		isEditingTitle,
		setIsEditingTitle,
		description,
		setDescription,
		isEditingDesc,
		setIsEditingDesc,
		activeTab,
		setActiveTab,
		comments,
		setComments,
		newComment,
		setNewComment,
		handleTitleBlur,
		handleDescBlur,
		handleAddComment,
	};
}
