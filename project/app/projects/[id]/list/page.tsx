"use client";

import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	type SortingState,
	useReactTable,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown, MoreHorizontal } from "lucide-react";
import React, { useState } from "react";

// 1. Updated Task Type matching all requested fields
type Task = {
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

// 2. Mock data for the table
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

const columnHelper = createColumnHelper<Task>();

// 3. Define columns configuration mapped to your fields
const columns = [
	columnHelper.accessor("title", {
		header: "Title & Description",
		cell: (info) => (
			<div>
				<div className="font-semibold text-outer_space-800 dark:text-platinum-100">
					{info.getValue()}
				</div>
				<div className="text-xs text-outer_space-400 dark:text-platinum-400 line-clamp-1">
					{info.row.original.description}
				</div>
				<div className="text-[10px] text-blue_munsell-600 dark:text-blue_munsell-400 mt-0.5">
					{info.row.original.id}
				</div>
			</div>
		),
	}),
	columnHelper.accessor("status", {
		header: "Status",
		cell: (info) => {
			const status = info.getValue();
			let badgeClass = "bg-amber-500/10 text-amber-600 border-amber-500/20";
			if (status === "Done")
				badgeClass =
					"bg-emerald-500/10 text-emerald-600 border-emerald-500/20 dark:text-emerald-400";
			if (status === "In Progress")
				badgeClass =
					"bg-blue_munsell-500/10 text-blue_munsell-600 border-blue_munsell-500/20 dark:text-blue_munsell-400";
			if (status === "Review")
				badgeClass =
					"bg-purple-500/10 text-purple-600 border-purple-500/20 dark:text-purple-400";

			return (
				<span
					className={`inline-flex items-center rounded-md px-2.5 py-1 text-[11px] font-medium border uppercase tracking-wider ${badgeClass}`}
				>
					{status}
				</span>
			);
		},
	}),
	columnHelper.accessor("priority", {
		header: "Priority",
		cell: (info) => {
			const priority = info.getValue();
			let colorClass = "text-outer_space-400 dark:text-platinum-400";
			if (priority === "Urgent")
				colorClass = "text-rose-600 dark:text-rose-400 font-semibold";
			if (priority === "High")
				colorClass = "text-amber-600 dark:text-amber-400 font-medium";
			if (priority === "Medium")
				colorClass = "text-blue_munsell-600 dark:text-blue_munsell-400";

			return <span className={`text-xs ${colorClass}`}>{priority}</span>;
		},
	}),
	columnHelper.accessor("subtasksCount", {
		header: "Subtasks",
		cell: (info) => (
			<span className="text-xs font-medium text-outer_space-600 dark:text-platinum-300">
				{info.getValue()}
			</span>
		),
	}),
	columnHelper.accessor("detailsAssignee", {
		header: "Assignee",
		cell: (info) => (
			<div className="flex items-center gap-2">
				<div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue_munsell-500 text-[10px] font-semibold text-white">
					{info.getValue().charAt(0)}
				</div>
				<span className="text-xs font-medium text-outer_space-700 dark:text-platinum-200">
					{info.getValue()}
				</span>
			</div>
		),
	}),
	columnHelper.accessor("reporter", {
		header: "Reporter",
		cell: (info) => (
			<span className="text-xs text-outer_space-500 dark:text-platinum-400">
				{info.getValue()}
			</span>
		),
	}),
	columnHelper.accessor("parent", {
		header: "Parent",
		cell: (info) => (
			<span className="rounded bg-platinum-200/60 px-1.5 py-0.5 text-xs text-outer_space-600 dark:bg-payne's_gray-500 dark:text-platinum-300">
				{info.getValue()}
			</span>
		),
	}),
	columnHelper.accessor("startDate", {
		header: "Start Date",
		cell: (info) => (
			<span className="text-xs text-outer_space-500 dark:text-platinum-400">
				{info.getValue()}
			</span>
		),
	}),
	columnHelper.accessor("dueDate", {
		header: "Due Date",
		cell: (info) => (
			<span className="text-xs text-outer_space-500 dark:text-platinum-400">
				{info.getValue()}
			</span>
		),
	}),
	columnHelper.accessor("storyPoint", {
		header: "Story Points",
		cell: (info) => (
			<span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-blue_munsell-50 text-xs font-bold text-blue_munsell-700 dark:bg-blue_munsell-950 dark:text-blue_munsell-300">
				{info.getValue()}
			</span>
		),
	}),
	columnHelper.accessor("dateOfCreation", {
		header: "Created",
		cell: (info) => (
			<span className="text-[11px] text-outer_space-400 dark:text-platinum-400">
				{info.getValue()}
			</span>
		),
	}),
	columnHelper.accessor("updatedDate", {
		header: "Updated",
		cell: (info) => (
			<span className="text-[11px] text-outer_space-400 dark:text-platinum-400">
				{info.getValue()}
			</span>
		),
	}),
	columnHelper.display({
		id: "actions",
		header: "",
		cell: () => (
			<div className="text-right">
				<button className="rounded-lg p-1.5 text-outer_space-400 hover:bg-french_gray-200 dark:text-platinum-400 dark:hover:bg-payne's_gray-400 transition-colors">
					<MoreHorizontal size={16} />
				</button>
			</div>
		),
	}),
];

export default function List() {
	const [sorting, setSorting] = useState<SortingState>([]);

	const table = useReactTable({
		data,
		columns,
		state: { sorting },
		onSortingChange: setSorting,
		getCoreRowModel: getCoreRowModel(),
		getSortedRowModel: getSortedRowModel(),
	});

	return (
		<div className="space-y-4 pb-12">
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h2 className="text-xl font-bold text-outer_space-800 dark:text-platinum-100">
						Project Task List
					</h2>
					<p className="text-sm text-outer_space-500 dark:text-platinum-400">
						Complete database item tracking view featuring all sprint fields and
						properties.
					</p>
				</div>
			</div>

			<div className="overflow-x-auto rounded-xl border border-french_gray-200 bg-white shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500">
				<table className="w-full text-left text-sm whitespace-nowrap">
					<thead className="border-b border-french_gray-200 bg-platinum-100/60 dark:border-payne's_gray-600 dark:bg-outer_space-400/50">
						{table.getHeaderGroups().map((headerGroup) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<th
										key={header.id}
										className="px-4 py-3.5 text-xs uppercase tracking-wider text-outer_space-500 dark:text-platinum-300"
									>
										{header.isPlaceholder ? null : (
											<div
												{...{
													className: header.column.getCanSort()
														? "cursor-pointer select-none flex items-center gap-1.5 hover:text-blue_munsell-600 transition-colors"
														: "",
													onClick: header.column.getToggleSortingHandler(),
												}}
											>
												{flexRender(
													header.column.columnDef.header,
													header.getContext(),
												)}
												{{
													asc: (
														<ArrowUp
															size={13}
															className="text-blue_munsell-500"
														/>
													),
													desc: (
														<ArrowDown
															size={13}
															className="text-blue_munsell-500"
														/>
													),
												}[header.column.getIsSorted() as string] ??
													(header.column.getCanSort() ? (
														<ArrowUpDown size={13} className="opacity-30" />
													) : null)}
											</div>
										)}
									</th>
								))}
							</tr>
						))}
					</thead>

					<tbody className="divide-y divide-french_gray-100 dark:divide-payne's_gray-600/60">
						{table.getRowModel().rows.map((row) => (
							<tr
								key={row.id}
								className="transition-colors hover:bg-platinum-50/50 dark:hover:bg-outer_space-400/30"
							>
								{row.getVisibleCells().map((cell) => (
									<td key={cell.id} className="px-4 py-3.5">
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</td>
								))}
							</tr>
						))}
					</tbody>
				</table>
			</div>
		</div>
	);
}
