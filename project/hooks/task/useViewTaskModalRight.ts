import { useState } from "react";

export interface UseViewTaskModalRightParams {
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
}

export function useViewTaskModalRight({
	taskData,
	onUpdateTask,
}: UseViewTaskModalRightParams) {
	const [status, setStatus] = useState(taskData.status);
	const [assignee, setAssignee] = useState(taskData.assignee);
	const [priority, setPriority] = useState(taskData.priority);
	const [dueDate, setDueDate] = useState(taskData.dueDate);
	const [label, setLabel] = useState(taskData.label);
	const [startDate, setStartDate] = useState(taskData.startDate);

	const handleFieldChange = (field: string, value: unknown) => {
		if (onUpdateTask) onUpdateTask({ [field]: value });
	};

	return {
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
		handleFieldChange,
	};
}
