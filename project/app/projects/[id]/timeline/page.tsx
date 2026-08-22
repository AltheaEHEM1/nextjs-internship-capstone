"use client";

import { use, useCallback } from "react";
import { getProjectDetailAction } from "@/actions/project/Project";
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
		getProjectDetailAction(id).then((res) => {
			if (res.success && res.data?.statuses && res.data.statuses.length > 0) {
				const allItems = res.data.statuses.flatMap((s) =>
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
			<div className="overflow-hidden rounded-xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500 dark:text-platinum-100">
				<style jsx global>{`
                    .vis-timeline {
                        border: none !important;
                        font-family: inherit;
                    }
                    .vis-item {
                        background-color: #0ea5e9;
                        border-color: #0284c7;
                        color: #ffffff;
                        border-radius: 6px;
                        font-size: 0.75rem;
                        font-weight: 500;
                    }
                    .vis-time-axis .vis-text {
                        color: inherit;
                    }
                    .dark .vis-panel.vis-center,
                    .dark .vis-panel.vis-left,
                    .dark .vis-panel.vis-right {
                        background-color: #1e293b;
                        border-color: #334155;
                    }
                    .dark .vis-time-axis .vis-text {
                        color: #f1f5f9;
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
