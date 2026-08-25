"use client";

import { use, useCallback } from "react";

import { pusherClient } from "@/lib/real-time-board/PusherClient";
import { useTimelineStore } from "@/stores/project/(tabs)/TimelineStore";

import "vis-timeline/styles/vis-timeline-graph2d.min.css";
import { useEffect, useRef } from "react";
import { useTimeline } from "@/hooks/project/(tabs)/useTimeline";

export default function Timeline({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const containerRef = useRef<HTMLDivElement>(null);
	const { items: timelineItems, options: storeOptions } = useTimeline();
	const setItems = useTimelineStore((state) => state.setItems);
	const fetchProjectData = useCallback(() => {
		fetch(`/api/project/${id}`)
			.then((r) => r.json())
			.then((res) => {
				if (res.success && res.data?.statuses && res.data.statuses.length > 0) {
					const allItems = res.data.statuses.flatMap(
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
									const end = t.dueDate ? new Date(t.dueDate) : undefined;
									return {
										id: t.id,
										content: t.title || "Untitled Task",
										start,
										end,
										className:
											s.name === "Done"
												? "bg-emerald-500 text-white"
												: s.name === "In Progress"
													? "bg-blue-500 text-white"
													: "bg-gray-500 text-white",
									};
								}),
					);

					setItems(allItems);
				}
			});
	}, [id, setItems]);

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

	useEffect(() => {
		if (!containerRef.current) return;

		let timeline: { destroy: () => void } | null = null;

		Promise.all([import("vis-timeline/peer"), import("vis-data")]).then(
			([{ Timeline: VisTimeline }, { DataSet }]) => {
				const container = containerRef.current;
				if (!container) return;

				const items = new DataSet(timelineItems);

				const mergedOptions = {
					orientation: "top" as const,
					stack: false,
					showMajorLabels: true,
					showCurrentTime: true,
					...storeOptions,
				};

				timeline = new VisTimeline(container, items, mergedOptions);
			},
		);

		return () => {
			timeline?.destroy();
		};
	}, [timelineItems, storeOptions]);

	return (
		<div className="space-y-4 pb-12">
			{/* Header Info */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<div>
					<h2 className="text-xl font-bold text-outer_space-800 dark:text-platinum-100">
						Project Roadmap Timeline
					</h2>
					<p className="text-sm text-outer_space-500 dark:text-platinum-400">
						Track sequential product phases, feature rollouts, and major project
						milestones over time.
					</p>
				</div>
			</div>

			{/* Timeline Container Box */}
			<div className="overflow-hidden rounded-2xl border border-french_gray-200 bg-white p-6 shadow-sm ring-1 ring-slate-900/5 transition-all hover:shadow-md dark:border-payne's_gray-600 dark:bg-outer_space-500 dark:text-platinum-100 dark:ring-white/10">
				<style jsx global>{`
                    .vis-timeline {
                        border: none !important;
                        font-family: inherit;
                    }
                    /* Remove hardcoded background so Tailwind status classes (e.g. bg-emerald-500) apply */
                    .vis-item {
                        border-color: rgba(255, 255, 255, 0.2);
                        color: #ffffff;
                        border-radius: 8px;
                        font-size: 0.75rem;
                        font-weight: 600;
                        box-shadow: 0 1px 3px rgba(0, 0, 0, 0.1);
                        transition: transform 0.2s ease, box-shadow 0.2s ease, filter 0.2s ease;
                        padding: 6px 10px;
                        border-width: 1px;
                    }
                    .vis-item:hover {
                        transform: translateY(-2px);
                        box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
                        filter: brightness(1.1);
                        z-index: 10 !important;
                    }
                    .vis-item-content {
                        padding: 0 !important; /* Rely on .vis-item padding */
                    }
                    /* Today Line Marker */
                    .vis-current-time {
                        background-color: #ef4444; /* red-500 */
                        width: 2px;
                        z-index: 1;
                    }
                    .vis-time-axis .vis-text {
                        color: #64748b;
                        font-weight: 600;
                        font-size: 0.75rem;
                        text-transform: uppercase;
                        letter-spacing: 0.05em;
                    }
                    .vis-grid.vis-minor {
                        border-color: #f1f5f9;
                    }
                    .vis-grid.vis-major {
                        border-color: #e2e8f0;
                        border-width: 2px;
                    }
                    .dark .vis-panel.vis-center,
                    .dark .vis-panel.vis-left,
                    .dark .vis-panel.vis-right {
                        background-color: #1e293b;
                        border-color: #334155;
                    }
                    .dark .vis-time-axis .vis-text {
                        color: #94a3b8;
                    }
                    .dark .vis-grid.vis-minor {
                        border-color: #334155;
                    }
                    .dark .vis-grid.vis-major {
                        border-color: #475569;
                    }
                `}</style>

				<div ref={containerRef} className="w-full" />
			</div>
		</div>
	);
}
