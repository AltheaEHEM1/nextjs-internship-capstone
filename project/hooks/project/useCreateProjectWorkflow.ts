import { useCallback, useState } from "react";

/* ── Types ──────────────────────────────────────────────── */

export interface StatusGroup {
	notStarted: string[];
	active: string[];
	done: string[];
	closed: string[];
}

type SubView = "main" | "views" | "statuses";

/* ── Default data per workflow ────────────────────────────── */

const AVAILABLE_VIEWS = [
	"Dashboard",
	"List",
	"Board",
	"Whiteboard",
	"Gantt chart",
	"Timeline",
];

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
	const [activeSubView, setActiveSubView] = useState<SubView>("main");
	const [views] = useState<string[]>(AVAILABLE_VIEWS);
	const [statuses, setStatuses] = useState<StatusGroup>(DEFAULT_STATUSES);

	/** Collects all form data and returns the final payload. */
	const handleFinalCreate = useCallback(
		() => ({ views, statuses }),
		[views, statuses],
	);

	return {
		activeSubView,
		views,
		statuses,
		AVAILABLE_VIEWS,
		setStatuses,
		setActiveSubView,
		handleFinalCreate,
	};
}
