import {
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { useState } from "react";
import type { ColumnDef } from "@tanstack/react-table";

export type Task = {
	id: string;
	title: string;
	description: string;
	subtasksCount: string;
	status: "To Do" | "In Progress" | "Review" | "Done";
	detailsAssignee: string;
	priority: "Low" | "Medium" | "High" | "Urgent";
	parent: string;
	dueDate: string;
	startDate: string;
	reporter: string;
	dateOfCreation: string;
	updatedDate: string;
	storyPoint: number;
};

const data: Task[] = [
	{
		id: "TASK-101",
		title: "Design System Color Tokens Refactor",
		description: "Update core Tailwind tokens to match dark mode themes.",
		subtasksCount: "2/4",
		status: "In Progress",
		detailsAssignee: "Alex Mercer",
		priority: "High",
		parent: "Website Redesign",
		dueDate: "Aug 15, 2026",
		startDate: "Aug 01, 2026",
		reporter: "Yuan Exequiel",
		dateOfCreation: "Jul 30, 2026",
		updatedDate: "Aug 02, 2026",
		storyPoint: 5,
	},
	{
		id: "TASK-102",
		title: "Implement Role-Based Access Control (RBAC)",
		description: "Restrict page routes based on user credentials.",
		subtasksCount: "0/3",
		status: "To Do",
		detailsAssignee: "Yuan Exequiel",
		priority: "Urgent",
		parent: "Inventory System",
		dueDate: "Aug 18, 2026",
		startDate: "Aug 05, 2026",
		reporter: "Sarah Jenkins",
		dateOfCreation: "Aug 01, 2026",
		updatedDate: "Aug 01, 2026",
		storyPoint: 8,
	},
	{
		id: "TASK-103",
		title: "Setup Docker container for SRG website",
		description: "Configure multi-stage builds for deployment.",
		subtasksCount: "3/3",
		status: "Done",
		detailsAssignee: "Sarah Jenkins",
		priority: "Medium",
		parent: "SRG Site",
		dueDate: "Aug 02, 2026",
		startDate: "Jul 25, 2026",
		reporter: "Yuan Exequiel",
		dateOfCreation: "Jul 24, 2026",
		updatedDate: "Aug 02, 2026",
		storyPoint: 3,
	},
];

export function useTaskList(columns: ColumnDef<Task>[]) {
	const [sorting, setSorting] = useState<SortingState>([]);

	const table = useReactTable({
		data,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return { table };
}
