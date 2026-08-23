import { useEffect, useState } from "react";

import { useToast } from "@/hooks/toast/use-toast";
import { type TaskData, useTaskModalStore } from "@/stores/task/TaskModalStore";

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
			fetch(`/api/project/${projectId}/settings`)
				.then((r) => r.json())
				.then((result) => {
					if (result.success && result.data) {
						setProjectData(result.data);
						if (
							result.data.statuses.length > 0 &&
							!status &&
							mode === "create"
						) {
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
			const req = await fetch("/api/task/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					title: taskName,
					description,
					statusId: status,
					assigneeId: assignee || undefined,
					priority: priority as "low" | "medium" | "high" | "urgent",
					dueDate: dueDate || undefined,
					projectId: projectId,
					labelName: labels || undefined,
				}),
			});
			const result = await req.json();

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
		return () => reset();
	}, [opened, reset]);

	const handleDelete = async () => {
		const { taskId } = useTaskModalStore.getState();
		if (mode !== "view" || !projectId || !taskId) return;

		setIsSubmitting(true);
		setError(null);

		try {
			const req = await fetch(`/api/task/${taskId}`, {
				method: "DELETE",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ projectId }),
			});
			const result = await req.json();
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
