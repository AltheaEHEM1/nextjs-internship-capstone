import { useCallback, useState } from "react";

/* ── Types ──────────────────────────────────────────────── */

export interface StatusGroup {
	notStarted: string[];
	active: string[];
	done: string[];
	closed: string[];
}

type SubView = "main" | "views" | "statuses";
type Workflow = "starter" | "project_management";

/* ── Default data per workflow ────────────────────────────── */

const STARTER_VIEWS = ["List", "Board"];
const PM_VIEWS = ["List", "Board", "Calendar", "Gantt", "Team"];

const DEFAULT_STATUSES: StatusGroup = {
	notStarted: ["To Do"],
	active: ["In Progress"],
	done: ["Done"],
	closed: ["Closed"],
};

/* ── Hook ─────────────────────────────────────────────────── */

/**
 * Manages the local UI state for the CreateProject step-2 modal
 * (workflow selection, default views, and task statuses).
 */
export function useCreateProjectWorkflow() {
	const [workflow, setWorkflow] = useState<Workflow>("starter");
	const [activeSubView, setActiveSubView] = useState<SubView>("main");
	const [views, setViews] = useState<string[]>(STARTER_VIEWS);
	const [statuses, setStatuses] = useState<StatusGroup>(DEFAULT_STATUSES);

	const handleWorkflowChange = useCallback((w: Workflow) => {
		setWorkflow(w);
		setViews(w === "starter" ? STARTER_VIEWS : PM_VIEWS);
	}, []);

	/** Collects all form data and returns the final payload. */
	const handleFinalCreate = useCallback(
		() => ({ workflow, views, statuses }),
		[workflow, views, statuses],
	);

	return {
		workflow,
		activeSubView,
		views,
		statuses,
		setViews,
		setStatuses,
		handleWorkflowChange,
		setActiveSubView,
		handleFinalCreate,
	};
}
