/**
 * The master list of views shown in the CustomViewModal.
 * "List" is always required and cannot be toggled off.
 */
export const ALL_POSSIBLE_VIEWS: { name: string; required: boolean }[] = [
	{ name: "List", required: true },
	{ name: "Board", required: false },
	{ name: "Calendar", required: false },
	{ name: "Gantt", required: false },
	{ name: "Team", required: false },
	{ name: "Timeline", required: false },
	{ name: "Table", required: false },
];
