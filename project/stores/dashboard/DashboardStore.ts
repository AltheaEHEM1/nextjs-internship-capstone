import { create } from "zustand";
import {
    BarChart3,
    CheckSquare,
    Clock,
    TrendingUp,
    Users,
    Zap,
    type LucideIcon,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Stat {
    name: string;
    value: string;
    change: string;
    icon: LucideIcon;
}

export interface RecentProject {
    id: string;
    name: string;
    lastUpdated: string;
    progressPercent: number;
}

export interface QuickAction {
    label: string;
    variant: "primary" | "secondary";
}

export interface UpcomingDeadline {
    title: string;
    type: string;
    date: string;
}

export interface AnalyticsMetric {
    title: string;
    value: string;
    unit: string;
    color: string;
    icon: LucideIcon;
}

interface DashboardState {
    stats: Stat[];
    recentProjects: RecentProject[];
    quickActions: QuickAction[];
    upcomingDeadlines: UpcomingDeadline[];
    analyticsMetrics: AnalyticsMetric[];
    implementationTasks: string[];
    analyticsTasks: string[];
    isLoading: boolean;
    error: string | null;

    // Actions
    fetchDashboardData: () => Promise<void>;
    executeQuickAction: (label: string) => void;
    updateProjectProgress: (id: string, progress: number) => void;
}

// ─── Initial Mock Data ────────────────────────────────────────────────────────

const INITIAL_IMPLEMENTATION_TASKS: string[] = [
    "Connect stats to real project/task counts from the database",
    "Implement recent projects list with live data",
    "Add quick action functionality (create project, create task)",
    "Build upcoming deadlines from task due dates",
];

const INITIAL_STATS: Stat[] = [
    { name: "Total Projects", value: "12", change: "+2", icon: BarChart3 },
    { name: "Active Tasks", value: "48", change: "+5", icon: CheckSquare },
    { name: "Team Members", value: "8", change: "+1", icon: Users },
    { name: "Completed Today", value: "6", change: "+3", icon: Zap },
];

const INITIAL_RECENT_PROJECTS: RecentProject[] = [
    {
        id: "1",
        name: "Website Redesign",
        lastUpdated: "2 hours ago",
        progressPercent: 65,
    },
    {
        id: "2",
        name: "Mobile App",
        lastUpdated: "Yesterday",
        progressPercent: 40,
    },
    {
        id: "3",
        name: "API Integration",
        lastUpdated: "3 days ago",
        progressPercent: 80,
    },
];

const INITIAL_QUICK_ACTIONS: QuickAction[] = [
    { label: "New Project", variant: "primary" },
    { label: "Create Task", variant: "secondary" },
    { label: "Invite Member", variant: "secondary" },
];

const INITIAL_UPCOMING_DEADLINES: UpcomingDeadline[] = [
    {
        title: "Website Redesign – Phase 1",
        type: "Project Milestone",
        date: "Aug 10",
    },
    { title: "Q3 Performance Review", type: "Team Event", date: "Aug 15" },
    { title: "API v2 Launch", type: "Deployment", date: "Aug 20" },
];

const INITIAL_ANALYTICS_TASKS: string[] = [
    "Task 5.1: Implement project velocity tracking",
    "Task 5.2: Add team productivity metrics",
    "Task 5.3: Build burndown chart with Recharts",
    "Task 5.4: Create exportable reports",
];

const INITIAL_ANALYTICS_METRICS: AnalyticsMetric[] = [
    {
        title: "Task Completion Rate",
        value: "87%",
        unit: "This month",
        color: "blue",
        icon: CheckSquare,
    },
    {
        title: "Avg. Task Duration",
        value: "2.4h",
        unit: "Per task",
        color: "green",
        icon: Clock,
    },
    {
        title: "Team Velocity",
        value: "34",
        unit: "Points / sprint",
        color: "purple",
        icon: TrendingUp,
    },
    {
        title: "Active Members",
        value: "8",
        unit: "Contributors",
        color: "orange",
        icon: Users,
    },
];

// ─── Store Implementation ──────────────────────────────────────────────────────

export const useDashboardStore = create<DashboardState>((set) => ({
    stats: INITIAL_STATS,
    recentProjects: INITIAL_RECENT_PROJECTS,
    quickActions: INITIAL_QUICK_ACTIONS,
    upcomingDeadlines: INITIAL_UPCOMING_DEADLINES,
    analyticsMetrics: INITIAL_ANALYTICS_METRICS,
    implementationTasks: INITIAL_IMPLEMENTATION_TASKS,
    analyticsTasks: INITIAL_ANALYTICS_TASKS,
    isLoading: false,
    error: null,

    fetchDashboardData: async () => {
        set({ isLoading: true, error: null });
        try {
            // Replace with database / API calls when ready
            set({ isLoading: false });
        } catch (err) {
            set({
                error: err instanceof Error ? err.message : "Failed to load dashboard data",
                isLoading: false,
            });
        }
    },

    executeQuickAction: (label: string) => {
        console.log(`Action triggered: ${label}`);
    },

    updateProjectProgress: (id: string, progress: number) => {
        set((state) => ({
            recentProjects: state.recentProjects.map((project) =>
                project.id === id ? { ...project, progressPercent: progress } : project
            ),
        }));
    },
}));