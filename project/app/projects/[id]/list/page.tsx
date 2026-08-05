"use client";

import { flexRender } from "@tanstack/react-table";
import { ArrowDown, ArrowUp, ArrowUpDown } from "lucide-react";
import { useTaskList } from "@/hooks/project/useTaskList";
import { useTaskListColumns } from "@/hooks/project/useTaskListColumns";

export default function List() {
	const columns = useTaskListColumns();
	const { table } = useTaskList(columns);

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
