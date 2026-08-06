import { useCallback } from "react";
import type { AccessRole } from "@/components/modals/project/CreateProject1Modal";
import { useProjectStore } from "@/stores/project/project-store";

/**
 * Custom hook that wraps the project Zustand store,
 * providing convenience accessors and handlers for the
 * create-project modal flow used on the Projects page.
 */
export function useProject() {
	const { modalStep, form, setModalStep, setFormField, resetForm } =
		useProjectStore();

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

	const handleOpen = useCallback(() => setModalStep("step1"), [setModalStep]);

	const handleClose = useCallback(() => resetForm(), [resetForm]);

	const handleNext = useCallback(() => setModalStep("step2"), [setModalStep]);

	const handleBack = useCallback(() => setModalStep("step1"), [setModalStep]);

	const handleCreateFinal = useCallback(() => {
		// TODO: persist the new project (API call / DB write)
		console.log("Creating project:", form);
		resetForm();
	}, [form, resetForm]);

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
		handleOpen,
		handleClose,
		handleNext,
		handleBack,
		handleCreateFinal,
	};
}
