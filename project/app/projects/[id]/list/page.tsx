"use client";

import {
	type ColumnDef,
	type HeaderGroup,
	type Header,
	type Row,
	type Cell,
	flexRender,
	getCoreRowModel,
	getSortedRowModel,
	useReactTable,
	type SortingState,
} from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useState } from "react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface Task {
	id: string;
	title: string;
	status: "Todo" | "In Progress" | "In Review" | "Done";
	priority: "Low" | "Medium" | "High" | "Critical";
	assignee: string;
	dueDate: string;
	estimate: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const TASKS: Task[] = [
	{
		id: "TASK-001",
		title: "Design system tokens",
		status: "Done",
		priority: "High",
		assignee: "Alice",
		dueDate: "Aug 5",
		estimate: "3h",
	},
	{
		id: "TASK-002",
		title: "Build kanban board",
		status: "In Progress",
		priority: "Critical",
		assignee: "Bob",
		dueDate: "Aug 10",
		estimate: "8h",
	},
	{
		id: "TASK-003",
		title: "Implement auth flow",
		status: "In Review",
		priority: "High",
		assignee: "Carol",
		dueDate: "Aug 12",
		estimate: "5h",
	},
	{
		id: "TASK-004",
		title: "Write unit tests",
		status: "Todo",
		priority: "Medium",
		assignee: "Dave",
		dueDate: "Aug 20",
		estimate: "4h",
	},
	{
		id: "TASK-005",
		title: "API rate limiting",
		status: "Todo",
		priority: "Low",
		assignee: "Eve",
		dueDate: "Aug 25",
		estimate: "2h",
	},
];

const STATUS_COLORS: Record<Task["status"], string> = {
	Todo: "bg-gray-100 text-gray-600 dark:bg-gray-800 dark:text-gray-300",
	"In Progress": "bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300",
	"In Review": "bg-amber-100 text-amber-700 dark:bg-amber-900/40 dark:text-amber-300",
	Done: "bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300",
};

const PRIORITY_COLORS: Record<Task["priority"], string> = {
	Low: "bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-300",
	Medium: "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/40 dark:text-yellow-300",
	High: "bg-orange-100 text-orange-700 dark:bg-orange-900/40 dark:text-orange-300",
	Critical: "bg-red-100 text-red-700 dark:bg-red-900/40 dark:text-red-300",
};

// ─── Column Definitions ───────────────────────────────────────────────────────

const COLUMNS: ColumnDef<Task>[] = [
	{
		accessorKey: "id",
		header: "ID",
		cell: ({ getValue }) => (
			<span className="font-mono text-xs text-outer_space-400 dark:text-platinum-400">
				{getValue<string>()}
			</span>
		),
	},
	{
		accessorKey: "title",
		header: "Title",
		cell: ({ getValue }) => (
			<span className="font-medium text-outer_space-700 dark:text-platinum-200">
				{getValue<string>()}
			</span>
		),
	},
	{
		accessorKey: "status",
		header: "Status",
		cell: ({ getValue }) => {
			const status = getValue<Task["status"]>();
			return (
				<span
					className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${STATUS_COLORS[status]}`}
				>
					{status}
				</span>
			);
		},
	},
	{
		accessorKey: "priority",
		header: "Priority",
		cell: ({ getValue }) => {
			const priority = getValue<Task["priority"]>();
			return (
				<span
					className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${PRIORITY_COLORS[priority]}`}
				>
					{priority}
				</span>
			);
		},
	},
	{
		accessorKey: "assignee",
		header: "Assignee",
		cell: ({ getValue }) => (
			<span className="text-outer_space-600 dark:text-platinum-300">
				{getValue<string>()}
			</span>
		),
	},
	{
		accessorKey: "dueDate",
		header: "Due Date",
		cell: ({ getValue }) => (
			<span className="text-outer_space-500 dark:text-platinum-400">
				{getValue<string>()}
			</span>
		),
	},
	{
		accessorKey: "estimate",
		header: "Estimate",
		cell: ({ getValue }) => (
			<span className="font-mono text-xs text-outer_space-400 dark:text-platinum-400">
				{getValue<string>()}
			</span>
		),
	},
];

// ─── Page Component ───────────────────────────────────────────────────────────

export default function List() {
	const [sorting, setSorting] = useState<SortingState>([]);

	const table = useReactTable<Task>({
		data: TASKS,
		columns: COLUMNS,
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
						{table.getHeaderGroups().map((headerGroup: HeaderGroup<Task>) => (
							<tr key={headerGroup.id}>
								{headerGroup.headers.map((header: Header<Task, unknown>) => (
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
												{
													{
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
													) : null)
												}
											</div>
										)}
									</th>
								))}
							</tr>
						))}
					</thead>

					<tbody className="divide-y divide-french_gray-100 dark:divide-payne's_gray-600/60">
						{table.getRowModel().rows.map((row: Row<Task>) => (
							<tr
								key={row.id}
								className="transition-colors hover:bg-platinum-50/50 dark:hover:bg-outer_space-400/30"
							>
								{row.getVisibleCells().map((cell: Cell<Task, unknown>) => (
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
