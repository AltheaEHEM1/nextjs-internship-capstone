"use client";

import {
	BarChart3,
	CalendarClock,
	CheckCircle2,
	Clock,
	Edit3,
	PieChart,
	PlusCircle,
	Users,
} from "lucide-react";
import { use, useCallback, useEffect, useState } from "react";
import { DetailSettingsSkeleton } from "@/components/skeletons/DetailSettingsSkeleton";

import {
	type RecentActivity,
	type StatusOverviewItem,
	type TeamWorkloadMember,
	useSummary,
	type WorkTypeItem,
} from "@/hooks/project/(tabs)/useSummary";
import { pusherClient } from "@/lib/real-time-board/PusherClient";

export default function Summary({
	params,
}: {
	params: Promise<{ id: string }>;
}) {
	const { id } = use(params);
	const [isLoading, setIsLoading] = useState(true);
	const {
		recentActivities,
		statusOverview,
		workTypes,
		teamWorkload,
		setSummaryData,
	} = useSummary();

	const [projectInfo, setProjectInfo] = useState({
		name: "Loading...",
		description: "",
		progress: 0,
		completedCount: 0,
		createdCount: 0,
		dueSoonCount: 0,
		editedCount: 0,
	});

	const fetchProjectData = useCallback(() => {
		setIsLoading(true);
		fetch(`/api/project/${id}`)
			.then((r) => r.json())
			.then((res) => {
				if (res.success && res.data) {
					const project = res.data;
					const statuses = project.statuses || [];
					type TaskWithStatus = {
						statusName: string;
						title?: string;
						createdAt: string;
						updatedAt: string;
						dueDate?: string | null;
						priority?: string;
						assignee?: { name?: string };
					};

					const allTasks: TaskWithStatus[] = statuses.flatMap(
						(s: {
							name: string;
							tasks?: {
								title?: string;
								createdAt: string;
								updatedAt: string;
								dueDate?: string | null;
								priority?: string;
								assignee?: { name?: string };
							}[];
						}) => (s.tasks || []).map((t) => ({ ...t, statusName: s.name })),
					);

					const now = new Date();
					const sevenDaysAgo = new Date(
						now.getTime() - 7 * 24 * 60 * 60 * 1000,
					);
					const sevenDaysFromNow = new Date(
						now.getTime() + 7 * 24 * 60 * 60 * 1000,
					);

					let completedCount = 0;
					let createdCount = 0;
					let editedCount = 0;
					let dueSoonCount = 0;
					let doneTasks = 0;

					allTasks.forEach((t: TaskWithStatus) => {
						const createdAt = new Date(t.createdAt);
						const updatedAt = new Date(t.updatedAt);
						const dueDate = t.dueDate ? new Date(t.dueDate) : null;

						if (t.statusName === "Done") {
							doneTasks++;
							if (updatedAt >= sevenDaysAgo) completedCount++;
						}

						if (createdAt >= sevenDaysAgo) createdCount++;
						if (updatedAt >= sevenDaysAgo) editedCount++;

						if (
							dueDate &&
							dueDate >= now &&
							dueDate <= sevenDaysFromNow &&
							t.statusName !== "Done"
						) {
							dueSoonCount++;
						}
					});

					const progress =
						allTasks.length > 0
							? Math.round((doneTasks / allTasks.length) * 100)
							: 0;

					setProjectInfo({
						name: project.name,
						description:
							project.description ||
							"Tracking core development metrics, task velocity, and team contributions for the current cycle.",
						progress,
						completedCount,
						createdCount,
						dueSoonCount,
						editedCount,
					});

					const statusOverviewData = statuses.map(
						(s: { name: string; color?: string; tasks?: unknown[] }) => ({
							label: s.name,
							count: s.tasks?.length || 0,
							percentage:
								allTasks.length > 0
									? Math.round(((s.tasks?.length || 0) / allTasks.length) * 100)
									: 0,
							color: s.color?.includes("emerald")
								? "bg-emerald-500"
								: s.color?.includes("blue")
									? "bg-blue_munsell-500"
									: s.color?.includes("amber")
										? "bg-amber-500"
										: "bg-purple-500",
						}),
					);

					const priorityCounts: Record<string, number> = {
						high: 0,
						medium: 0,
						low: 0,
					};
					allTasks.forEach((t: TaskWithStatus) => {
						const p = t.priority === "urgent" ? "high" : t.priority || "low";
						priorityCounts[p]++;
					});
					const workTypesData = [
						{
							label: "High Priority",
							count: priorityCounts.high,
							percentage:
								allTasks.length > 0
									? Math.round((priorityCounts.high / allTasks.length) * 100)
									: 0,
							color: "bg-rose-500",
						},
						{
							label: "Medium Priority",
							count: priorityCounts.medium,
							percentage:
								allTasks.length > 0
									? Math.round((priorityCounts.medium / allTasks.length) * 100)
									: 0,
							color: "bg-amber-500",
						},
						{
							label: "Low Priority",
							count: priorityCounts.low,
							percentage:
								allTasks.length > 0
									? Math.round((priorityCounts.low / allTasks.length) * 100)
									: 0,
							color: "bg-blue_munsell-500",
						},
					].filter((w) => w.count > 0);

					const workloadMap: Record<string, number> = {};
					allTasks.forEach((t: TaskWithStatus) => {
						if (
							t.statusName !== "Done" &&
							(t as { assignee?: { name?: string } }).assignee
						) {
							const assigneeName =
								(t as { assignee?: { name?: string } }).assignee?.name ||
								"Unknown";
							workloadMap[assigneeName] = (workloadMap[assigneeName] || 0) + 1;
						}
					});
					const totalActiveTasks = Object.values(workloadMap).reduce(
						(a, b) => a + b,
						0,
					);
					const teamWorkloadData = Object.entries(workloadMap)
						.map(([name, tasks]) => ({
							name,
							tasks,
							load:
								totalActiveTasks > 0
									? `${Math.round((tasks / totalActiveTasks) * 100)}%`
									: "0%",
						}))
						.sort((a, b) => b.tasks - a.tasks);

					const sortedTasks = [...allTasks]
						.sort(
							(a, b) =>
								new Date(b.updatedAt).getTime() -
								new Date(a.updatedAt).getTime(),
						)
						.slice(0, 5);
					const recentActivitiesData = sortedTasks.map((t, idx) => ({
						id: idx + 1,
						time: new Date(t.updatedAt).toLocaleDateString(),
						author:
							(t as { assignee?: { name?: string } }).assignee?.name ||
							"System",
						title: `Updated task: ${t.title}`,
					}));

					setSummaryData({
						statusOverview: statusOverviewData,
						workTypes:
							workTypesData.length > 0
								? workTypesData
								: [
										{
											label: "No tasks",
											count: 0,
											percentage: 0,
											color: "bg-gray-500",
										},
									],
						teamWorkload: teamWorkloadData,
						recentActivities: recentActivitiesData,
					});
				}
			})
			.catch((err) => {
				console.error("fetchProjectData Error:", err);
			})
			.finally(() => {
				setIsLoading(false);
			});
	}, [id, setSummaryData]);

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

	const metrics = [
		{
			label: "Completed (7d)",
			count: projectInfo.completedCount,
			icon: CheckCircle2,
			colorClass: "text-emerald-600 dark:text-emerald-400 bg-emerald-500/10",
		},
		{
			label: "Created (7d)",
			count: projectInfo.createdCount,
			icon: PlusCircle,
			colorClass:
				"text-blue_munsell-600 dark:text-blue_munsell-400 bg-blue_munsell-500/10",
		},
		{
			label: "Due in 7 Days",
			count: projectInfo.dueSoonCount,
			icon: CalendarClock,
			colorClass: "text-amber-600 dark:text-amber-400 bg-amber-500/10",
		},
		{
			label: "Edited (7d)",
			count: projectInfo.editedCount,
			icon: Edit3,
			colorClass: "text-purple-600 dark:text-purple-400 bg-purple-500/10",
		},
	];

	if (isLoading) {
		return <DetailSettingsSkeleton />;
	}

	return (
		<div className="space-y-6 pb-12">
			{/* 1. Project Information Banner */}
			<div className="rounded-2xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500">
				<div className="flex flex-col justify-between gap-4 md:flex-row md:items-center">
					<div>
						<span className="text-xs font-semibold uppercase tracking-wider text-blue_munsell-600 dark:text-blue_munsell-400">
							Active Sprint Overview
						</span>
						<h2 className="text-xl font-bold text-outer_space-800 dark:text-platinum-100">
							{projectInfo.name}
						</h2>
						<p className="mt-1 text-sm text-outer_space-500 dark:text-platinum-400">
							{projectInfo.description}
						</p>
					</div>
					<div className="flex items-center gap-3">
						<div className="rounded-xl bg-blue_munsell-50 px-4 py-2.5 text-center dark:bg-blue_munsell-950/40">
							<span className="block text-xs font-medium text-outer_space-400 dark:text-platinum-400">
								Sprint Progress
							</span>
							<span className="text-lg font-bold text-blue_munsell-600 dark:text-blue_munsell-400">
								{projectInfo.progress}%
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* 2. Metrics Grid (Last 7 Days) */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{metrics.map(({ label, count, icon: Icon, colorClass }) => (
					<div
						key={label}
						className="rounded-xl border border-french_gray-200 bg-white p-5 shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500"
					>
						<div className="flex items-center justify-between">
							<span className="text-sm font-medium text-outer_space-500 dark:text-platinum-400">
								{label}
							</span>
							<span className={`rounded-lg p-2 ${colorClass}`}>
								<Icon size={18} />
							</span>
						</div>
						<div className="mt-4 flex items-baseline gap-2">
							<span className="text-3xl font-bold text-outer_space-800 dark:text-platinum-100">
								{count}
							</span>
						</div>
					</div>
				))}
			</div>

			{/* 3. Analytics & Breakdown Section */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Status Overview */}
				<div className="rounded-xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500">
					<div className="mb-4 flex items-center justify-between">
						<h3 className="flex items-center gap-2 font-semibold text-outer_space-800 dark:text-platinum-100">
							<BarChart3 size={18} className="text-blue_munsell-500" /> Status
							Overview
						</h3>
					</div>
					<div className="space-y-4">
						{statusOverview.map((item: StatusOverviewItem) => (
							<div key={item.label}>
								<div className="mb-1 flex justify-between text-xs font-medium text-outer_space-600 dark:text-platinum-300">
									<span>{item.label}</span>
									<span>{item.count} tasks</span>
								</div>
								<div className="h-2 w-full overflow-hidden rounded-full bg-french_gray-100 dark:bg-payne's_gray-400">
									<div
										className={`h-full rounded-full ${item.color}`}
										style={{ width: `${item.percentage}%` }}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Types of Work */}
				<div className="rounded-xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500">
					<div className="mb-4 flex items-center justify-between">
						<h3 className="flex items-center gap-2 font-semibold text-outer_space-800 dark:text-platinum-100">
							<PieChart size={18} className="text-purple-500" /> Types of Work
						</h3>
					</div>
					<div className="space-y-4">
						{workTypes.map((item: WorkTypeItem) => (
							<div key={item.label}>
								<div className="mb-1 flex justify-between text-xs font-medium text-outer_space-600 dark:text-platinum-300">
									<span>{item.label}</span>
									<span>{item.count} items</span>
								</div>
								<div className="h-2 w-full overflow-hidden rounded-full bg-french_gray-100 dark:bg-payne's_gray-400">
									<div
										className={`h-full rounded-full ${item.color}`}
										style={{ width: `${item.percentage}%` }}
									/>
								</div>
							</div>
						))}
					</div>
				</div>

				{/* Team Workload */}
				<div className="rounded-xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500">
					<div className="mb-4 flex items-center justify-between">
						<h3 className="flex items-center gap-2 font-semibold text-outer_space-800 dark:text-platinum-100">
							<Users size={18} className="text-emerald-500" /> Team Workload
						</h3>
					</div>
					<div className="space-y-3">
						{teamWorkload.map((member: TeamWorkloadMember) => (
							<div
								key={member.name}
								className="flex items-center justify-between rounded-lg bg-platinum-100/50 p-2 dark:bg-outer_space-400/50"
							>
								<div className="flex items-center gap-3">
									<div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue_munsell-500 text-xs font-semibold text-white">
										{member.name.charAt(0)}
									</div>
									<div>
										<h4 className="text-xs font-semibold text-outer_space-700 dark:text-platinum-200">
											{member.name}
										</h4>
										<p className="text-[10px] text-outer_space-400 dark:text-platinum-400">
											{member.tasks} active issues
										</p>
									</div>
								</div>
								<span className="rounded-md bg-blue_munsell-50 px-2 py-1 text-xs font-medium text-blue_munsell-700 dark:bg-blue_munsell-950 dark:text-blue_munsell-300">
									{member.load}
								</span>
							</div>
						))}
					</div>
				</div>
			</div>

			{/* 4. Recent Activity Feed */}
			<div className="rounded-xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500">
				<div className="mb-4 flex items-center justify-between">
					<h3 className="flex items-center gap-2 font-semibold text-outer_space-800 dark:text-platinum-100">
						<Clock size={18} className="text-blue_munsell-500" /> Recent
						Activity Log
					</h3>
					<span className="text-xs text-outer_space-400 dark:text-platinum-400">
						Showing last 5 updates
					</span>
				</div>
				<div className="divide-y divide-french_gray-100 dark:divide-payne's_gray-400">
					{recentActivities.map((act: RecentActivity) => (
						<div
							key={act.id}
							className="flex flex-col gap-1 py-3 first:pt-0 last:pb-0 sm:flex-row sm:items-center sm:justify-between sm:gap-4"
						>
							<div className="flex items-center gap-3">
								<div className="h-2 w-2 flex-shrink-0 rounded-full bg-blue_munsell-500" />
								<p className="text-sm font-medium text-outer_space-700 dark:text-platinum-200">
									{act.title}
								</p>
							</div>
							<div className="flex items-center gap-2 pl-5 text-xs text-outer_space-400 sm:pl-0 dark:text-platinum-400">
								<span className="font-medium text-blue_munsell-600 dark:text-blue_munsell-400">
									{act.author}
								</span>
								<span>•</span>
								<span>{act.time}</span>
							</div>
						</div>
					))}
				</div>
			</div>
		</div>
	);
}
