import {
	BarChart3,
	CheckCircle,
	Clock,
	TrendingUp,
	Users,
	type LucideIcon,
} from "lucide-react";
import { useMemo } from "react";

export type DashboardStat = {
	name: string;
	value: string;
	icon: LucideIcon;
	change: string;
};

export type RecentProject = {
	id: number;
	name: string;
	lastUpdated: string;
	progressPercent: number;
};

export type QuickAction = {
	label: string;
	variant: "primary" | "secondary";
};

export type UpcomingDeadline = {
	title: string;
	date: string;
	type: string;
};

export type AnalyticsMetric = {
	title: string;
	value: string;
	unit: string;
	icon: LucideIcon;
	color: string;
};

export function useDashboard() {
	const implementationTasks = useMemo(
		() => [
			"Task 4.2: Create project listing and dashboard interface",
			"Task 5.3: Set up client-side state management with Zustand",
			"Task 6.6: Optimize performance and implement loading states",
		],
		[],
	);

	const stats = useMemo<DashboardStat[]>(
		() => [
			{
				name: "Active Projects",
				value: "12",
				icon: TrendingUp,
				change: "+2.5%",
			},
			{ name: "Team Members", value: "24", icon: Users, change: "+4.1%" },
			{
				name: "Completed Tasks",
				value: "156",
				icon: CheckCircle,
				change: "+12.3%",
			},
			{
				name: "Pending Tasks",
				value: "43",
				icon: Clock,
				change: "-2.1%",
			},
		],
		[],
	);

	const recentProjects = useMemo<RecentProject[]>(
		() => [
			{
				id: 1,
				name: "Project 1",
				lastUpdated: "Last updated 2 hours ago",
				progressPercent: 66,
			},
			{
				id: 2,
				name: "Project 2",
				lastUpdated: "Last updated 2 hours ago",
				progressPercent: 66,
			},
			{
				id: 3,
				name: "Project 3",
				lastUpdated: "Last updated 2 hours ago",
				progressPercent: 66,
			},
		],
		[],
	);

	const quickActions = useMemo<QuickAction[]>(
		() => [
			{ label: "Create New Project", variant: "primary" },
			{ label: "Add Team Member", variant: "secondary" },
			{ label: "Create Task", variant: "secondary" },
		],
		[],
	);

	const upcomingDeadlines = useMemo<UpcomingDeadline[]>(
		() => [
			{
				title: "Website Redesign",
				date: "Dec 15, 2026",
				type: "Project Deadline",
			},
			{ title: "Team Meeting", date: "Dec 18, 2026", type: "Meeting" },
			{
				title: "Mobile App Launch",
				date: "Dec 22, 2026",
				type: "Milestone",
			},
		],
		[],
	);

	const analyticsTasks = useMemo(
		() => [
			"Task 6.6: Optimize performance and implement loading states",
			"Task 8.5: Set up performance monitoring and analytics",
		],
		[],
	);

	const analyticsMetrics = useMemo<AnalyticsMetric[]>(
		() => [
			{
				title: "Project Velocity",
				value: "8.5",
				unit: "tasks/week",
				icon: TrendingUp,
				color: "blue",
			},
			{
				title: "Team Efficiency",
				value: "92%",
				unit: "completion rate",
				icon: BarChart3,
				color: "green",
			},
			{
				title: "Active Users",
				value: "24",
				unit: "this week",
				icon: Users,
				color: "purple",
			},
			{
				title: "Avg. Task Time",
				value: "2.3",
				unit: "days",
				icon: Clock,
				color: "orange",
			},
		],
		[],
	);

	return {
		implementationTasks,
		stats,
		recentProjects,
		quickActions,
		upcomingDeadlines,
		analyticsTasks,
		analyticsMetrics,
	};
}
