"use client";

import { useSortableItem } from "../../hooks/components/useSortableItem";

export interface Task {
	id: string;
	workType: string;
	title: string;
	description: string;
	status: string;
	assignee: string;
	priority: "low" | "medium" | "high";
	dueDate: string;
	label: string;
	startDate: string;
	reporter: string;
}

interface TaskCardProps {
	taskData: Task;
	onClick: () => void;
	isOverlay?: boolean;
}

export function TaskCard({ taskData, onClick, isOverlay }: TaskCardProps) {
	const { setNodeRef, attributes, listeners, isDragging, style } =
		useSortableItem({
			id: taskData.id,
			data: {
				type: "Task",
				task: taskData,
			},
		});

	if (isDragging) {
		return (
			<div
				ref={setNodeRef}
				style={style}
				className="h-24 rounded-lg border border-dashed border-blue_munsell-400 bg-white p-4 opacity-40 dark:bg-outer_space-400"
			/>
		);
	}

	return (
		<div
			ref={setNodeRef}
			style={style}
			{...attributes}
			{...listeners}
			onClick={onClick}
			className={`group cursor-pointer rounded-lg border border-french_gray-200 bg-white p-4 shadow-xs transition-all hover:border-blue_munsell-400 hover:shadow-md dark:border-payne's_gray-600 dark:bg-outer_space-400 dark:hover:border-blue_munsell-500 ${
				isOverlay ? "rotate-2 shadow-xl ring-2 ring-blue_munsell-400" : ""
			}`}
		>
			<h4 className="mb-1 text-sm font-semibold text-outer_space-700 dark:text-platinum-200">
				{taskData.title}
			</h4>
			<p className="mb-3 line-clamp-2 text-xs text-outer_space-400 dark:text-platinum-400">
				{taskData.description}
			</p>
			<div className="flex items-center justify-between pt-2">
				<span className="rounded-md bg-blue_munsell-50 px-2 py-0.5 text-xs font-medium text-blue_munsell-700 capitalize dark:bg-blue_munsell-950 dark:text-blue_munsell-300">
					{taskData.priority}
				</span>
				<div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue_munsell-500 text-xs font-semibold text-white shadow-xs">
					{taskData.assignee}
				</div>
			</div>
		</div>
	);
}
