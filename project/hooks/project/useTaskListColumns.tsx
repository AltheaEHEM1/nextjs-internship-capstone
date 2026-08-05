import {
	createColumnHelper,
	type ColumnDef,
} from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";
import { useMemo } from "react";
import type { Task } from "@/hooks/project/useTaskList";

const columnHelper = createColumnHelper<Task>();

export function useTaskListColumns() {
	return useMemo(
		() =>
			[
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
						let badgeClass =
							"bg-amber-500/10 text-amber-600 border-amber-500/20";
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
							colorClass =
								"text-blue_munsell-600 dark:text-blue_munsell-400";

						return (
							<span className={`text-xs ${colorClass}`}>{priority}</span>
						);
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
							<button
								type="button"
								className="rounded-lg p-1.5 text-outer_space-400 hover:bg-french_gray-200 dark:text-platinum-400 dark:hover:bg-payne's_gray-400 transition-colors"
							>
								<MoreHorizontal size={16} />
							</button>
						</div>
					),
				}),
			] as ColumnDef<Task>[],
		[],
	);
}
