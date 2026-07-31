"new";
"use client";

import React, { useEffect, useRef } from "react";
import { Timeline as VisTimeline } from "vis-timeline/standalone";
import "vis-timeline/styles/vis-timeline-graph2d.min.css";

export default function Timeline() {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		// 1. Define timeline items (Milestones & Roadmap Phases)
		const items = [
			{
				id: 1,
				content: "Phase 1: Planning & Architecture",
				start: "2026-08-01",
				end: "2026-08-05",
				className: "bg-blue_munsell-500 text-white",
			},
			{
				id: 2,
				content: "Design System Refactor",
				start: "2026-08-04",
				end: "2026-08-15",
			},
			{
				id: 3,
				content: "RBAC & Core Features",
				start: "2026-08-10",
				end: "2026-08-20",
			},
			{
				id: 4,
				content: "Phase 2: QA & Testing",
				start: "2026-08-21",
				end: "2026-08-26",
				className: "bg-amber-500 text-white",
			},
			{
				id: 5,
				content: "Official Release Milestone",
				start: "2026-08-28",
				type: "point",
			},
		];

		// 2. Configuration options
		const options = {
			editable: true,
			zoomMin: 1000 * 60 * 60 * 24 * 3, // 3 days
			zoomMax: 1000 * 60 * 60 * 24 * 365 * 2, // 2 years
			margin: {
				item: 10,
				axis: 20,
			},
		};

		// 3. Initialize timeline
		const timeline = new VisTimeline(containerRef.current, items, options);

		return () => {
			timeline.destroy();
		};
	}, []);

	return (
		<div className="space-y-4 pb-12">
			{/* Header Info */}
			<div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
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
