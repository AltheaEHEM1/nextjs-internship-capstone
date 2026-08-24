"use client";

import { BarChart3, Plus, TrendingUp } from "lucide-react";
import Link from "next/link";
import { PageHeader } from "@/components/page-header/PageHeader";

export default function DashboardPage() {
	// Hard‑coded data
	const totalProjects = 24;
	const totalTeams = 8;
	const taskCompletionRate = 73; // percent
	const recentProjects = [
		{
			id: 1,
			name: "Project Alpha",
			lastUpdated: "2 days ago",
			progressPercent: 80,
		},
		{
			id: 2,
			name: "Project Beta",
			lastUpdated: "5 days ago",
			progressPercent: 55,
		},
		{
			id: 3,
			name: "Project Gamma",
			lastUpdated: "1 week ago",
			progressPercent: 30,
		},
	];

	const quickActions = [
		{ label: "View Projects", href: "/projects", variant: "primary" },
		{ label: "View Teams", href: "/teams", variant: "secondary" },
	];

	return (
		<div className="space-y-6">
			<PageHeader title="Dashboard" description="Your overview at a glance" />

			{/* Stats Grid */}
			<div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-4">
				<div className="rounded-lg border border-french_gray-300 bg-white p-6 dark:border-payne's_gray-400 dark:bg-outer_space-500">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue_munsell-100 dark:bg-blue_munsell-900">
								<Plus className="text-blue_munsell-500" size={20} />
							</div>
						</div>
						<div className="ml-5 w-0 flex-1">
							<dl>
								<dt className="truncate text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400">
									Total Projects
								</dt>
								<dd className="flex items-baseline">
									<div className="text-2xl font-semibold text-outer_space-500 dark:text-platinum-500">
										{totalProjects}
									</div>
								</dd>
							</dl>
						</div>
					</div>
				</div>
				<div className="rounded-lg border border-french_gray-300 bg-white p-6 dark:border-payne's_gray-400 dark:bg-outer_space-500">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue_munsell-100 dark:bg-blue_munsell-900">
								<TrendingUp className="text-blue_munsell-500" size={20} />
							</div>
						</div>
						<div className="ml-5 w-0 flex-1">
							<dl>
								<dt className="truncate text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400">
									Teams
								</dt>
								<dd className="flex items-baseline">
									<div className="text-2xl font-semibold text-outer_space-500 dark:text-platinum-500">
										{totalTeams}
									</div>
								</dd>
							</dl>
						</div>
					</div>
				</div>
				<div className="rounded-lg border border-french_gray-300 bg-white p-6 dark:border-payne's_gray-400 dark:bg-outer_space-500">
					<div className="flex items-center">
						<div className="flex-shrink-0">
							<div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue_munsell-100 dark:bg-blue_munsell-900">
								<BarChart3 className="text-blue_munsell-500" size={20} />
							</div>
						</div>
						<div className="ml-5 w-0 flex-1">
							<dl>
								<dt className="truncate text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400">
									This Month Completion
								</dt>
								<dd className="flex items-baseline">
									<div className="text-2xl font-semibold text-outer_space-500 dark:text-platinum-500">
										{taskCompletionRate}%
									</div>
								</dd>
							</dl>
						</div>
					</div>
				</div>
			</div>

			{/* Quick Actions */}
			<div className="rounded-lg border border-french_gray-300 bg-white p-6 dark:border-payne's_gray-400 dark:bg-outer_space-500">
				<h3 className="mb-4 text-lg font-semibold text-outer_space-500 dark:text-platinum-500">
					Quick Actions
				</h3>
				<div className="space-y-3">
					{quickActions.map((action) => (
						<Link
							key={action.label}
							href={action.href}
							className={
								action.variant === "primary"
									? "flex w-full items-center justify-center rounded-lg bg-blue_munsell-500 px-4 py-3 text-white transition-colors hover:bg-blue_munsell-600"
									: "flex w-full items-center justify-center rounded-lg border border-french_gray-300 px-4 py-3 text-outer_space-500 transition-colors hover:bg-platinum-500 dark:border-payne's_gray-400 dark:text-platinum-500 dark:hover:bg-payne's_gray-400"
							}
						>
							<Plus size={20} className="mr-2" />
							{action.label}
						</Link>
					))}
				</div>
			</div>

			{/* Recent Projects */}
			<div className="rounded-lg border border-french_gray-300 bg-white p-6 dark:border-payne's_gray-400 dark:bg-outer_space-500">
				<h3 className="mb-4 text-lg font-semibold text-outer_space-500 dark:text-platinum-500">
					Recent Projects
				</h3>
				<div className="space-y-3">
					{recentProjects.map((project) => (
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
			</div>

			{/* Charts Placeholder */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
				<div className="rounded-lg border border-french_gray-300 bg-white p-6 dark:border-payne's_gray-400 dark:bg-outer_space-500">
					<h3 className="mb-4 text-lg font-semibold text-outer_space-500 dark:text-platinum-500">
						Project Progress
					</h3>
					<div className="flex h-64 items-center justify-center rounded-lg bg-platinum-800 dark:bg-outer_space-400">
						<BarChart3 size={48} className="mx-auto mb-2" />
						<p>Chart Component Placeholder</p>
					</div>
				</div>
				<div className="rounded-lg border border-french_gray-300 bg-white p-6 dark:border-payne's_gray-400 dark:bg-outer_space-500">
					<h3 className="mb-4 text-lg font-semibold text-outer_space-500 dark:text-platinum-500">
						Team Activity
					</h3>
					<div className="flex h-64 items-center justify-center rounded-lg bg-platinum-800 dark:bg-outer_space-400">
						<TrendingUp size={48} className="mx-auto mb-2" />
						<p>Activity Chart Placeholder</p>
					</div>
				</div>
			</div>
		</div>
	);
}
