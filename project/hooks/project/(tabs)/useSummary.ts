import { useSummaryStore } from "@/stores/project/(tabs)/SummaryStore";

export interface RecentActivity {
    id: number;
    time: string;
    author: string;
    title: string;
}

export interface StatusOverviewItem {
    label: string;
    count: number;
    percentage: number;
    color: string;
}

export interface WorkTypeItem {
    label: string;
    count: number;
    percentage: number;
    color: string;
}

export interface TeamWorkloadMember {
    name: string;
    tasks: number;
    load: string;
}

export function useSummary() {
    const recentActivities = useSummaryStore((state) => state.recentActivities);
    const statusOverview = useSummaryStore((state) => state.statusOverview);
    const workTypes = useSummaryStore((state) => state.workTypes);
    const teamWorkload = useSummaryStore((state) => state.teamWorkload);

    return {
        recentActivities,
        statusOverview,
        workTypes,
        teamWorkload,
    };
}