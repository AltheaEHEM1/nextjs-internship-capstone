import { useState } from "react";
import type { AccessRole } from "@/components/modals/project/CreateProject1Modal";
import type { WorkflowType } from "@/components/modals/project/CreateProject2Modal";

export function useProject() {
	const [modalStep, setModalStep] = useState<"closed" | "step1" | "step2">(
		"closed",
	);
	const [projectName, setProjectName] = useState("");
	const [description, setDescription] = useState("");
	const [access, setAccess] = useState<AccessRole>("administrator");
	const [team, setTeam] = useState("");

	const handleOpen = () => setModalStep("step1");
	const handleClose = () => setModalStep("closed");
	const handleNext = () => setModalStep("step2");
	const handleBack = () => setModalStep("step1");

	const handleCreateFinal = (workflowData: {
		workflow: WorkflowType;
		views: string[];
		statuses: any;
	}) => {
		const completeProjectData = {
			name: projectName,
			description,
			access,
			team,
			...workflowData,
		};

		console.log("Submitting Project Data:", completeProjectData);
		setModalStep("closed");
		setProjectName("");
		setDescription("");
		setAccess("administrator");
		setTeam("");
	};

	return {
		modalStep,
		projectName,
		setProjectName,
		description,
		setDescription,
		access,
		setAccess,
		team,
		setTeam,
		handleOpen,
		handleClose,
		handleNext,
		handleBack,
		handleCreateFinal,
	};
}
