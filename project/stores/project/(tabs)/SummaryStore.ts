import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
	RecentActivity,
	StatusOverviewItem,
	TeamWorkloadMember,
	WorkTypeItem,
} from "@/hooks/project/(tabs)/useSummary";

const recentActivities: RecentActivity[] = [
	{
		id: 1,
		time: "10 mins ago",
		author: "Alex Mercer",
		title: "Refactored global layout component structure",
	},
	{
		id: 2,
		time: "45 mins ago",
		author: "Sarah Jenkins",
		title: "Updated database schema for user roles",
	},
	{
		id: 3,
		time: "2 hours ago",
		author: "Yuan Exequiel",
		title: "Fixed sticky header backdrop blur spacing issue",
	},
	{
		id: 4,
		time: "5 hours ago",
		author: "David Vance",
		title: "Integrated Tailwind CSS color tokens for dark mode",
	},
	{
		id: 5,
		time: "Yesterday",
		author: "Elena Rostova",
		title: "Created project navigation tabs with dynamic routing",
	},
];

const statusOverview: StatusOverviewItem[] = [
	{ label: "To Do", count: 12, percentage: 30, color: "bg-amber-500" },
	{
		label: "In Progress",
		count: 18,
		percentage: 45,
		color: "bg-blue_munsell-500",
	},
	{ label: "Review", count: 5, percentage: 12, color: "bg-purple-500" },
	{ label: "Done", count: 35, percentage: 88, color: "bg-emerald-500" },
];

const workTypes: WorkTypeItem[] = [
	{
		label: "Features & Enhancements",
		count: 24,
		percentage: 60,
		color: "bg-blue_munsell-500",
	},
	{ label: "Bug Fixes", count: 10, percentage: 25, color: "bg-rose-500" },
	{
		label: "Documentation & Design",
		count: 6,
		percentage: 15,
		color: "bg-amber-500",
	},
];

const teamWorkload: TeamWorkloadMember[] = [
	{ name: "Yuan Exequiel", tasks: 8, load: "75%" },
	{ name: "Sarah Jenkins", tasks: 6, load: "60%" },
	{ name: "Alex Mercer", tasks: 5, load: "50%" },
	{ name: "Elena Rostova", tasks: 3, load: "30%" },
];

export interface SummaryState {
	recentActivities: RecentActivity[];
	statusOverview: StatusOverviewItem[];
	workTypes: WorkTypeItem[];
	teamWorkload: TeamWorkloadMember[];
	setSummaryData: (data: Partial<SummaryState>) => void;
}

export const useSummaryStore = create<SummaryState>()(
	devtools((set) => ({
		recentActivities,
		statusOverview,
		workTypes,
		teamWorkload,
		setSummaryData: (data) => set((state) => ({ ...state, ...data })),
	})),
);
