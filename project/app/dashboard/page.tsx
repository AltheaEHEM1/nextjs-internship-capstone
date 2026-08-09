"use client";

import { BarChart3, Plus, TrendingUp } from "lucide-react";
import { PageHeader } from "@/components/page-header/PageHeader";
import { useDashboard } from "@/hooks/dashboard/useDashboard";
import type { AnalyticsMetric, QuickAction, RecentProject, Stat, UpcomingDeadline,} from "@/stores/dashboard/DashboardStore";

export default function DashboardPage() {
    const {
        stats,
        recentProjects,
        quickActions,
        upcomingDeadlines,
        analyticsMetrics,
        implementationTasks,
        analyticsTasks,
        handleQuickAction,
    } = useDashboard();

    return (
        <div className="space-y-6">
            <PageHeader
                title="Dashboard"
                description="Welcome back! Here's an overview of your projects and tasks."
            />

            {/* Implementation Status Banner */}
            <div className="rounded-lg border border-blue-200 bg-blue-50 p-4 dark:border-blue-800 dark:bg-blue-900/20">
                <div className="flex items-start">
                    <div className="flex-shrink-0">
                        <div className="flex h-8 w-8 items-center justify-center rounded-full bg-blue_munsell-500">
                            <TrendingUp className="text-white" size={16} />
                        </div>
                    </div>
                    <div className="ml-3">
                        <h3 className="text-sm font-medium text-blue-900 dark:text-blue-100">
                            Dashboard Implementation Tasks
                        </h3>
                        <div className="mt-2 text-sm text-blue-800 dark:text-blue-200">
                            <ul className="list-inside list-disc space-y-1">
                                {implementationTasks.map((task: string) => (
                                    <li key={task}>{task}</li>
                                ))}
                            </ul>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
                {stats.map((stat: Stat) => (
                    <div
                        key={stat.name}
                        className="overflow-hidden rounded-lg border border-french_gray-300 bg-white p-6 dark:border-payne's_gray-400 dark:bg-outer_space-500"
                    >
                        <div className="flex items-center">
                            <div className="flex-shrink-0">
                                <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue_munsell-100 dark:bg-blue_munsell-900">
                                    <stat.icon className="text-blue_munsell-500" size={20} />
                                </div>
                            </div>
                            <div className="ml-5 w-0 flex-1">
                                <dl>
                                    <dt className="truncate text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400">
                                        {stat.name}
                                    </dt>
                                    <dd className="flex items-baseline">
                                        <div className="text-2xl font-semibold text-outer_space-500 dark:text-platinum-500">
                                            {stat.value}
                                        </div>
                                        <div className="ml-2 flex items-baseline text-sm font-semibold text-green-600 dark:text-green-400">
                                            {stat.change}
                                        </div>
                                    </dd>
                                </dl>
                            </div>
                        </div>
                    </div>
                ))}
            </div>

            {/* Recent Activity & Quick Actions */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                {/* Recent Projects */}
                <div className="rounded-lg border border-french_gray-300 bg-white p-6 dark:border-payne's_gray-400 dark:bg-outer_space-500">
                    <h3 className="mb-4 text-lg font-semibold text-outer_space-500 dark:text-platinum-500">
                        Recent Projects
                    </h3>
                    <div className="space-y-3">
                        {recentProjects.map((project: RecentProject) => (
                            <div
                                key={project.id}
                                className="flex items-center justify-between rounded-lg bg-platinum-800 p-3 dark:bg-outer_space-400"
                            >
                                <div>
                                    <div className="font-medium text-outer_space-500 dark:text-platinum-500">
                                        {project.name}
                                    </div>
                                    <div className="text-sm text-payne's_gray-500 dark:text-french_gray-400">
                                        {project.lastUpdated}
                                    </div>
                                </div>
                                <div className="h-2 w-12 rounded-full bg-french_gray-300 dark:bg-payne's_gray-400">
                                    <div
                                        className="h-2 rounded-full bg-blue_munsell-500"
                                        style={{ width: `${project.progressPercent}%` }}
                                    />
                                </div>
                            </div>
                        ))}
                    </div>
                    <div className="mt-4 rounded border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            📋 <strong>Task 4.1:</strong> Implement project CRUD operations
                        </p>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="rounded-lg border border-french_gray-300 bg-white p-6 dark:border-payne's_gray-400 dark:bg-outer_space-500">
                    <h3 className="mb-4 text-lg font-semibold text-outer_space-500 dark:text-platinum-500">
                        Quick Actions
                    </h3>
                    <div className="space-y-3">
                        {quickActions.map((action: QuickAction) => (
                            <button
                                key={action.label}
                                type="button"
                                onClick={() => handleQuickAction(action.label)}
                                className={
                                    action.variant === "primary"
                                        ? "flex w-full items-center justify-center rounded-lg bg-blue_munsell-500 px-4 py-3 text-white transition-colors hover:bg-blue_munsell-600"
                                        : "flex w-full items-center justify-center rounded-lg border border-french_gray-300 px-4 py-3 text-outer_space-500 transition-colors hover:bg-platinum-500 dark:border-payne's_gray-400 dark:text-platinum-500 dark:hover:bg-payne's_gray-400"
                                }
                            >
                                <Plus size={20} className="mr-2" />
                                {action.label}
                            </button>
                        ))}
                    </div>
                    <div className="mt-4 rounded border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                        <p className="text-sm text-yellow-800 dark:text-yellow-200">
                            📋 <strong>Task 4.4:</strong> Build task creation and editing
                            functionality
                        </p>
                    </div>
                </div>
            </div>

            {/* Upcoming Deadlines */}
            <div className="rounded-lg border border-french_gray-300 bg-white p-6 dark:border-payne's_gray-400 dark:bg-outer_space-500">
                <h3 className="mb-4 text-lg font-semibold text-outer_space-500 dark:text-platinum-500">
                    Upcoming Deadlines
                </h3>
                <div className="space-y-3">
                    {upcomingDeadlines.map((event: UpcomingDeadline) => (
                        <div
                            key={event.title}
                            className="flex items-center justify-between rounded-lg bg-platinum-100 p-3 dark:bg-outer_space-400"
                        >
                            <div>
                                <div className="font-medium text-outer_space-800 dark:text-platinum-100">
                                    {event.title}
                                </div>
                                <div className="text-sm text-outer_space-500 dark:text-french_gray-400">
                                    {event.type}
                                </div>
                            </div>
                            <div className="text-sm text-outer_space-500 dark:text-french_gray-400">
                                {event.date}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            <PageHeader
                title="Analytics"
                description="Track project performance and team productivity"
            />

            {/* Implementation Tasks Banner */}
            <div className="rounded-lg border border-yellow-200 bg-yellow-50 p-4 dark:border-yellow-800 dark:bg-yellow-900/20">
                <h3 className="mb-2 text-sm font-medium text-yellow-800 dark:text-yellow-200">
                    📊 Analytics Implementation Tasks
                </h3>
                <ul className="space-y-1 text-sm text-yellow-700 dark:text-yellow-300">
                    {analyticsTasks.map((task: string) => (
                        <li key={task}>• {task}</li>
                    ))}
                </ul>
            </div>

            {/* Analytics Cards */}
            <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-4">
                {analyticsMetrics.map((metric: AnalyticsMetric) => (
                    <div
                        key={metric.title}
                        className="rounded-lg border border-french_gray-300 bg-white p-6 dark:border-payne's_gray-400 dark:bg-outer_space-500"
                    >
                        <div className="mb-4 flex items-center justify-between">
                            <div
                                className={`h-10 w-10 bg-${metric.color}-100 dark:bg-${metric.color}-900 flex items-center justify-center rounded-lg`}
                            >
                                <metric.icon className={`text-${metric.color}-500`} size={20} />
                            </div>
                        </div>
                        <div className="mb-1 text-2xl font-bold text-outer_space-500 dark:text-platinum-500">
                            {metric.value}
                        </div>
                        <div className="mb-2 text-sm text-payne's_gray-500 dark:text-french_gray-400">
                            {metric.unit}
                        </div>
                        <div className="text-xs font-medium text-outer_space-500 dark:text-platinum-500">
                            {metric.title}
                        </div>
                    </div>
                ))}
            </div>

            {/* Charts Placeholder */}
            <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
                <div className="rounded-lg border border-french_gray-300 bg-white p-6 dark:border-payne's_gray-400 dark:bg-outer_space-500">
                    <h3 className="mb-4 text-lg font-semibold text-outer_space-500 dark:text-platinum-500">
                        Project Progress
                    </h3>
                    <div className="flex h-64 items-center justify-center rounded-lg bg-platinum-800 dark:bg-outer_space-400">
                        <div className="text-center text-payne's_gray-500 dark:text-french_gray-400">
                            <BarChart3 size={48} className="mx-auto mb-2" />
                            <p>Chart Component Placeholder</p>
                            <p className="text-sm">
                                TODO: Implement with Chart.js or Recharts
                            </p>
                        </div>
                    </div>
                </div>

                <div className="rounded-lg border border-french_gray-300 bg-white p-6 dark:border-payne's_gray-400 dark:bg-outer_space-500">
                    <h3 className="mb-4 text-lg font-semibold text-outer_space-500 dark:text-platinum-500">
                        Team Activity
                    </h3>
                    <div className="flex h-64 items-center justify-center rounded-lg bg-platinum-800 dark:bg-outer_space-400">
                        <div className="text-center text-payne's_gray-500 dark:text-french_gray-400">
                            <TrendingUp size={48} className="mx-auto mb-2" />
                            <p>Activity Chart Placeholder</p>
                            <p className="text-sm">TODO: Implement activity timeline</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}