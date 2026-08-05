"use client";

import { useCallback, useState } from "react";

export type WorkflowType = "starter" | "project_management";
type SubViewType = "main" | "views" | "statuses";

export function useCreateProjectWorkflow(initial: WorkflowType = "starter") {
	const [workflow, setWorkflow] = useState<WorkflowType>(initial);
	const [activeSubView, setActiveSubView] = useState<SubViewType>("main");

	const [views, setViews] = useState<string[]>(["List", "Board"]);

	const [statuses, setStatuses] = useState(() => ({
		notStarted: ["Not started", "To do"],
		active: ["Active", "In progress"],
		done: ["Done"],
		closed: ["Closed", "Complete"],
	}));

	const handleWorkflowChange = useCallback((type: WorkflowType) => {
		setWorkflow(type);
		if (type === "starter") {
			setViews(["List", "Board"]);
			setStatuses({
				notStarted: ["Not started", "To do"],
				active: ["Active", "In progress"],
				done: ["Done"],
				closed: ["Closed", "Complete"],
			});
		} else {
			setViews(["List", "Board", "Calendar", "Gantt", "Team"]);
			setStatuses({
				notStarted: ["Not started", "To do"],
				active: [
					"Active",
					"Planning",
					"In progress",
					"At risk",
					"Update Required",
					"On hold",
				],
				done: ["Done", "Complete"],
				closed: ["Closed", "Cancelled"],
			});
		}
	}, []);

	const handleFinalCreate = useCallback(
		() => ({ workflow, views, statuses }),
		[workflow, views, statuses],
	);

	return {
		workflow,
		setWorkflow,
		activeSubView,
		setActiveSubView,
		views,
		setViews,
		statuses,
		setStatuses,
		handleWorkflowChange,
		handleFinalCreate,
	} as const;
}
