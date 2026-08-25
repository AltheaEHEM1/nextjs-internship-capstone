"use client";

import { Gantt } from "gantt-task-react";
import { use, useCallback, useEffect, useRef } from "react";

import { pusherClient } from "@/lib/real-time-board/PusherClient";
import "gantt-task-react/dist/index.css";
import { useGanttChart } from "@/hooks/project/(tabs)/useGanttChart";

const CustomTooltip = ({
	task,
	fontSize,
	fontFamily,
}: {
	task: import("gantt-task-react").Task;
	fontSize: string;
	fontFamily: string;
}) => {
	return (
		<div
			className="pointer-events-none z-50 flex min-w-[220px] flex-col gap-2 rounded-xl bg-white p-4 shadow-xl ring-1 ring-slate-900/5 dark:bg-slate-800 dark:ring-white/10"
			style={{ fontSize, fontFamily }}
		>
			<h4 className="font-semibold text-slate-800 dark:text-platinum-100">
				{task.name}
			</h4>
			<div className="flex flex-col gap-1 text-xs text-slate-600 dark:text-slate-300">
				<div className="flex justify-between">
					<span className="font-medium text-slate-500">Start:</span>
					<span>{task.start.toLocaleDateString()}</span>
				</div>
				<div className="flex justify-between">
					<span className="font-medium text-slate-500">End:</span>
					<span>{task.end.toLocaleDateString()}</span>
				</div>
			</div>
			<div className="mt-2 flex items-center gap-3 border-t border-slate-100 pt-3 dark:border-slate-700">
				<div className="h-2 flex-1 overflow-hidden rounded-full bg-slate-100 dark:bg-slate-700">
					<div
						className="h-full rounded-full bg-blue_munsell-500 transition-all duration-300"
						style={{ width: `${task.progress}%` }}
					/>
				</div>
				<span className="text-xs font-bold text-slate-700 dark:text-slate-200">
					{task.progress}%
				</span>
			</div>
		</div>
	);
};

