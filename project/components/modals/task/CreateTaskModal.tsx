"use client";

import { useUser } from "@clerk/nextjs";
import { AlertCircle, Flag, Plus, Tag } from "lucide-react";
import Image from "next/image";
import { useEffect, useState } from "react";
import { getProjectSettingsAction } from "@/actions/project/Project";
import { createTaskAction } from "@/actions/task/Task";
import { Alert, AlertDescription, AlertTitle } from "@/components/alert/alert";
import BaseModal from "@/components/layout/BaseModal";
import { useToast } from "@/hooks/toast/use-toast";
import type { Status } from "@/stores/task/custom-create-task-store";
import { useCustomCreateTaskStore } from "@/stores/task/custom-create-task-store";

interface CreateTaskModalProps {
	opened: boolean;
	onClose: () => void;
	onOpenAddPriority?: () => void;
	onOpenAddLabel?: () => void;
	projectId?: string;
}

export default function CreateTaskModal({
	opened,
	onClose,
	onOpenAddPriority,
	onOpenAddLabel,
	projectId,
}: CreateTaskModalProps) {
	const {
		taskName,
		setTaskName,
		status,
		setStatus,
		description,
		setDescription,
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
		reset,
	} = useCustomCreateTaskStore();

	const { user } = useUser();
	const { toast } = useToast();
	const [projectData, setProjectData] = useState<{
		members: { id: string; userId: string; name: string }[];
		statuses: { id: string; name: string; color: string }[];
		labels: { name: string; color: string }[];
	} | null>(null);
	const [isLoading, setIsLoading] = useState(false);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [error, setError] = useState<string | null>(null);

	useEffect(() => {
		if (opened && projectId) {
			setIsLoading(true);
			getProjectSettingsAction(projectId).then((result) => {
				if (result.success && result.data) {
					setProjectData(result.data);
					if (result.data.statuses.length > 0 && !status) {
						setStatus(result.data.statuses[0].id);
					}
				}
				setIsLoading(false);
			});
		}
	}, [opened, projectId, setStatus, status]);

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (!projectId) return;

		setIsSubmitting(true);
		setError(null);

		try {
			const result = await createTaskAction({
				title: taskName,
				description,
				statusId: status,
				assigneeId: team || undefined,
				priority: priority as "low" | "medium" | "high" | "urgent",
				dueDate: dueDate || undefined,
				projectId: projectId,
				labelName: labels || undefined,
			});

			if (result.success) {
				toast({
					title: "Task created",
					description: "The task was successfully created.",
					variant: "success",
				});
				reset();
				onClose();
			} else {
				setError(result.error || "Failed to create task");
				toast({
					title: "Error",
					description: result.error || "Failed to create task",
					variant: "destructive",
				});
			}
		} catch (err: unknown) {
			const msg = err instanceof Error ? err.message : "An error occurred";
			setError(msg);
			toast({
				title: "Error",
				description: msg,
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
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
						disabled={isSubmitting}
						className="rounded-xl bg-cyan-500 hover:bg-cyan-600 px-4 py-2 text-sm font-semibold text-white shadow-md shadow-cyan-500/20 transition-all disabled:opacity-50"
					>
						{isSubmitting ? "Creating..." : "Create Task"}
					</button>
				</>
			}
		>
			{error && (
				<Alert variant="destructive" className="mb-4">
					<AlertCircle className="h-4 w-4" />
					<AlertTitle>Error</AlertTitle>
					<AlertDescription>{error}</AlertDescription>
				</Alert>
			)}
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
							disabled={isLoading}
						>
							{isLoading ? (
								<option value="">Loading statuses...</option>
							) : projectData?.statuses.length ? (
								projectData.statuses.map((s) => (
									<option key={s.id} value={s.id}>
										{s.name}
									</option>
								))
							) : (
								<option value="">No statuses</option>
							)}
						</select>
					</div>

					<div>
						<label
							htmlFor="team"
							className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
						>
							Member
						</label>
						<select
							id="team"
							value={team}
							onChange={(e) => setTeam(e.target.value)}
							className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
							disabled={isLoading}
						>
							<option value="">Select team member...</option>
							{!isLoading &&
								projectData?.members.map((m) => (
									<option key={m.userId} value={m.userId}>
										{m.name}
									</option>
								))}
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
							onChange={(e) => setPriority(e.target.value)}
							className="w-full rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5 text-sm text-slate-900 dark:text-white focus:outline-hidden focus:ring-2 focus:ring-cyan-500/50"
						>
							<option value="low">Low</option>
							<option value="medium">Medium</option>
							<option value="high">High</option>
							<option value="urgent">Urgent</option>
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
							disabled={isLoading}
						>
							<option value="">Select label...</option>
							{!isLoading &&
								projectData?.labels.map((l) => (
									<option key={l.name} value={l.name}>
										{l.name}
									</option>
								))}
						</select>
					</div>

					<div>
						<label
							htmlFor="reporter"
							className="block text-xs font-semibold text-slate-600 dark:text-slate-400 uppercase tracking-wider mb-1.5"
						>
							Reporter
						</label>
						<div className="flex items-center gap-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 px-3.5 py-2.5">
							{user?.imageUrl ? (
								<Image
									src={user.imageUrl}
									alt="Reporter"
									width={20}
									height={20}
									className="rounded-full"
								/>
							) : (
								<div className="w-5 h-5 rounded-full bg-cyan-500 text-white flex items-center justify-center text-[10px] font-bold uppercase">
									{user?.firstName?.charAt(0) ||
										user?.primaryEmailAddress?.emailAddress?.charAt(0) ||
										"?"}
								</div>
							)}
							<span className="text-sm font-medium text-slate-900 dark:text-white">
								{user?.fullName ||
									user?.primaryEmailAddress?.emailAddress ||
									"Loading..."}
							</span>
						</div>
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
