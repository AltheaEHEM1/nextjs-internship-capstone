"use client";

import { Calendar, Clock, Flag, Tag, User } from "lucide-react";
import { useEffect } from "react";
import { useCustomViewTaskRightStore } from "@/stores/task/custom-view-task-right-store";

interface ViewTaskRightProps {
	taskData: {
		status: string;
		assignee: string;
		priority: "low" | "medium" | "high";
		dueDate: string;
		label: string;
		startDate: string;
		reporter: string;
	};
	onUpdateTask?: (updatedFields: Record<string, unknown>) => void;
	projectId?: string;
}

export default function ViewTaskModalRight({
	taskData,
	onUpdateTask,
	projectId,
}: ViewTaskRightProps) {
	// Access Zustand store for right pane
	const {
		status,
		setStatus,
		assignee,
		setAssignee,
		priority,
		setPriority,
		dueDate,
		setDueDate,
		label,
		setLabel,
		startDate,
		setStartDate,
		projectMembers,
		handleFieldChange,
		fetchProjectMembers,
	} = useCustomViewTaskRightStore();

	// Initialize store with incoming props
	useEffect(() => {
		useCustomViewTaskRightStore.getState().initialize(taskData, onUpdateTask);
		if (projectId) {
			fetchProjectMembers(projectId);
		}
	}, [taskData, onUpdateTask, projectId, fetchProjectMembers]);

	return (
		<>
			{/* Status Dropdown */}
			<div>
				<label
					htmlFor="statusSelect"
					className="text-xs font-medium text-gray-500 dark:text-gray-400 block mb-1"
				>
					Status
				</label>
				<select
					id="statusSelect"
					value={status}
					onChange={(e) => {
						setStatus(e.target.value);
						handleFieldChange("status", e.target.value);
					}}
					className="w-full text-sm rounded-lg border border-gray-300 p-2 bg-white dark:bg-gray-800 dark:border-gray-700 dark:text-white font-medium"
				>
					<option value="To Do">To Do</option>
					<option value="In Progress">In Progress</option>
					<option value="In Review">In Review</option>
					<option value="Done">Done</option>
				</select>
			</div>

			{/* Details Container */}
			<div className="space-y-4 pt-2 border-t border-gray-200 dark:border-gray-700">
				<h4 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
					Details
				</h4>

				{/* Assignee */}
				<div className="flex items-center justify-between text-sm">
					<span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
						<User size={14} /> Assignee
					</span>
					<select
						value={assignee || ""}
						onChange={(e) => {
							setAssignee(e.target.value);
							handleFieldChange("assigneeId", e.target.value);
						}}
						className="text-xs bg-transparent border border-gray-300 rounded px-1.5 py-0.5 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
					>
						<option value="" disabled>
							Select User
						</option>
						{projectMembers.map((member) => (
							<option key={member.id} value={member.id}>
								{member.name}
							</option>
						))}
					</select>
				</div>

				{/* Priority */}
				<div className="flex items-center justify-between text-sm">
					<span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
						<Flag size={14} /> Priority
					</span>
					<select
						value={priority}
						onChange={(e) => {
							const val = e.target.value as "low" | "medium" | "high";
							setPriority(val);
							handleFieldChange("priority", val);
						}}
						className="text-xs bg-transparent border border-gray-300 rounded px-1.5 py-0.5 dark:bg-gray-800 dark:border-gray-700 dark:text-white capitalize"
					>
						<option value="low">Low</option>
						<option value="medium">Medium</option>
						<option value="high">High</option>
					</select>
				</div>

				{/* Due Date */}
				<div className="flex items-center justify-between text-sm">
					<span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
						<Calendar size={14} /> Due Date
					</span>
					<input
						type="date"
						value={dueDate}
						onChange={(e) => {
							setDueDate(e.target.value);
							handleFieldChange("dueDate", e.target.value);
						}}
						className="text-xs bg-transparent border border-gray-300 rounded px-1 py-0.5 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
					/>
				</div>

				{/* Label */}
				<div className="flex items-center justify-between text-sm">
					<span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
						<Tag size={14} /> Label
					</span>
					<input
						type="text"
						value={label}
						onChange={(e) => setLabel(e.target.value)}
						onBlur={() => handleFieldChange("label", label)}
						className="text-right text-xs bg-transparent border-b border-transparent hover:border-gray-300 focus:border-[#1e9b65] focus:outline-none dark:text-white"
					/>
				</div>

				{/* Start Date */}
				<div className="flex items-center justify-between text-sm">
					<span className="flex items-center gap-1.5 text-gray-500 dark:text-gray-400 text-xs">
						<Clock size={14} /> Start Date
					</span>
					<input
						type="date"
						value={startDate}
						onChange={(e) => {
							setStartDate(e.target.value);
							handleFieldChange("startDate", e.target.value);
						}}
						className="text-xs bg-transparent border border-gray-300 rounded px-1 py-0.5 dark:bg-gray-800 dark:border-gray-700 dark:text-white"
					/>
				</div>

				{/* Reporter */}
				<div className="flex items-center justify-between text-sm pt-2 border-t border-gray-200 dark:border-gray-700">
					<span className="text-gray-500 dark:text-gray-400 text-xs">
						Reporter
					</span>
					<span className="text-xs font-medium text-gray-800 dark:text-gray-200">
						{taskData.reporter}
					</span>
				</div>
			</div>
		</>
	);
}
