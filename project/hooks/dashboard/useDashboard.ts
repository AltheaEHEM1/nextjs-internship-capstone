import { useEffect } from "react";
import {
    useDashboardStore,
    type AnalyticsMetric,
    type QuickAction,
    type RecentProject,
    type Stat,
    type UpcomingDeadline,
} from "@/stores/dashboard/DashboardStore";

export interface UseDashboardReturn {
    stats: Stat[];
    recentProjects: RecentProject[];
    quickActions: QuickAction[];
    upcomingDeadlines: UpcomingDeadline[];
    analyticsMetrics: AnalyticsMetric[];
    implementationTasks: string[];
    analyticsTasks: string[];
    isLoading: boolean;
    error: string | null;
    handleQuickAction: (label: string) => void;
    handleUpdateProgress: (id: string, progress: number) => void;
    refreshData: () => Promise<void>;
}

export function useDashboard(): UseDashboardReturn {
    const {
        stats,
        recentProjects,
        quickActions,
        upcomingDeadlines,
        analyticsMetrics,
        implementationTasks,
        analyticsTasks,
        isLoading,
        error,
        fetchDashboardData,
        executeQuickAction,
        updateProjectProgress,
    } = useDashboardStore();

    useEffect(() => {
        fetchDashboardData();
    }, [fetchDashboardData]);

    return {
        stats,
        recentProjects,
        quickActions,
        upcomingDeadlines,
        analyticsMetrics,
        implementationTasks,
        analyticsTasks,
        isLoading,
        error,
        handleQuickAction: executeQuickAction,
        handleUpdateProgress: updateProjectProgress,
        refreshData: fetchDashboardData,
    };
}