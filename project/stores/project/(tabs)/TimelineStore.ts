import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface TimelineItem {
	id: number | string;
	content: string;
	start: string | Date;
	end?: string | Date;
	className?: string;
	type?: string;
	group?: number | string;
}

type TimelineOptions = {
	editable?: boolean;
	zoomMin?: number;
	zoomMax?: number;
	margin?: { item: number; axis: number };
};

const items: TimelineItem[] = [
	{
		id: 1,
		content: "Phase 1: Planning and Architecture",
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
		content: "RBAC and Core Features",
		start: "2026-08-10",
		end: "2026-08-20",
	},
	{
		id: 4,
		content: "Phase 2: QA and Testing",
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

const options: TimelineOptions = {
	editable: true,
	zoomMin: 1000 * 60 * 60 * 24 * 3,
	zoomMax: 1000 * 60 * 60 * 24 * 365 * 2,
	margin: { item: 10, axis: 20 },
};

export interface TimelineState {
	items: TimelineItem[];
	options: TimelineOptions;
}

export const useTimelineStore = create<TimelineState>()(
	devtools(() => ({
		items,
		options,
	})),
);
