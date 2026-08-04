"use client";

import { MoreHorizontal } from "lucide-react";
import { useState } from "react";
import ViewTaskModal from "@/components/modals/task/view-task-modal/ViewTaskModal";

interface Task {
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

export default function BoardPage() {
	const kanbanColumns = ["To Do", "In Progress", "Review", "Done"];

	// State to handle modal visibility and selected task data
	const [isViewTaskOpen, setIsViewTaskOpen] = useState(false);
	const [selectedTask, setSelectedTask] = useState<Task | null>(null);

	// Mock data for demonstration purposes
	const [tasks, setTasks] = useState<Task[]>([
		{
			workType: "Feature",
			title: "Design System Update #1",
			description:
				"Refactor color tokens and component documentation for the layout migration.",
			status: "To Do",
			assignee: "U",
			priority: "medium",
			dueDate: "2026-06-15",
			label: "Frontend",
			startDate: "2026-06-01",
			reporter: "Admin",
		},
		// Add more mock tasks here if needed
	]);

	const handleOpenTask = (task: Task) => {
		setSelectedTask(task);
		setIsViewTaskOpen(true);
	};

	const handleUpdateTask = (updatedFields: Record<string, any>) => {
		if (!selectedTask) return;

		// Update local task list logic here
		setTasks((prev) =>
			prev.map((t) =>
				t.title === selectedTask.title ? { ...t, ...updatedFields } : t,
			),
		);

		// Optionally update selected task in-place to keep modal synced
		setSelectedTask((prev) => (prev ? { ...prev, ...updatedFields } : null));
	};

	return (
		<div className="flex gap-6 overflow-x-auto py-6">
			{kanbanColumns.map((columnTitle) => (
				<div key={columnTitle} className="w-72 flex-shrink-0 sm:w-80">
					<div className="rounded-xl border border-french_gray-200 bg-platinum-100 dark:border-payne's_gray-600 dark:bg-outer_space-500">
						{/* Column Header */}
						<div className="border-b border-french_gray-200 p-4 dark:border-payne's_gray-600">
							<div className="flex items-center justify-between">
								<h3 className="flex items-center font-semibold text-outer_space-700 dark:text-platinum-200">
									{columnTitle}
									<span className="ml-2 rounded-full bg-french_gray-200 px-2.5 py-0.5 text-xs text-outer_space-600 dark:bg-payne's_gray-500 dark:text-platinum-300">
										{tasks.filter((t) => t.status === columnTitle).length || 3}
									</span>
								</h3>
								<button
									type="button"
									className="rounded-lg p-1 text-outer_space-400 hover:bg-french_gray-200 dark:text-platinum-400 dark:hover:bg-payne's_gray-400"
								>
									<MoreHorizontal size={16} />
								</button>
							</div>
						</div>

						{/* Task Cards Container */}
						<div className="min-h-[350px] space-y-3 p-4">
							{tasks.map((taskData, taskIndex) => (
								<div
									key={taskIndex}
									onClick={() => handleOpenTask(taskData)}
									className="group cursor-pointer rounded-lg border border-french_gray-200 bg-white p-4 shadow-xs transition-all hover:border-blue_munsell-400 hover:shadow-md dark:border-payne's_gray-600 dark:bg-outer_space-400 dark:hover:border-blue_munsell-500"
								>
									<h4 className="mb-1 text-sm font-semibold text-outer_space-700 dark:text-platinum-200">
										{taskData.title}
									</h4>
									<p className="mb-3 line-clamp-2 text-xs text-outer_space-400 dark:text-platinum-400">
										{taskData.description}
									</p>
									<div className="flex items-center justify-between pt-2">
										<span className="rounded-md bg-blue_munsell-50 px-2 py-0.5 text-xs font-medium text-blue_munsell-700 dark:bg-blue_munsell-950 dark:text-blue_munsell-300 capitalize">
											{taskData.priority}
										</span>
										<div className="flex h-6 w-6 items-center justify-center rounded-full bg-blue_munsell-500 text-xs font-semibold text-white shadow-xs">
											{taskData.assignee}
										</div>
									</div>
								</div>
							))}

							{/* Add Task Button */}
							<button
								type="button"
								className="w-full rounded-lg border-2 border-dashed border-french_gray-300 py-2.5 text-sm font-medium text-outer_space-500 transition-colors hover:border-blue_munsell-500 hover:bg-blue_munsell-50/50 hover:text-blue_munsell-600 dark:border-payne's_gray-500 dark:text-platinum-400 dark:hover:bg-blue_munsell-950/20 dark:hover:text-blue_munsell-400"
							>
								+ Add task
							</button>
						</div>
					</div>
				</div>
			))}

			{/* Render Modal Component */}
			{selectedTask && (
				<ViewTaskModal
					opened={isViewTaskOpen}
					onClose={() => setIsViewTaskOpen(false)}
					taskData={selectedTask}
					onUpdateTask={handleUpdateTask}
				/>
			)}
		</div>
	);
}
