import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type {
	RecentActivity,
	StatusOverviewItem,
	TeamWorkloadMember,
	WorkTypeItem,
} from "@/hooks/project/(tabs)/useSummary";

const recentActivities: RecentActivity[] = [];

const statusOverview: StatusOverviewItem[] = [];

const workTypes: WorkTypeItem[] = [];

const teamWorkload: TeamWorkloadMember[] = [];

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