export default function GanttChart({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const {
		tasks,
		setTasks,
		viewMode,
		columnWidth,
		viewModeOptions,
		setViewMode,
		handleTaskChange,
		handleTaskDelete,
		handleProgressChange,
	} = useGanttChart();

	const containerRef = useRef<HTMLDivElement>(null);

	const fetchProjectData = useCallback(() => {
		fetch(`/api/project/${id}`)
			.then((r) => r.json())
			.then((res) => {
				if (res.success && res.data?.statuses && res.data.statuses.length > 0) {
					// Define the color palette from the image
					const colors = [
						{ bg: "#e9c46a", progress: "#f4a261" }, // Yellow/Orange
						{ bg: "#a7c957", progress: "#6a994e" }, // Green
						{ bg: "#f4a261", progress: "#e76f51" }, // Orange
						{ bg: "#48cae4", progress: "#00b4d8" }, // Light Blue
						{ bg: "#ff8fab", progress: "#fb6f92" }, // Pink
					];

					let taskIndex = 0;

					const allTasks = res.data.statuses.flatMap(
						(s: {
							name: string;
							tasks?: {
								id: string;
								title?: string;
								dueDate?: string | null;
								createdAt: string;
							}[];
						}) =>
							(s.tasks || [])
								.filter((t) => t.dueDate || t.createdAt) // Ensure there's a date
								.map((t) => {
									const start = t.createdAt
										? new Date(t.createdAt)
										: new Date(t.dueDate || "");
									const end = t.dueDate ? new Date(t.dueDate) : start;

									const color = colors[taskIndex % colors.length];
									taskIndex++;

									return {
										id: t.id,
										name: t.title || "Untitled Task",
										type: "task",
										start,
										end,
										progress:
											s.name === "Done"
												? 100
												: s.name === "In Progress"
													? 50
													: 0,
										isDisabled: false,
										styles: {
											progressColor: color.progress,
											progressSelectedColor: color.progress,
											backgroundColor: color.bg,
											backgroundSelectedColor: color.bg,
										},
									} as unknown as import("gantt-task-react").Task;
								}),
					);

					setTasks(allTasks.length > 0 ? allTasks : []);
				}
			});
	}, [id, setTasks]);

	useEffect(() => {
		fetchProjectData();
	}, [fetchProjectData]);

	useEffect(() => {
		if (!id || !pusherClient) return;
		const channelName = `project-${id}`;
		const channel = pusherClient.subscribe(channelName);

		channel.bind("task-updated", () => {
			fetchProjectData();
		});

		return () => {
			pusherClient?.unsubscribe(channelName);
		};
	}, [id, fetchProjectData]);

	const handleZoomIn = () => {
		const currentIndex = viewModeOptions.findIndex((o) => o.mode === viewMode);
		if (currentIndex > 0) {
			setViewMode(viewModeOptions[currentIndex - 1].mode);
		}
	};

	const handleZoomOut = () => {
		const currentIndex = viewModeOptions.findIndex((o) => o.mode === viewMode);
		if (currentIndex < viewModeOptions.length - 1) {
			setViewMode(viewModeOptions[currentIndex + 1].mode);
		}
	};

	useEffect(() => {
		const container = containerRef.current;
		if (!container) return;

		let lastZoomTime = 0;

		const handleWheel = (e: WheelEvent) => {
			// Zoom on any vertical scroll over the chart
			e.preventDefault();

			const now = Date.now();
			// Throttle zoom events so one scroll tick doesn't zoom all the way
			if (now - lastZoomTime < 300) return;

			const currentIndex = viewModeOptions.findIndex(
				(o) => o.mode === viewMode,
			);

			if (e.deltaY < 0 && currentIndex > 0) {
				lastZoomTime = now;
				setViewMode(viewModeOptions[currentIndex - 1].mode);
			} else if (e.deltaY > 0 && currentIndex < viewModeOptions.length - 1) {
				lastZoomTime = now;
				setViewMode(viewModeOptions[currentIndex + 1].mode);
			}
		};

		// Use capture: true to catch the event before inner components can stop its propagation
		container.addEventListener("wheel", handleWheel, {
			passive: false,
			capture: true,
		});
		return () =>
			container.removeEventListener("wheel", handleWheel, {
				capture: true,
			} as any);
	}, [viewMode, viewModeOptions, setViewMode]);

	return (
		<div className="space-y-4 pb-12">
			{/* Header Info & View Mode Switcher */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
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
				<div className="flex items-center gap-1.5 rounded-lg border border-slate-200 bg-white p-1 shadow-xs dark:border-slate-700 dark:bg-slate-800">
					<button
						type="button"
						onClick={handleZoomIn}
						disabled={
							viewModeOptions.findIndex((o) => o.mode === viewMode) === 0
						}
						className="rounded-md px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-700"
					>
						Zoom In
					</button>

					<div className="mx-1 h-4 w-[1px] bg-slate-200 dark:bg-slate-700"></div>

					{viewModeOptions.map((option) => (
						<button
							key={option.label}
							type="button"
							onClick={() => setViewMode(option.mode)}
							className={`rounded-md px-3 py-1.5 text-xs font-semibold transition-all duration-200 ${
								viewMode === option.mode
									? "bg-blue_munsell-500 text-white shadow-sm ring-1 ring-blue_munsell-600/50"
									: "text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-300 dark:hover:bg-slate-700 dark:hover:text-white"
							}`}
						>
							{option.label}
						</button>
					))}

					<div className="mx-1 h-4 w-[1px] bg-slate-200 dark:bg-slate-700"></div>

					<button
						type="button"
						onClick={handleZoomOut}
						disabled={
							viewModeOptions.findIndex((o) => o.mode === viewMode) ===
							viewModeOptions.length - 1
						}
						className="rounded-md px-3 py-1.5 text-xs font-semibold text-slate-600 transition-all duration-200 hover:bg-slate-100 disabled:opacity-50 dark:text-slate-300 dark:hover:bg-slate-700"
					>
						Zoom Out
					</button>
				</div>
			</div>

			{/* Gantt Chart Container */}
			<div
				ref={containerRef}
				className="overflow-x-auto rounded-2xl border border-slate-200 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md dark:border-slate-700 dark:bg-[#16293e] dark:text-platinum-100 dark:ring-white/10"
			>
				<style jsx global>{`
                    .gantt-container {
                        font-family: inherit !important;
                        border-radius: 12px;
                        overflow: hidden;
                        border: 1px solid #e2e8f0;
                    }
                    .dark .gantt-container {
                        border-color: #23395d;
                    }
                    /* Gantt SVG styling overrides for a softer look */
                    .gantt-container svg {
                        border-radius: 8px;
                        background-color: #16293e !important;
                    }
                    .dark .gantt-container svg {
                        background-color: #ffffff !important;
                    }
                    ._313uQ, .gantt-list-table { /* Header or rows */
                        background-color: #ffffff !important;
                        color: #16293e !important;
                    }
                    .dark ._313uQ, .dark .gantt-list-table {
                        background-color: #16293e !important;
                        color: #f1f5f9 !important;
                    }
                    .gantt-list-table-header {
                        background-color: #ffffff !important;
                        border-bottom: 1px solid #e2e8f0 !important;
                    }
                    .dark .gantt-list-table-header {
                        background-color: #16293e !important;
                        border-bottom: 1px solid #2a4365 !important;
                    }
                    ._3457N {
                        fill: #f1f5f9 !important;
                    }
                    .dark ._3457N {
                        fill: #16293e !important;
                    }
                    /* Grid lines */
                    .gantt-grid-line {
                        stroke: #2a4365 !important;
                    }
                    .dark .gantt-grid-line {
                        stroke: #e2e8f0 !important;
                    }
                    /* Smooth hover effect on task rows in the list */
                    .gantt-list-table-row:hover {
                        background-color: #f8fafc !important;
                        transition: background-color 0.2s ease;
                    }
                    .dark .gantt-list-table-row:hover {
                        background-color: #1e3a5f !important;
                        transition: background-color 0.2s ease;
                    }
                    /* Task bar improvements */
                    .gantt-task-bar {
                        transition: filter 0.2s ease;
                        filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1));
                    }
                    .gantt-task-bar:hover {
                        filter: drop-shadow(0 4px 6px rgba(0,0,0,0.2));
                        cursor: pointer;
                    }
                    /* Task label styles */
                    .gantt-task-bar-label {
                        fill: #f1f5f9 !important;
                        font-weight: 500;
                    }
                    .dark .gantt-task-bar-label {
                        fill: #16293e !important;
                    }
                `}</style>

				{tasks.length > 0 ? (
					<Gantt
						tasks={tasks}
						viewMode={viewMode}
						onDateChange={handleTaskChange}
						onDelete={handleTaskDelete}
						onProgressChange={handleProgressChange}
						listCellWidth="155px"
						columnWidth={columnWidth}
						TooltipContent={CustomTooltip}
						barCornerRadius={8}
						barFill={70}
						rowHeight={48}
						arrowColor="#94a3b8"
					/>
				) : (
					<div className="py-12 text-center text-sm text-outer_space-500 dark:text-platinum-400">
						No tasks scheduled in this timeline.
					</div>
				)}
			</div>
		</div>
	);
}
