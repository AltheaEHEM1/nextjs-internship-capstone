import { useEffect, useState } from "react";
import { getProjectSettingsAction } from "@/actions/project/Project";
import { createTaskAction, deleteTaskAction } from "@/actions/task/Task";
import { useToast } from "@/hooks/toast/use-toast";
import {
	type TaskData,
	useTaskModalStore,
} from "@/stores/task/task-modal-store";

export function useTaskModal({
	mode,
	opened,
	onClose,
	projectId,
	taskData,
	onUpdateTask,
}: {
	mode: "create" | "view";
	opened: boolean;
	onClose: () => void;
	projectId?: string;
	taskData?: TaskData;
	onUpdateTask?: (updatedFields: Record<string, unknown>) => void;
}) {
	const {
		taskName,
		status,
		setStatus,
		description,
		priority,
		dueDate,
		labels,
		assignee,
		reset,
		initializeForView,
		setMode,
	} = useTaskModalStore();

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

	// Initialize state when modal opens
	useEffect(() => {
		if (opened) {
			if (mode === "view" && taskData) {
				initializeForView(taskData, onUpdateTask);
			} else {
				setMode("create");
			}
		}
	}, [opened, mode, taskData, initializeForView, setMode, onUpdateTask]);

	// Fetch project data (statuses, members, etc.)
	useEffect(() => {
		if (opened && projectId) {
			setIsLoading(true);
			getProjectSettingsAction(projectId).then((result) => {
				if (result.success && result.data) {
					setProjectData(result.data);
					if (result.data.statuses.length > 0 && !status && mode === "create") {
						setStatus(result.data.statuses[0].id);
					}
				}
				setIsLoading(false);
			});
		}
	}, [opened, projectId, setStatus, status, mode]);

	const handleCreate = async (e: React.FormEvent) => {
		e.preventDefault();
		if (mode !== "create" || !projectId) return;

		setIsSubmitting(true);
		setError(null);

		try {
			const result = await createTaskAction({
				title: taskName,
				description,
				statusId: status,
				assigneeId: assignee || undefined,
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

	const handleDelete = async () => {
		const { taskId } = useTaskModalStore.getState();
		if (mode !== "view" || !projectId || !taskId) return;

		const confirmed = window.confirm(
			"Are you sure you want to delete this task? This action cannot be undone.",
		);
		if (!confirmed) return;

		setIsSubmitting(true);
		setError(null);

		try {
			const result = await deleteTaskAction(taskId, projectId);
			if (result.success) {
				toast({
					title: "Task deleted",
					description: "The task was successfully deleted.",
					variant: "success",
				});
				onClose();
			} else {
				setError(result.error || "Failed to delete task");
				toast({
					title: "Error",
					description: result.error || "Failed to delete task",
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

	return {
		projectData,
		isLoading,
		isSubmitting,
		error,
		handleCreate,
		handleDelete,
	};
}
