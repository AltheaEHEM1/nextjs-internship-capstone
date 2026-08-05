import { useState } from "react";
import type {
	ProjectLabel,
	ProjectPriority,
	ProjectStatus,
} from "@/app/projects/project-settings/page";

export function useProjectSettingsLabelPriorityStatusState(
	initialLabels: ProjectLabel[],
	initialPriorities: ProjectPriority[],
	initialStatuses: ProjectStatus[],
) {
	const [labels, setLabels] = useState<ProjectLabel[]>(initialLabels);
	const [priorities, setPriorities] =
		useState<ProjectPriority[]>(initialPriorities);
	const [statuses, setStatuses] = useState<ProjectStatus[]>(initialStatuses);

	const [isLabelModalOpen, setIsLabelModalOpen] = useState(false);
	const [isPriorityModalOpen, setIsPriorityModalOpen] = useState(false);
	const [isStatusModalOpen, setIsStatusModalOpen] = useState(false);

	const handleAddLabel = (newLabel: ProjectLabel) => {
		setLabels((current) => [...current, newLabel]);
	};

	const handleDeleteLabel = (index: number) => {
		setLabels((current) => current.filter((_, i) => i !== index));
	};

	const handleAddPriority = (newPriority: ProjectPriority) => {
		setPriorities((current) => [...current, newPriority]);
	};

	const handleDeletePriority = (index: number) => {
		setPriorities((current) => current.filter((_, i) => i !== index));
	};

	const handleAddStatus = (newStatus: ProjectStatus) => {
		setStatuses((current) => [...current, newStatus]);
	};

	const handleDeleteStatus = (index: number) => {
		setStatuses((current) => current.filter((_, i) => i !== index));
	};

	return {
		labels,
		priorities,
		statuses,
		isLabelModalOpen,
		isPriorityModalOpen,
		isStatusModalOpen,
		setIsLabelModalOpen,
		setIsPriorityModalOpen,
		setIsStatusModalOpen,
		handleAddLabel,
		handleDeleteLabel,
		handleAddPriority,
		handleDeletePriority,
		handleAddStatus,
		handleDeleteStatus,
	};
}
