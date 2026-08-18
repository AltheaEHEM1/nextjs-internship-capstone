"use client";

import { Flag, Plus, Tag } from "lucide-react";
import { useEffect } from "react";
import BaseModal from "@/components/layout/BaseModal";
import type { Status, WorkType } from "@/stores/task/custom-create-task-store";
import { useCustomCreateTaskStore } from "@/stores/task/custom-create-task-store";

interface CreateTaskModalProps {
	opened: boolean;
	onClose: () => void;
	onOpenAddPriority?: () => void;
	onOpenAddLabel?: () => void;
}

export default function CreateTaskModal({
	opened,
	onClose,
	onOpenAddPriority,
	onOpenAddLabel,
}: CreateTaskModalProps) {
	const {
		taskName,
		setTaskName,
		project,
		setProject,
		workType,
		setWorkType,
		status,
		setStatus,
		description,
		setDescription,
		assignee,
		setAssignee,
		priority,
		setPriority,
		dueDate,
		setDueDate,
		startDate,
		setStartDate,
		labels,
		setLabels,
		team,
		setTeam,
		reporter,
		setReporter,
		reset,
	} = useCustomCreateTaskStore();

	const handleCreate = (e: React.FormEvent) => {
		e.preventDefault();
		// Optionally reset after creation
		reset();
		console.log({
			taskName,
			project,
			workType,
			status,
			description,
			assignee,
			priority,
			dueDate,
			startDate,
			labels,
			team,
			reporter,
		});
		onClose();
	};

	useEffect(() => {
		if (opened) {
			reset();
		}
	}, [opened, reset]);

	return (
		<BaseModal
			opened={opened}
			onClose={onClose}
			width={700}
			title={
				<div className="flex items-center gap-2">
					<span className="flex h-8 w-8 items-center justify-center rounded-lg bg-cyan-500/10 text-cyan-600 dark:text-cyan-400">
						<Plus size={18} />
					</span>
					<span className="text-base font-semibold font-['Poppins',sans-serif]">
						Create Task
					</span>
				</div>
			}
			footer={
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
						form="create-task-form"
						className="rounded-xl bg-cyan-500 hover:bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-cyan-500/20 transition-all"
					>
						Create Task
					</button>
				</>
			}
		>
			<form
				id="create-task-form"
				onSubmit={handleCreate}
				className="space-y-4 max-h-[70vh] overflow-y-auto pr-1"
			>
				{/* Task Title */}
				<div>
					<label
						htmlFor="taskSummary"
						className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
					>
						Task Summary / Title <span className="text-red-500">*</span>
					</label>
					<input
						id="taskSummary"
						type="text"
						required
						value={taskName}
						onChange={(e) => setTaskName(e.target.value)}
						placeholder="e.g. Implement Role-Based Access Control module"
						className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
					/>
				</div>

				{/* Project & Work Type Row */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label
							htmlFor="project"
							className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
						>
							Project
						</label>
						<select
							id="project"
							value={project}
							onChange={(e) => setProject(e.target.value)}
							className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
						>
							<option value="">Select project...</option>
							<option value="PUP Inventory System">PUP Inventory System</option>
							<option value="Yo Etz AI">Yo Etz AI</option>
							<option value="SRG Website">SRG Website</option>
						</select>
					</div>

					<div>
						<label
							htmlFor="workType"
							className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
						>
							Work Type
						</label>
						<select
							id="workType"
							value={workType}
							onChange={(e) => setWorkType(e.target.value as WorkType)}
							className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
						>
							<option value="Epic">Epic</option>
							<option value="Story">Story</option>
							<option value="Bug">Bug</option>
							<option value="Task">Task</option>
							<option value="Request">Request</option>
						</select>
					</div>
				</div>

				{/* Status & Team Row */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label
							htmlFor="status"
							className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
						>
							Status
						</label>
						<select
							id="status"
							value={status}
							onChange={(e) => setStatus(e.target.value as Status)}
							className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
						>
							<option value="To Do">To Do</option>
							<option value="In Progress">In Progress</option>
							<option value="In Review">In Review</option>
							<option value="Done">Done</option>
						</select>
					</div>

					<div>
						<label
							htmlFor="team"
							className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
						>
							Team
						</label>
						<select
							id="team"
							value={team}
							onChange={(e) => setTeam(e.target.value)}
							className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
						>
							<option value="">Select team...</option>
							<option value="Core Architecture">Core Architecture</option>
							<option value="Frontend Team">Frontend Team</option>
							<option value="Backend Team">Backend Team</option>
						</select>
					</div>
				</div>

				{/* Description (Rich Editor Simulation) */}
				<div>
					<label
						htmlFor="description"
						className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
					>
						Description
					</label>
					<div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 overflow-hidden">
						{/* Simple Toolbar representation */}
						<div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 px-3 py-1.5 bg-slate-100/50 dark:bg-slate-900/50 text-xs font-medium text-slate-500">
							<button
								type="button"
								className="hover:text-slate-800 dark:hover:text-slate-200 font-bold"
							>
								B
							</button>
							<button
								type="button"
								className="hover:text-slate-800 dark:hover:text-slate-200 italic"
							>
								I
							</button>
							<button
								type="button"
								className="hover:text-slate-800 dark:hover:text-slate-200 underline"
							>
								U
							</button>
							<span className="text-slate-300 dark:text-slate-700">|</span>
							<button
								type="button"
								className="hover:text-slate-800 dark:hover:text-slate-200"
							>
								List
							</button>
							<button
								type="button"
								className="hover:text-slate-800 dark:hover:text-slate-200"
							>
								Code
							</button>
						</div>
						<textarea
							id="description"
							value={description}
							onChange={(e) => setDescription(e.target.value)}
							placeholder="Provide detailed description, requirements, or acceptance criteria..."
							rows={4}
							className="w-full bg-transparent px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden resize-none"
						/>
					</div>
				</div>

				{/* Assignee & Priority Row */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label
							htmlFor="assignee"
							className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
						>
							Assignee
						</label>
						<select
							id="assignee"
							value={assignee}
							onChange={(e) => setAssignee(e.target.value)}
							className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
						>
							<option value="">Select assignee...</option>
							<option value="Yuan Evangelista">Yuan Evangelista</option>
							<option value="Alex Mercer">Alex Mercer</option>
							<option value="Sarah Jenkins">Sarah Jenkins</option>
						</select>
					</div>

					<div>
						<div className="flex items-center justify-between mb-1.5">
							<label
								htmlFor="priority"
								className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider"
							>
								Priority
							</label>
							{onOpenAddPriority && (
								<button
									type="button"
									onClick={onOpenAddPriority}
									className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
								>
									<Flag size={12} /> Add Priority
								</button>
							)}
						</div>
						<select
							id="priority"
							value={priority}
							onChange={(e) =>
								setPriority(e.target.value as "High" | "Medium" | "Low")
							}
							className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
						>
							<option value="High">High</option>
							<option value="Medium">Medium</option>
							<option value="Low">Low</option>
						</select>
					</div>
				</div>

				{/* Start Date & Due Date Row */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<label
							htmlFor="startDate"
							className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
						>
							Start Date
						</label>
						<input
							id="startDate"
							type="date"
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
							className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
						/>
					</div>

					<div>
						<label
							htmlFor="dueDate"
							className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
						>
							Due Date
						</label>
						<input
							id="dueDate"
							type="date"
							value={dueDate}
							onChange={(e) => setDueDate(e.target.value)}
							className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
						/>
					</div>
				</div>

				{/* Labels & Reporter Row */}
				<div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
					<div>
						<div className="flex items-center justify-between mb-1.5">
							<label
								htmlFor="labels"
								className="text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider"
							>
								Labels
							</label>
							{onOpenAddLabel && (
								<button
									type="button"
									onClick={onOpenAddLabel}
									className="inline-flex items-center gap-1 text-[11px] font-medium text-cyan-600 dark:text-cyan-400 hover:underline"
								>
									<Tag size={12} /> Add Label
								</button>
							)}
						</div>
						<select
							id="labels"
							value={labels}
							onChange={(e) => setLabels(e.target.value)}
							className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
						>
							<option value="">Select label...</option>
							<option value="Frontend">Frontend</option>
							<option value="Backend">Backend</option>
							<option value="Bug">Bug</option>
							<option value="Feature">Feature</option>
						</select>
					</div>

					<div>
						<label
							htmlFor="reporter"
							className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
						>
							Reporter
						</label>
						<select
							id="reporter"
							value={reporter}
							onChange={(e) => setReporter(e.target.value)}
							className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
						>
							<option value="">Select reporter...</option>
							<option value="Yuan Evangelista">Yuan Evangelista</option>
							<option value="Project Manager">Project Manager</option>
						</select>
					</div>
				</div>

				{/* System Meta Information (Date created/edited) */}
				<div className="pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
					<span>Created: Automatically upon save</span>
					<span>Last Edited: N/A</span>
				</div>
			</form>
		</BaseModal>
	);
}
