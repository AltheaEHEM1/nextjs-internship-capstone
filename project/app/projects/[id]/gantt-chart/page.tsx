"use client";

import { Gantt } from "gantt-task-react";
import "gantt-task-react/dist/index.css";
import { ViewMode } from "gantt-task-react";
import { useMemo } from "react";
import { useGanttStore } from "@/stores/project/gantt-store";

export default function GanttChart() {
	const viewMode = useGanttStore((state) => state.viewMode);
	const setViewMode = useGanttStore((state) => state.setViewMode);
	const tasks = useGanttStore((state) => state.tasks);
	const handleTaskChange = useGanttStore((state) => state.handleTaskChange);
	const handleTaskDelete = useGanttStore((state) => state.handleTaskDelete);
	const handleProgressChange = useGanttStore(
		(state) => state.handleProgressChange,
	);

	const viewModeOptions = useMemo(
		() => [
			{ mode: ViewMode.Day, label: "Day" },
			{ mode: ViewMode.Week, label: "Week" },
			{ mode: ViewMode.Month, label: "Month" },
		],
		[],
	);

	const columnWidth = useMemo(() => {
		if (viewMode === ViewMode.Month) return 150;
		if (viewMode === ViewMode.Week) return 250;
		return 65;
	}, [viewMode]);

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
					{viewModeOptions.map((option) => (
						<button
							key={option.label}
							type="button"
							onClick={() => setViewMode(option.mode)}
							className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
								viewMode === option.mode
									? "bg-blue_munsell-500 text-white"
									: "text-outer_space-600 hover:bg-platinum-100 dark:text-platinum-300 dark:hover:bg-payne's_gray-400"
							}`}
						>
							{option.label}
						</button>
					))}
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
					columnWidth={columnWidth}
				/>
			</div>
		</div>
	);
}
