"use client";

import { useCallback } from "react";

export const ALL_POSSIBLE_VIEWS = [
	{ name: "List", required: true },
	{ name: "Board", required: false },
	{ name: "Calendar", required: false },
	{ name: "Map", required: false },
	{ name: "Activity", required: false },
	{ name: "Team", required: false },
	{ name: "Gantt", required: false },
	{ name: "Mind Map", required: false },
	{ name: "Table", required: false },
	{ name: "Timeline", required: false },
	{ name: "Workload", required: false },
];

export function useCustomView(
	selectedViews: string[],
	onChangeViews: (views: string[]) => void,
) {
	const toggleView = useCallback(
		(viewName: string) => {
			if (viewName === "List") return;
			if (selectedViews.includes(viewName)) {
				onChangeViews(selectedViews.filter((v) => v !== viewName));
			} else {
				onChangeViews([...selectedViews, viewName]);
			}
		},
		[selectedViews, onChangeViews],
	);

	return { ALL_POSSIBLE_VIEWS, toggleView } as const;
}
