"use client";

import { History, MessageSquare } from "lucide-react";
import { useEffect } from "react";
import { useCustomViewTaskLeftStore } from "@/stores/task/custom-view-task-left-store";

export interface ViewTaskLeftProps {
	taskData: {
		id: string;
		title: string;
		description: string;
		status: string;
	};
	projectId?: string;
	onUpdateTask?: (updatedFields: Record<string, unknown>) => void;
}

export default function ViewTaskModalLeft({
	taskData,
	onUpdateTask,
	projectId,
}: ViewTaskLeftProps) {
	const {
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
		history,
		newComment,
		setNewComment,
		handleTitleBlur,
		handleDescBlur,
		fetchHistory,
		handleAddComment,
	} = useCustomViewTaskLeftStore();

	useEffect(() => {
		useCustomViewTaskLeftStore.getState().initialize(taskData, onUpdateTask);
		if (taskData.id) {
			useCustomViewTaskLeftStore.getState().fetchComments(taskData.id);
			useCustomViewTaskLeftStore.getState().fetchHistory(taskData.id);
		}
	}, [taskData, onUpdateTask]);

	return (
		<>
			{/* Title */}
			<div>
				{isEditingTitle ? (
					<input
						type="text"
						value={title}
						onChange={(e) => setTitle(e.target.value)}
						onBlur={handleTitleBlur}
						className="w-full text-xl font-bold rounded-lg border border-gray-300 p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
					/>
				) : (
					<button
						type="button"
						onClick={() => setIsEditingTitle(true)}
						className="text-xl font-bold text-gray-900 dark:text-white cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-1 rounded transition text-left"
						title="Click to edit title"
					>
						{title}
					</button>
				)}
			</div>

			{/* Description */}
			<div className="space-y-1">
				<div className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
					Description
				</div>
				{isEditingDesc ? (
					<textarea
						value={description}
						onChange={(e) => setDescription(e.target.value)}
						onBlur={handleDescBlur}
						rows={4}
						className="w-full text-sm rounded-lg border border-gray-300 p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
					/>
				) : (
					<button
						type="button"
						onClick={() => setIsEditingDesc(true)}
						className="text-sm text-gray-700 dark:text-gray-300 min-h-[60px] cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800/50 p-2 rounded transition border border-transparent hover:border-gray-200 dark:hover:border-gray-700 text-left w-full"
						title="Click to edit description"
					>
						{description || "Add a more detailed description..."}
					</button>
				)}
			</div>

			{/* Activity Tab Section */}
			<div className="space-y-3 pt-4 border-t border-gray-200 dark:border-gray-700">
				<div className="flex items-center gap-4 border-b border-gray-200 dark:border-gray-700 pb-2">
					<button
						type="button"
						onClick={() => setActiveTab("comments")}
						className={`flex items-center gap-1.5 text-xs font-semibold pb-1 transition border-b-2 ${
							activeTab === "comments"
								? "border-[#1e9b65] text-[#1e9b65]"
								: "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400"
						}`}
					>
						<MessageSquare size={14} /> Comments ({comments.length})
					</button>
					<button
						type="button"
						onClick={() => setActiveTab("history")}
						className={`flex items-center gap-1.5 text-xs font-semibold pb-1 transition border-b-2 ${
							activeTab === "history"
								? "border-[#1e9b65] text-[#1e9b65]"
								: "border-transparent text-gray-500 hover:text-gray-800 dark:text-gray-400"
						}`}
					>
						<History size={14} /> History ({history.length})
					</button>
				</div>

				{activeTab === "comments" ? (
					<div className="space-y-3">
						<div className="space-y-2">
							<input
								type="text"
								placeholder="Write a comment..."
								value={newComment}
								onChange={(e) => setNewComment(e.target.value)}
								onKeyDown={(e) => {
									if (e.key === "Enter") {
										e.preventDefault();
										handleAddComment(taskData.id, projectId || "");
									}
								}}
								className="w-full text-sm rounded-lg border border-gray-300 p-2 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
							/>
						</div>
						<div className="space-y-2">
							{comments.map((comment, idx) => (
								<div
									key={comment.id || idx}
									className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700"
								>
									<div className="flex justify-between text-xs text-gray-500 mb-1">
										<span className="font-semibold">
											{comment.author?.name || "User"}
										</span>
										<span>
											{comment.createdAt
												? new Date(comment.createdAt).toLocaleString()
												: ""}
										</span>
									</div>
									{comment.content}
								</div>
							))}
						</div>
					</div>
				) : (
					<div className="space-y-3">
						{history.map((activity, idx) => (
							<div
								key={activity.id || idx}
								className="bg-gray-50 dark:bg-gray-800 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 border border-gray-100 dark:border-gray-700"
							>
								<div className="flex justify-between text-xs text-gray-500 mb-1">
									<span className="font-semibold">{activity.author?.name || "User"}</span>
									<span>
										{activity.createdAt
											? new Date(activity.createdAt).toLocaleString()
											: ""}
									</span>
								</div>
								<span>{activity.action}</span>
							</div>
						))}
						{history.length === 0 && (
							<div className="text-xs text-gray-500 dark:text-gray-400 py-3 italic">
								No history recorded yet.
							</div>
						)}
					</div>
				)}
			</div>
		</>
	);
}
