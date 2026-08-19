"use client";

import { useUser } from "@clerk/nextjs";
import { AlertCircle, Flag, Plus, Tag } from "lucide-react";
import { useEffect, useState } from "react";
import { getProjectSettingsAction } from "@/actions/project/Project";
import { createTaskAction } from "@/actions/task/Task";
import { Alert, AlertDescription, AlertTitle } from "@/components/alert/alert";
import BaseModal from "@/components/layout/BaseModal";
import { useToast } from "@/hooks/toast/use-toast";
import { useCustomCreateTaskStore } from "@/stores/task/custom-create-task-store";
import CreateTaskModalLeft from "@/components/modals/task/create-task-modal/CreateTaskModalLeft";
import CreateTaskModalRight from "@/components/modals/task/create-task-modal/CreateTaskModalRight";

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
		status,
		setStatus,
		description,
		priority,
		dueDate,
		startDate,
		labels,
		team,
		reset,
	} = useCustomCreateTaskStore();

	const { toast } = useToast();
	const [projectData, setProjectData] = useState<{
		members: { id: string; userId: string; name: string }[];
		statuses: { id: string; name: string; color: string }[];
		labels: { name: string; color: string }[];
		priorities: [string, ...string[]];
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
		if (!opened) {
			reset();
		}
	}, [opened, reset]);

	return (
		<BaseModal
			opened={opened}
			onClose={onClose}
			width={900} // Increased width for better split layout
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
			>
				<div className="grid grid-cols-12 gap-6">
					<div className="col-span-12 md:col-span-7">
						<CreateTaskModalLeft />
					</div>
					<div className="col-span-12 md:col-span-5">
						<CreateTaskModalRight
							projectData={projectData}
							isLoading={isLoading}
							onOpenAddPriority={onOpenAddPriority}
							onOpenAddLabel={onOpenAddLabel}
						/>
					</div>
				</div>

				<div className="mt-6 pt-2 border-t border-slate-200 dark:border-slate-800 text-[11px] text-slate-400 flex items-center justify-between">
					<span>Created: Automatically upon save</span>
					<span>Last Edited: N/A</span>
				</div>
			</form>
		</BaseModal>
	);
}
