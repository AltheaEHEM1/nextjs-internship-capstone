"use client";

import { useSortableItem } from "../../hooks/components/useSortableItem";

export interface Task {
	id: string;
	workType: string;
	title: string;
	description: string;
	status: string;
	assignee: string; // This will hold the ID
	assigneeName?: string;
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

export function TaskCardDisplay({
	taskData,
	onClick,
	isOverlay,
	setNodeRef,
	style,
	attributes,
	listeners,
}: TaskCardProps & {
	setNodeRef?: (node: HTMLElement | null) => void;
	style?: React.CSSProperties;
	attributes?: Record<string, unknown>;
	listeners?: Record<string, unknown>;
}) {
	return (
		<button
			type="button"
			ref={setNodeRef as React.LegacyRef<HTMLButtonElement>}
			style={style}
			{...attributes}
			{...listeners}
			onClick={onClick}
			className={`group w-full flex flex-col text-left cursor-pointer rounded-lg border border-french_gray-200 bg-white p-4 shadow-xs transition-all hover:border-blue_munsell-400 hover:shadow-md dark:border-payne's_gray-600 dark:bg-outer_space-400 dark:hover:border-blue_munsell-500 ${
				isOverlay ? "rotate-2 shadow-xl ring-2 ring-blue_munsell-400" : ""
			}`}
		>
			<h4 className="mb-1 w-full text-sm font-semibold text-outer_space-700 dark:text-platinum-200 truncate">
				{taskData.title}
			</h4>
			<p className="mb-3 w-full line-clamp-2 text-xs text-outer_space-400 dark:text-platinum-400">
				{taskData.description}
			</p>
			<div className="flex w-full items-center justify-between pt-2 mt-auto">
				<span className="rounded-md bg-blue_munsell-50 px-2 py-0.5 text-xs font-medium text-blue_munsell-700 capitalize dark:bg-blue_munsell-950 dark:text-blue_munsell-300">
					{taskData.priority}
				</span>
				<div className="flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-blue_munsell-500 text-xs font-semibold text-white shadow-xs">
					{taskData.assigneeName?.substring(0, 2).toUpperCase() || "?"}
				</div>
			</div>
		</button>
	);
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
		<TaskCardDisplay
			taskData={taskData}
			onClick={onClick}
			isOverlay={isOverlay}
			setNodeRef={setNodeRef}
			style={style}
			attributes={attributes as unknown as Record<string, unknown>}
			listeners={listeners as unknown as Record<string, unknown>}
		/>
	);
}
