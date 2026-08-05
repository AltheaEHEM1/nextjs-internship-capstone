import { useEffect, useRef } from "react";
import { Timeline as VisTimeline } from "vis-timeline/standalone";

export type TimelineItem = {
	id: number;
	content: string;
	start: string;
	end?: string;
	type?: string;
	className?: string;
};

const timelineItems: TimelineItem[] = [
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

const timelineOptions = {
	editable: true,
	zoomMin: 1000 * 60 * 60 * 24 * 3,
	zoomMax: 1000 * 60 * 60 * 24 * 365 * 2,
	margin: {
		item: 10,
		axis: 20,
	},
};

export function useTimeline() {
	const containerRef = useRef<HTMLDivElement>(null);

	useEffect(() => {
		if (!containerRef.current) return;

		const timeline = new VisTimeline(
			containerRef.current,
			timelineItems,
			timelineOptions,
		);

		return () => {
			timeline.destroy();
		};
	}, []);

	return { containerRef };
}
