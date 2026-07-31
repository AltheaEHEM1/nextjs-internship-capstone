"use client";

import { Gantt, type Task, ViewMode } from "gantt-task-react";
import React, { useState } from "react";
import "gantt-task-react/dist/index.css";

export default function GanttChart() {
	const [viewMode, setViewMode] = useState<ViewMode>(ViewMode.Day);

	// Initial tasks matching your project management workflow
	const [tasks, setTasks] = useState<Task[]>([
		{
			start: new Date(2026, 7, 1),
			end: new Date(2026, 7, 10),
			name: "Design System Refactor",
			id: "Task 1",
			type: "task",
			progress: 65,
			isDisabled: false,
			styles: { progressColor: "#0ea5e9", progressSelectedColor: "#0284c7" },
		},
		{
			start: new Date(2026, 7, 5),
			end: new Date(2026, 7, 18),
			name: "Role-Based Access Control (RBAC)",
			id: "Task 2",
			type: "task",
			progress: 30,
			dependencies: ["Task 1"],
			isDisabled: false,
			styles: { progressColor: "#22c55e", progressSelectedColor: "#16a34a" },
		},
		{
			start: new Date(2026, 7, 15),
			end: new Date(2026, 7, 25),
			name: "Docker Deployment Setup",
			id: "Task 3",
			type: "task",
			progress: 10,
			dependencies: ["Task 2"],
			isDisabled: false,
			styles: { progressColor: "#a855f7", progressSelectedColor: "#9333ea" },
		},
	]);

	const handleTaskChange = (task: Task) => {
		setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
	};

	const handleTaskDelete = (task: Task) => {
		setTasks(tasks.filter((t) => t.id !== task.id));
	};

	const handleProgressChange = (task: Task) => {
		setTasks(tasks.map((t) => (t.id === task.id ? task : t)));
	};

	return (
		<div className="space-y-4 pb-12">
			{/* Header Info & View Mode Switcher */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
				<div>
					<h2 className="text-xl font-bold text-outer_space-800 dark:text-platinum-100">
						Project Gantt Chart & Timelines
					</h2>
					<p className="text-sm text-outer_space-500 dark:text-platinum-400">
						Visualize project schedules, track task dependencies, and adjust
						deadlines dynamically.
					</p>
				</div>

				{/* View Mode Buttons */}
				<div className="flex items-center gap-1.5 rounded-lg border border-french_gray-200 bg-white p-1 shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500">
					<button
						onClick={() => setViewMode(ViewMode.Day)}
						className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
							viewMode === ViewMode.Day
								? "bg-blue_munsell-500 text-white"
								: "text-outer_space-600 hover:bg-platinum-100 dark:text-platinum-300 dark:hover:bg-payne's_gray-400"
						}`}
					>
						Day
					</button>
					<button
						onClick={() => setViewMode(ViewMode.Week)}
						className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
							viewMode === ViewMode.Week
								? "bg-blue_munsell-500 text-white"
								: "text-outer_space-600 hover:bg-platinum-100 dark:text-platinum-300 dark:hover:bg-payne's_gray-400"
						}`}
					>
						Week
					</button>
					<button
						onClick={() => setViewMode(ViewMode.Month)}
						className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
							viewMode === ViewMode.Month
								? "bg-blue_munsell-500 text-white"
								: "text-outer_space-600 hover:bg-platinum-100 dark:text-platinum-300 dark:hover:bg-payne's_gray-400"
						}`}
					>
						Month
					</button>
				</div>
			</div>

			{/* Gantt Chart Container */}
			<div className="overflow-x-auto rounded-xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500 dark:text-platinum-100">
				<style jsx global>{`
          .gantt-container {
            font-family: inherit;
          }
          .dark ._313uQ {
            background-color: #1e293b !important;
            color: #f1f5f9 !important;
          }
          .dark ._3457N {
            fill: #f1f5f9 !important;
          }
        `}</style>

				<Gantt
					tasks={tasks}
					viewMode={viewMode}
					onDateChange={handleTaskChange}
					onDelete={handleTaskDelete}
					onProgressChange={handleProgressChange}
					listCellWidth="155px"
					columnWidth={
						viewMode === ViewMode.Month
							? 150
							: viewMode === ViewMode.Week
								? 250
								: 65
					}
				/>
			</div>
		</div>
	);
}
