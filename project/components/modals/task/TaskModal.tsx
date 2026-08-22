"use client";

import {
	AlertCircle,
	History,
	MessageSquare,
	Plus,
	Trash2,
} from "lucide-react";
import { useEffect, useState } from "react";
import { Alert, AlertDescription, AlertTitle } from "@/components/alert/Alert";
import BaseModal from "@/components/layout/BaseModal";
import TaskModalLeft from "@/components/modals/task/TaskModalLeft";
import TaskModalRight from "@/components/modals/task/TaskModalRight";
import ConfirmDialog from "@/components/modals/team/ConfirmDialog";
import { useTaskModal } from "@/hooks/task/useTaskModal";
import { type TaskData, useTaskModalStore } from "@/stores/task/TaskModalStore";

interface TaskModalProps {
	mode: "create" | "view";
	opened: boolean;
	onClose: () => void;
	onOpenAddPriority?: () => void;
	onOpenAddLabel?: () => void;
	projectId?: string;
	taskData?: TaskData;
	currentUserPermission?: string;
	onUpdateTask?: (updatedFields: Record<string, unknown>) => void;
}

export default function TaskModal({
	mode,
	opened,
	onClose,
	onOpenAddPriority,
	onOpenAddLabel,
	projectId,
	taskData,
	currentUserPermission,
	onUpdateTask,
}: TaskModalProps) {
	const {
		workType,
		activeTab,
		setActiveTab,
		comments,
		history,
		newComment,
		setNewComment,
		handleAddComment,
		taskId,
		isCheckingName,
		isNameUnique,
		taskName,
		status,
		errors,
	} = useTaskModalStore();
	const {
		projectData,
		isLoading,
		isSubmitting,
		error,
		handleCreate,
		handleDelete,
	} = useTaskModal({
		mode,
		opened,
		onClose,
		projectId,
		taskData,
		onUpdateTask,
	});

	const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

	useEffect(() => {
		if (currentUserPermission) {
			useTaskModalStore
				.getState()
				.setCurrentUserPermission(currentUserPermission);
		}
	}, [currentUserPermission]);

	useEffect(() => {
		if (!opened) {
			useTaskModalStore.getState().reset();
		}
	}, [opened]);

	const modalTitle =
		mode === "create" ? (
			<div className="flex items-center gap-2">
				<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
					<Plus size={18} />
				</span>
				<span className="text-base font-semibold font-['Poppins',sans-serif]">
					Create Task
				</span>
			</div>
		) : (
			<div className="flex items-center gap-2 text-xs font-semibold uppercase tracking-wider text-gray-500 dark:text-gray-400">
				<span className="rounded bg-gray-100 px-2 py-0.5 dark:bg-gray-800">
					{workType}
				</span>
				<span>• Task Details</span>
			</div>
		);

	return (
		<BaseModal
			opened={opened}
			onClose={onClose}
			width={900}
			title={modalTitle}
			footer={
				mode === "create" ? (
					<>
						<button
							type="button"
							onClick={onClose}
							className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
						>
							Cancel
						</button>
						<button
							type="submit"
							form="task-modal-form"
							disabled={
								isSubmitting ||
								isNameUnique === false ||
								isCheckingName ||
								!taskName.trim() ||
								!status ||
								Object.keys(errors).some((key) => errors[key])
							}
							className="rounded-xl bg-cyan-500 hover:bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-cyan-500/20 transition-all disabled:opacity-50"
						>
							{isSubmitting ? "Creating..." : "Create Task"}
						</button>
					</>
				) : (
					<div className="flex justify-between w-full">
						<div>
							{currentUserPermission === "administrator" && (
								<button
									type="button"
									onClick={() => setShowDeleteConfirm(true)}
									disabled={isSubmitting}
									className="flex items-center gap-2 rounded-xl px-4 py-2 text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-500/10 transition-colors disabled:opacity-50"
								>
									<Trash2 size={16} />
									Delete Task
								</button>
							)}
						</div>
						<button
							type="button"
							onClick={onClose}
							className="rounded-xl px-4 py-2 text-sm font-medium text-slate-600 hover:bg-slate-100 dark:text-slate-400 dark:hover:bg-slate-800 transition-colors"
						>
							Close
						</button>
					</div>
				)
			}
		>
			{error && (
				<Alert variant="destructive" className="mb-4">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
			<form id="task-modal-form" onSubmit={handleCreate}>
				<div className="grid grid-cols-12 gap-6">
					<div className="col-span-12 md:col-span-7">
						<TaskModalLeft />
					</div>
					<div className="col-span-12 md:col-span-5">
						<TaskModalRight
							projectData={projectData}
							isLoading={isLoading}
							onOpenAddPriority={onOpenAddPriority}
							onOpenAddLabel={onOpenAddLabel}
						/>
					</div>
				</div>

				<div className="mt-6 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
					<span>
						{mode === "create"
							? "Created: Automatically upon save"
							: "Auto-saved on change"}
					</span>
				</div>
			</form>

			{/* Activity Tab Section (Only in View Mode) */}
			{mode === "view" && (
				<div className="space-y-3 pt-4 border-t border-slate-200 dark:border-slate-800">
					<div className="flex items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-2">
						<button
							type="button"
							onClick={() => setActiveTab("comments")}
							className={`flex items-center gap-1.5 text-xs font-semibold pb-1 transition border-b-2 ${
								activeTab === "comments"
									? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
									: "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
							}`}
						>
							<MessageSquare size={14} /> Comments ({comments.length})
						</button>
						<button
							type="button"
							onClick={() => setActiveTab("history")}
							className={`flex items-center gap-1.5 text-xs font-semibold pb-1 transition border-b-2 ${
								activeTab === "history"
									? "border-cyan-500 text-cyan-600 dark:text-cyan-400"
									: "border-transparent text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-slate-200"
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
									onChange={(e) =>
										setNewComment(e.target.value.replace(/\s{2,}/g, " "))
									}
									onKeyDown={(e) => {
										if (e.key === "Enter" && taskId) {
											e.preventDefault();
											handleAddComment(taskId, projectId || "");
										}
									}}
									className="w-full text-sm rounded-lg border border-slate-200 p-2 dark:bg-slate-900 dark:border-slate-800 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
								/>
							</div>
							<div className="space-y-2 max-h-[300px] overflow-y-auto pr-1">
								{comments.map((comment, idx) => (
									<div
										key={comment.id || idx}
										className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800"
									>
										<div className="flex justify-between text-xs text-slate-500 mb-1">
											<span className="font-semibold text-slate-700 dark:text-slate-300">
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
						<div className="space-y-3 max-h-[300px] overflow-y-auto pr-1">
							{history.map((activity, idx) => (
								<div
									key={activity.id || idx}
									className="bg-slate-50 dark:bg-slate-900 p-3 rounded-lg text-sm text-slate-700 dark:text-slate-300 border border-slate-100 dark:border-slate-800"
								>
									<div className="flex justify-between text-xs text-slate-500 mb-1">
										<span className="font-semibold text-slate-700 dark:text-slate-300">
											{activity.author?.name || "User"}
										</span>
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
								<div className="text-xs text-slate-500 dark:text-slate-400 py-3 italic">
									No history recorded yet.
								</div>
							)}
						</div>
					)}
				</div>
			)}

			<ConfirmDialog
				opened={showDeleteConfirm}
				onClose={() => setShowDeleteConfirm(false)}
				onConfirm={async () => {
					await handleDelete();
					setShowDeleteConfirm(false);
				}}
				title="Delete Task"
				description="Are you sure you want to delete this task? This action cannot be undone."
				confirmLabel="Delete"
				loading={isSubmitting}
			/>
		</BaseModal>
	);
}
