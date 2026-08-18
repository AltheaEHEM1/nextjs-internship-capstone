import { useCallback } from "react";
import { createProjectAction } from "@/actions/project/Project";
import type { AccessRole } from "@/components/modals/project/CreateProject1Modal";
import { useToast } from "@/hooks/toast/use-toast";
import { useProjectStore } from "@/stores/project/project-store";

/**
 * Custom hook that wraps the project Zustand store,
 * providing convenience accessors and handlers for the
 * create-project modal flow used on the Projects page.
 */
export function useProject() {
	const { modalStep, form, setModalStep, setFormField, resetForm } =
		useProjectStore();
	const { toast } = useToast();

	const setProjectName = useCallback(
		(value: string) => setFormField("projectName", value),
		[setFormField],
	);

	const setDescription = useCallback(
		(value: string) => setFormField("description", value),
		[setFormField],
	);

	const setAccess = useCallback(
		(value: AccessRole) => setFormField("access", value),
		[setFormField],
	);

	const setTeam = useCallback(
		(value: string) => setFormField("team", value),
		[setFormField],
	);

	const setDueDate = useCallback(
		(value: string) => setFormField("dueDate", value),
		[setFormField],
	);

	const handleOpen = useCallback(() => setModalStep("step1"), [setModalStep]);

	const handleClose = useCallback(() => resetForm(), [resetForm]);

	const handleNext = useCallback(() => setModalStep("step2"), [setModalStep]);

	const handleBack = useCallback(() => setModalStep("step1"), [setModalStep]);

	const handleCreateFinal = useCallback(
		async (workflowData: {
			views: string[];
			statuses: {
				notStarted?: string[];
				active?: string[];
				done?: string[];
				closed?: string[];
			};
		}) => {
			const result = await createProjectAction({
				name: form.projectName,
				description: form.description,
				teamId: form.team,
				dueDate: form.dueDate,
				views: workflowData.views,
				statuses: workflowData.statuses,
			});

			if (!result.success) {
				toast({
					title: "Error",
					description: result.error || "Failed to create project.",
					variant: "destructive",
				});
				return;
			}

			toast({
				title: "Project created",
				description: "Project has been successfully created.",
				variant: "success",
			});
			resetForm();
		},
		[form, resetForm, toast],
	);

	return {
		modalStep,
		projectName: form.projectName,
		setProjectName,
		description: form.description,
		setDescription,
		access: form.access,
		setAccess,
		team: form.team,
		setTeam,
		dueDate: form.dueDate,
		setDueDate,
		handleOpen,
		handleClose,
		handleNext,
		handleBack,
		handleCreateFinal,
	};
}
