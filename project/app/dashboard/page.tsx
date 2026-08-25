"use client";

import {
	AlertCircle,
	Archive,
	ArrowRight,
	BarChart3,
	Calendar,
	CheckCircle2,
	Clock,
	FolderGit2,
	FolderPlus,
	Layers,
	Medal,
	PieChart as PieChartIcon,
	Plus,
	Sparkles,
	TrendingUp,
	Trophy,
	Users,
} from "lucide-react";
import Link from "next/link";
import { useCallback, useEffect, useState } from "react";
import {
	Area,
	AreaChart,
	Bar,
	BarChart,
	CartesianGrid,
	Cell,
	Pie,
	PieChart,
	ResponsiveContainer,
	Tooltip,
	XAxis,
	YAxis,
} from "recharts";

import CreateProject1 from "@/components/modals/project/CreateProject1Modal";
import CreateProject2 from "@/components/modals/project/CreateProject2Modal";
import { PageHeader } from "@/components/page-header/PageHeader";
import { useProject } from "@/hooks/project/useProject";
import type { DashboardMetricData } from "@/lib/queries/dashboard";

// ─── Custom Tooltip for Recharts ─────────────────────────────────────────────
function CustomChartTooltip({
	active,
	payload,
	label,
}: {
	active?: boolean;
	payload?: {
		name: string;
		value: number;
		color?: string;
		payload?: unknown;
	}[];
	label?: string;
}) {
	if (!active || !payload?.length) return null;
	return (
		<div className="rounded-xl border border-french_gray-200 bg-white/95 p-3 text-xs shadow-xl backdrop-blur-md dark:border-payne's_gray-600 dark:bg-outer_space-600/95">
			{label && (
				<p className="mb-1.5 font-semibold text-outer_space-700 dark:text-platinum-200">
					{label}
				</p>
			)}
			<div className="space-y-1">
				{payload.map((p, idx) => (
					<div
						key={p.name ? `${p.name}-${idx}` : `tooltip-item-${idx}`}
						className="flex items-center gap-2"
					>
						<span
							className="h-2.5 w-2.5 rounded-full"
							style={{ backgroundColor: p.color || "#0ea5e9" }}
						/>
						<span className="text-payne's_gray-500 dark:text-french_gray-400">
							{p.name}:
						</span>
						<span className="font-bold text-outer_space-800 dark:text-platinum-100">
							{p.value}
						</span>
					</div>
				))}
			</div>
		</div>
	);
}

function CustomPieTooltip({
	active,
	payload,
}: {
	active?: boolean;
	payload?: { name: string; value: number; payload: { percentage: number } }[];
}) {
	if (!active || !payload?.length) return null;
	const item = payload[0];
	return (
		<div className="rounded-xl border border-french_gray-200 bg-white/95 p-3 text-xs shadow-xl backdrop-blur-md dark:border-payne's_gray-600 dark:bg-outer_space-600/95">
			<p className="font-semibold text-outer_space-700 dark:text-platinum-200">
				{item.name}
			</p>
			<p className="mt-0.5 text-payne's_gray-500 dark:text-french_gray-400">
				<span className="font-bold text-outer_space-800 dark:text-platinum-100">
					{item.value}
				</span>{" "}
				projects ({item.payload.percentage}%)
			</p>
		</div>
	);
}

export default function DashboardPage() {
	const [data, setData] = useState<DashboardMetricData | null>(null);
	const [isLoading, setIsLoading] = useState(true);
	const [error, setError] = useState<string | null>(null);

	const {
		modalStep,
		projectName,
		setProjectName,
		description,
		setDescription,
		access,
		setAccess,
		team,
		setTeam,
		dueDate,
		setDueDate,
		handleOpen,
		handleClose,
		handleNext,
		handleBack,
		handleCreateFinal,
	} = useProject();

	const fetchDashboardData = useCallback(async () => {
		try {
			const res = await fetch("/api/dashboard");
			const json = await res.json();
			if (json.success && json.data) {
				setData(json.data);
				setError(null);
			} else {
				setError(json.error || "Failed to load dashboard data");
			}
		} catch (err: unknown) {
			setError(
				err instanceof Error ? err.message : "Failed to load dashboard data",
			);
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchDashboardData();
	}, [fetchDashboardData]);

	const onProjectCreated = async (formData: Record<string, unknown>) => {
		await handleCreateFinal(
			formData as unknown as {
				views: string[];
				statuses: {
					notStarted?: string[];
					active?: string[];
					done?: string[];
					closed?: string[];
				};
			},
		);
		await fetchDashboardData();
	};

	if (isLoading) {
		return (
			<div className="space-y-6 pb-12">
				<PageHeader
					title="Dashboard & Analytics"
					description="Real-time workspace overview, team performance, and project metrics"
				/>
				{/* Top metrics skeleton */}
				<div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
					{[1, 2, 3, 4].map((i) => (
						<div
							key={i}
							className="h-32 animate-pulse rounded-2xl border border-french_gray-200 bg-white/70 p-6 dark:border-payne's_gray-500/30 dark:bg-outer_space-500/50"
						/>
					))}
				</div>
				{/* Leaderboards skeleton (2 columns) */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
					{[1, 2].map((i) => (
						<div
							key={i}
							className="h-80 animate-pulse rounded-2xl border border-french_gray-200 bg-white/70 p-6 dark:border-payne's_gray-500/30 dark:bg-outer_space-500/50"
						/>
					))}
				</div>
				{/* Recent Projects skeleton (full-width row) */}
				<div className="h-64 animate-pulse rounded-2xl border border-french_gray-200 bg-white/70 p-6 dark:border-payne's_gray-500/30 dark:bg-outer_space-500/50" />
				{/* Graphs skeleton */}
				<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
					{[1, 2].map((i) => (
						<div
							key={i}
							className="h-72 animate-pulse rounded-2xl border border-french_gray-200 bg-white/70 p-6 dark:border-payne's_gray-500/30 dark:bg-outer_space-500/50"
						/>
					))}
				</div>
			</div>
		);
	}

	const totalProjects = data?.totalProjects ?? 0;
	const pendingProjects = data?.pendingProjects ?? 0;
	const endedProjects = data?.endedProjects ?? 0;
	const archivedProjects = data?.archivedProjects ?? 0;
	const completionRate = data?.completionRate ?? 0;
	const topTeams = data?.topTeams ?? [];
	const topMembers = data?.topMembers ?? [];
	const recentProjects = data?.recentProjects ?? [];
	const statusDistribution = data?.statusDistribution ?? [];
	const priorityDistribution = data?.priorityDistribution ?? [];
	const monthlyTrends = data?.monthlyTrends ?? [];

	return (
		<div className="space-y-8 pb-14">
			{/* Page Header with Refresh Action */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<PageHeader
					title="Dashboard & Analytics"
					description="Real-time workspace overview, team performance, and project metrics"
				/>
			</div>

			{error && (
				<div className="flex items-center gap-3 rounded-xl border border-rose-200 bg-rose-50 p-4 text-sm text-rose-700 dark:border-rose-900/50 dark:bg-rose-950/30 dark:text-rose-300">
					<AlertCircle size={18} className="shrink-0" />
					<span>{error}</span>
				</div>
			)}

			{/* ─── 1. TOP SUMMARY METRIC CARDS ───────────────────────────────────── */}
			<div className="grid grid-cols-1 gap-5 md:grid-cols-2 lg:grid-cols-4">
				{/* Total Projects Card */}
				<div className="group relative overflow-hidden rounded-2xl border border-french_gray-300/70 bg-gradient-to-br from-white via-white to-blue_munsell-50/30 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-payne's_gray-400/50 dark:bg-gradient-to-br dark:from-outer_space-500 dark:via-outer_space-500 dark:to-blue_munsell-950/20">
					<div className="flex items-center justify-between">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue_munsell-100 text-blue_munsell-500 shadow-inner dark:bg-blue_munsell-900/50 dark:text-blue_munsell-400">
							<FolderGit2 size={24} />
						</div>
						<span className="inline-flex items-center rounded-full bg-blue_munsell-50 px-2.5 py-0.5 text-xs font-semibold text-blue_munsell-600 dark:bg-blue_munsell-950/50 dark:text-blue_munsell-300">
							All Time
						</span>
					</div>
					<div className="mt-4">
						<h4 className="text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400">
							Total Projects
						</h4>
						<div className="mt-1 flex items-baseline gap-2">
							<span className="text-3xl font-extrabold tracking-tight text-outer_space-600 dark:text-platinum-200">
								{totalProjects}
							</span>
							<span className="text-xs text-payne's_gray-400 dark:text-french_gray-500">
								across workspace
							</span>
						</div>
					</div>
					<div className="mt-3 flex items-center gap-1.5 text-xs text-payne's_gray-400 dark:text-french_gray-400">
						<Layers size={13} />
						<span>Includes personal & team boards</span>
					</div>
				</div>

				{/* Pending Projects Card */}
				<div className="group relative overflow-hidden rounded-2xl border border-french_gray-300/70 bg-gradient-to-br from-white via-white to-amber-50/30 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-payne's_gray-400/50 dark:bg-gradient-to-br dark:from-outer_space-500 dark:via-outer_space-500 dark:to-amber-950/20">
					<div className="flex items-center justify-between">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-100 text-amber-600 shadow-inner dark:bg-amber-900/40 dark:text-amber-400">
							<Clock size={24} />
						</div>
						<span className="inline-flex items-center gap-1.5 rounded-full bg-amber-50 px-2.5 py-0.5 text-xs font-semibold text-amber-700 dark:bg-amber-950/50 dark:text-amber-300">
							<span className="h-1.5 w-1.5 animate-ping rounded-full bg-amber-500" />
							Active
						</span>
					</div>
					<div className="mt-4">
						<h4 className="text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400">
							Pending Projects
						</h4>
						<div className="mt-1 flex items-baseline gap-2">
							<span className="text-3xl font-extrabold tracking-tight text-outer_space-600 dark:text-platinum-200">
								{pendingProjects}
							</span>
							<span className="text-xs text-payne's_gray-400 dark:text-french_gray-500">
								in progress
							</span>
						</div>
					</div>
					<div className="mt-3 flex items-center gap-1.5 text-xs text-amber-600/90 dark:text-amber-400/90">
						<TrendingUp size={13} />
						<span>
							{totalProjects > 0
								? `${Math.round((pendingProjects / totalProjects) * 100)}% of total active load`
								: "No active projects"}
						</span>
					</div>
				</div>

				{/* Ended Projects Card */}
				<div className="group relative overflow-hidden rounded-2xl border border-french_gray-300/70 bg-gradient-to-br from-white via-white to-emerald-50/30 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-payne's_gray-400/50 dark:bg-gradient-to-br dark:from-outer_space-500 dark:via-outer_space-500 dark:to-emerald-950/20">
					<div className="flex items-center justify-between">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 shadow-inner dark:bg-emerald-900/40 dark:text-emerald-400">
							<CheckCircle2 size={24} />
						</div>
						<span className="inline-flex items-center rounded-full bg-emerald-50 px-2.5 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/50 dark:text-emerald-300">
							{completionRate}% rate
						</span>
					</div>
					<div className="mt-4">
						<h4 className="text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400">
							Ended Projects
						</h4>
						<div className="mt-1 flex items-baseline gap-2">
							<span className="text-3xl font-extrabold tracking-tight text-outer_space-600 dark:text-platinum-200">
								{endedProjects}
							</span>
							<span className="text-xs text-payne's_gray-400 dark:text-french_gray-500">
								finished / archived
							</span>
						</div>
					</div>
					<div className="mt-3 flex items-center gap-1.5 text-xs text-emerald-600/90 dark:text-emerald-400/90">
						<Sparkles size={13} />
						<span>Successfully delivered milestones</span>
					</div>
				</div>

				{/* Archived Projects Card */}
				<div className="group relative overflow-hidden rounded-2xl border border-french_gray-300/70 bg-gradient-to-br from-white via-white to-slate-50/30 p-6 shadow-sm transition-all duration-300 hover:-translate-y-0.5 hover:shadow-md dark:border-payne's_gray-400/50 dark:bg-gradient-to-br dark:from-outer_space-500 dark:via-outer_space-500 dark:to-slate-900/20">
					<div className="flex items-center justify-between">
						<div className="flex h-12 w-12 items-center justify-center rounded-xl bg-slate-100 text-slate-600 shadow-inner dark:bg-slate-800/40 dark:text-slate-400">
							<Archive size={24} />
						</div>
						<span className="inline-flex items-center rounded-full bg-slate-50 px-2.5 py-0.5 text-xs font-semibold text-slate-700 dark:bg-slate-900/50 dark:text-slate-300">
							History
						</span>
					</div>
					<div className="mt-4">
						<h4 className="text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400">
							Archived Projects
						</h4>
						<div className="mt-1 flex items-baseline gap-2">
							<span className="text-3xl font-extrabold tracking-tight text-outer_space-600 dark:text-platinum-200">
								{archivedProjects}
							</span>
							<span className="text-xs text-payne's_gray-400 dark:text-french_gray-500">
								moved to vault
							</span>
						</div>
					</div>
					<div className="mt-3 flex items-center gap-1.5 text-xs text-slate-600/90 dark:text-slate-400/90">
						<Layers size={13} />
						<span>Kept for reference</span>
					</div>
				</div>
			</div>

			{/* ─── 2. LEADERBOARDS (TOP TEAMS & MEMBERS) ────────────────────────── */}
			<div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-2">
				{/* Top Teams by Project Count */}
				<div className="flex flex-col rounded-2xl border border-french_gray-300/70 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-payne's_gray-400/50 dark:bg-outer_space-500">
					<div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
						<div className="flex items-center gap-2.5 min-w-0">
							<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-amber-600 dark:bg-amber-900/30 dark:text-amber-400">
								<Trophy size={18} />
							</div>
							<div className="min-w-0">
								<h3 className="truncate font-bold text-outer_space-600 dark:text-platinum-200">
									Top Teams
								</h3>
								<p className="truncate text-xs text-payne's_gray-400 dark:text-french_gray-400">
									By project volume
								</p>
							</div>
						</div>
						<Link
							href="/team?tab=teams"
							className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-french_gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-outer_space-600 shadow-sm transition-all hover:bg-platinum-100 hover:text-blue_munsell-500 dark:border-payne's_gray-400 dark:bg-outer_space-400 dark:text-platinum-200 dark:hover:bg-outer_space-300 dark:hover:text-blue_munsell-400"
						>
							<span>View All</span>
							<ArrowRight size={13} />
						</Link>
					</div>

					{topTeams.length === 0 ? (
						<div className="flex h-44 flex-col items-center justify-center rounded-xl border border-dashed border-french_gray-300 p-4 text-center dark:border-payne's_gray-400">
							<Users className="mb-2 h-8 w-8 text-payne's_gray-400 dark:text-french_gray-500" />
							<p className="text-xs text-payne's_gray-500 dark:text-french_gray-400">
								No teams created yet.
							</p>
						</div>
					) : (
						<div className="space-y-2.5">
							{topTeams.map((t, idx) => {
								const rankColors = [
									"bg-amber-100 text-amber-800 font-bold border border-amber-300 dark:bg-amber-950/60 dark:text-amber-300 dark:border-amber-700/50",
									"bg-slate-100 text-slate-800 font-bold border border-slate-300 dark:bg-slate-800 dark:text-slate-200 dark:border-slate-600",
									"bg-orange-100 text-orange-800 font-bold border border-orange-300 dark:bg-orange-950/60 dark:text-orange-300 dark:border-orange-700/50",
									"bg-gray-100 text-gray-700 font-semibold border border-gray-200 dark:bg-outer_space-400 dark:text-platinum-300 dark:border-payne's_gray-400/40",
									"bg-gray-100 text-gray-700 font-semibold border border-gray-200 dark:bg-outer_space-400 dark:text-platinum-300 dark:border-payne's_gray-400/40",
								];
								return (
									<div
										key={t.id}
										className="group flex items-center justify-between rounded-xl border border-french_gray-200 bg-french_gray-50/60 p-2.5 transition-all hover:bg-white hover:shadow-sm dark:border-payne's_gray-400/40 dark:bg-outer_space-400/40 dark:hover:bg-outer_space-400"
									>
										<div className="flex items-center gap-2.5 min-w-0">
											<span
												className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[11px] ${
													rankColors[idx] ||
													"bg-gray-100 text-gray-700 dark:bg-outer_space-400 dark:text-platinum-200"
												}`}
											>
												#{idx + 1}
											</span>
											<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-white text-sm shadow-sm ring-1 ring-black/5 dark:bg-outer_space-500">
												{t.icon || "🚀"}
											</div>
											<div className="min-w-0 truncate">
												<h4 className="truncate text-xs font-bold text-outer_space-600 group-hover:text-blue_munsell-500 transition-colors dark:text-platinum-200 dark:group-hover:text-blue_munsell-400">
													{t.name}
												</h4>
												<p className="text-[11px] text-payne's_gray-400 dark:text-french_gray-400">
													{t.memberCount}{" "}
													{t.memberCount === 1 ? "member" : "members"}
												</p>
											</div>
										</div>
										<div className="shrink-0 text-right">
											<span className="inline-flex items-center rounded-full bg-blue_munsell-100 px-2.5 py-0.5 text-xs font-bold text-blue_munsell-600 dark:bg-blue_munsell-950/60 dark:text-blue_munsell-300">
												{t.projectCount}{" "}
												{t.projectCount === 1 ? "proj" : "projs"}
											</span>
										</div>
									</div>
								);
							})}
						</div>
					)}
				</div>

				{/* Top 5 Users / Members by Project Count */}
				<div className="flex flex-col rounded-2xl border border-french_gray-300/70 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-payne's_gray-400/50 dark:bg-outer_space-500">
					<div className="mb-5 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
						<div className="flex items-center gap-2.5 min-w-0">
							<div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue_munsell-100 text-blue_munsell-500 dark:bg-blue_munsell-900/30 dark:text-blue_munsell-400">
								<Medal size={18} />
							</div>
							<div className="min-w-0">
								<h3 className="truncate font-bold text-outer_space-600 dark:text-platinum-200">
									Top Members
								</h3>
								<p className="truncate text-xs text-payne's_gray-400 dark:text-french_gray-400">
									Most involved in projects
								</p>
							</div>
						</div>
						<Link
							href="/team?tab=people"
							className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-french_gray-300 bg-white px-3 py-1.5 text-xs font-semibold text-outer_space-600 shadow-sm transition-all hover:bg-platinum-100 hover:text-blue_munsell-500 dark:border-payne's_gray-400 dark:bg-outer_space-400 dark:text-platinum-200 dark:hover:bg-outer_space-300 dark:hover:text-blue_munsell-400"
						>
							<span>View All</span>
							<ArrowRight size={13} />
						</Link>
					</div>

					{topMembers.length === 0 ? (
						<div className="flex h-44 flex-col items-center justify-center rounded-xl border border-dashed border-french_gray-300 p-4 text-center dark:border-payne's_gray-400">
							<Users className="mb-2 h-8 w-8 text-payne's_gray-400 dark:text-french_gray-500" />
							<p className="text-xs text-payne's_gray-500 dark:text-french_gray-400">
								No members found.
							</p>
						</div>
					) : (
						<div className="space-y-2.5">
							{topMembers.map((m, idx) => (
								<div
									key={m.id}
									className="flex items-center justify-between rounded-xl border border-french_gray-200 bg-french_gray-50/60 p-2.5 transition-all hover:bg-white hover:shadow-sm dark:border-payne's_gray-400/30 dark:bg-outer_space-400/30 dark:hover:bg-outer_space-400/70"
								>
									<div className="flex items-center gap-2.5 min-w-0">
										<span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-french_gray-200 text-[11px] font-bold text-outer_space-600 dark:bg-outer_space-300 dark:text-platinum-200">
											{idx + 1}
										</span>
										<div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-blue_munsell-500 to-indigo-600 text-xs font-bold text-white shadow-sm uppercase">
											{m.name ? m.name.charAt(0) : "U"}
										</div>
										<div className="min-w-0 truncate">
											<h4 className="truncate text-xs font-bold text-outer_space-600 dark:text-platinum-200">
												{m.name}
											</h4>
											<p className="truncate text-[11px] text-payne's_gray-400 dark:text-french_gray-400">
												{m.role || m.email}
											</p>
										</div>
									</div>
									<div className="shrink-0 text-right">
										<span className="inline-flex items-center rounded-md bg-blue_munsell-50 px-2 py-0.5 text-xs font-bold text-blue_munsell-600 border border-blue_munsell-200/50 dark:bg-outer_space-300 dark:text-platinum-200 dark:border-transparent">
											{m.projectCount} {m.projectCount === 1 ? "proj" : "projs"}
										</span>
									</div>
								</div>
							))}
						</div>
					)}
				</div>
			</div>

			{/* ─── 3. RECENT PROJECTS (NEXT LINE / FULL WIDTH ROW) ──────────────── */}
			<div className="rounded-2xl border border-french_gray-300/70 bg-white p-6 shadow-sm transition-all hover:shadow-md dark:border-payne's_gray-400/50 dark:bg-outer_space-500">
				<div className="mb-6 flex flex-wrap items-center justify-between gap-3">
					<div className="flex items-center gap-2.5 min-w-0">
						<div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-emerald-100 text-emerald-600 dark:bg-emerald-900/30 dark:text-emerald-400">
							<FolderPlus size={20} />
						</div>
						<div>
							<h3 className="text-base font-bold text-outer_space-600 dark:text-platinum-200">
								Recent Projects
							</h3>
							<p className="text-xs text-payne's_gray-400 dark:text-french_gray-400">
								Latest 5 active workspace projects and task completion progress
							</p>
						</div>
					</div>

					<div className="flex items-center gap-3">
						<Link
							href="/projects"
							className="inline-flex items-center gap-1.5 rounded-xl border border-french_gray-300 bg-white px-3.5 py-2 text-xs font-semibold text-outer_space-600 shadow-sm transition-all hover:bg-platinum-100 hover:text-blue_munsell-500 dark:border-payne's_gray-400 dark:bg-outer_space-400 dark:text-platinum-200 dark:hover:bg-outer_space-300 dark:hover:text-blue_munsell-400"
						>
							<span>View All</span>
							<ArrowRight size={14} />
						</Link>

						{/* Add Project Button on Header */}
						<button
							type="button"
							onClick={handleOpen}
							className="inline-flex items-center gap-1.5 rounded-xl bg-[#1e9b65] px-4 py-2 text-xs font-bold text-white shadow-sm transition-all hover:opacity-90 active:scale-95"
						>
							<Plus size={16} />
							<span>Add Project</span>
						</button>
					</div>
				</div>

				{recentProjects.length === 0 ? (
					<div className="flex h-44 flex-col items-center justify-center rounded-xl border border-dashed border-french_gray-300 p-6 text-center dark:border-payne's_gray-400">
						<FolderGit2 className="mb-2 h-10 w-10 text-payne's_gray-400 dark:text-french_gray-500" />
						<p className="text-sm font-medium text-payne's_gray-500 dark:text-french_gray-400">
							No projects created yet.
						</p>
						<button
							type="button"
							onClick={handleOpen}
							className="mt-3 text-xs font-bold text-[#1e9b65] hover:underline"
						>
							+ Create your first project
						</button>
					</div>
				) : (
					<div className="flex flex-col gap-3">
						{recentProjects.map((p) => {
							const isFinished = p.status === "finished";
							return (
								<Link
									key={p.id}
									href={`/projects/${p.id}`}
									className="group flex flex-col sm:flex-row sm:items-center justify-between gap-4 rounded-xl border border-french_gray-200 bg-french_gray-50/60 p-4 transition-all hover:border-blue_munsell-300 hover:bg-white hover:shadow-md dark:border-payne's_gray-400/40 dark:bg-outer_space-400/40 dark:hover:border-blue_munsell-500/40 dark:hover:bg-outer_space-400"
								>
									<div className="flex-1 min-w-0">
										<div className="flex items-center gap-2 mb-1.5">
											<span className="truncate rounded-md bg-white px-2 py-0.5 text-[10px] font-semibold text-payne's_gray-500 border border-french_gray-200 dark:bg-outer_space-500/70 dark:text-french_gray-300 dark:border-transparent">
												{p.teamName || "Personal"}
											</span>
											<span
												className={`shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold ${
													isFinished
														? "bg-emerald-100 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300"
														: "bg-blue_munsell-100 text-blue_munsell-600 dark:bg-blue_munsell-950/60 dark:text-blue_munsell-300"
												}`}
											>
												{isFinished ? "Finished" : "In Progress"}
											</span>
										</div>

										<h4 className="text-sm font-bold text-outer_space-600 group-hover:text-blue_munsell-500 transition-colors truncate dark:text-platinum-200 dark:group-hover:text-blue_munsell-400">
											{p.name}
										</h4>
										{p.description && (
											<p className="mt-0.5 truncate text-xs text-payne's_gray-400 dark:text-french_gray-400">
												{p.description}
											</p>
										)}
									</div>

									<div className="flex shrink-0 flex-col sm:items-end gap-2 sm:w-48">
										<div className="flex items-center justify-between sm:justify-end gap-4 text-[11px] text-payne's_gray-400 dark:text-french_gray-400 w-full">
											<span className="flex items-center gap-1">
												<Calendar size={11} />
												{new Date(p.dueDate).toLocaleDateString(undefined, {
													month: "short",
													day: "numeric",
												})}
											</span>
											<span className="font-semibold text-outer_space-600 dark:text-platinum-200">
												{p.progressPercent}%
											</span>
										</div>
										<div className="h-1.5 w-full overflow-hidden rounded-full bg-french_gray-200 dark:bg-payne's_gray-400">
											<div
												className={`h-full rounded-full transition-all duration-500 ${
													isFinished ? "bg-emerald-500" : "bg-blue_munsell-500"
												}`}
												style={{ width: `${p.progressPercent}%` }}
											/>
										</div>
									</div>
								</Link>
							);
						})}
					</div>
				)}
			</div>

			{/* ─── 3. ACCURATE GRAPHS & VISUALIZATIONS (RECHARTS) ────────────────── */}
			<div className="space-y-6">
				<div className="flex items-center justify-between">
					<div>
						<h2 className="text-lg font-bold text-outer_space-600 dark:text-platinum-200">
							Workspace Analytics & Visualizations
						</h2>
						<p className="text-xs text-payne's_gray-400 dark:text-french_gray-400">
							Data-driven metrics calculated across all your project boards and
							tasks
						</p>
					</div>
				</div>

				<div className="grid grid-cols-1 gap-6 lg:grid-cols-12">
					{/* Donut Chart: Project Status Distribution (4 cols) */}
					<div className="flex flex-col justify-between rounded-2xl border border-french_gray-300/70 bg-white p-6 shadow-sm dark:border-payne's_gray-400/50 dark:bg-outer_space-500 lg:col-span-4">
						<div>
							<div className="mb-4 flex items-center justify-between">
								<div className="flex items-center gap-2">
									<PieChartIcon
										size={18}
										className="text-blue_munsell-500 dark:text-blue_munsell-400"
									/>
									<h3 className="font-bold text-outer_space-600 dark:text-platinum-200">
										Project Status Breakdown
									</h3>
								</div>
								<span className="text-xs font-semibold text-payne's_gray-400 dark:text-french_gray-400">
									{totalProjects} Total
								</span>
							</div>

							{totalProjects === 0 ? (
								<div className="flex h-56 flex-col items-center justify-center text-center">
									<PieChartIcon className="mb-2 h-10 w-10 text-payne's_gray-400 dark:text-french_gray-500" />
									<p className="text-xs text-payne's_gray-500 dark:text-french_gray-400">
										No project status data available.
									</p>
								</div>
							) : (
								<>
									<div className="relative h-56 w-full">
										<ResponsiveContainer width="100%" height="100%">
											<PieChart>
												<Pie
													data={statusDistribution.filter((d) => d.count > 0)}
													cx="50%"
													cy="50%"
													innerRadius={55}
													outerRadius={80}
													paddingAngle={4}
													dataKey="count"
												>
													{statusDistribution.map((entry) => (
														<Cell
															key={`cell-status-${entry.key}`}
															fill={entry.color}
															stroke="transparent"
														/>
													))}
												</Pie>
												<Tooltip content={<CustomPieTooltip />} />
											</PieChart>
										</ResponsiveContainer>
										{/* Center stats in donut */}
										<div className="pointer-events-none absolute inset-0 flex flex-col items-center justify-center">
											<span className="text-2xl font-extrabold text-outer_space-600 dark:text-platinum-200">
												{totalProjects}
											</span>
											<span className="text-[10px] font-medium text-payne's_gray-400 uppercase tracking-wider">
												Projects
											</span>
										</div>
									</div>

									{/* Status Badges Legend */}
									<div className="mt-4 grid grid-cols-3 gap-2 text-center">
										{statusDistribution.map((s) => (
											<div
												key={s.key}
												className="rounded-xl border border-french_gray-200 bg-french_gray-50/70 p-2 dark:border-payne's_gray-400/30 dark:bg-outer_space-400/40"
											>
												<div className="flex items-center justify-center gap-1.5">
													<span
														className="h-2 w-2 rounded-full"
														style={{ backgroundColor: s.color }}
													/>
													<span className="text-[11px] font-medium text-payne's_gray-500 dark:text-french_gray-400 truncate">
														{s.name}
													</span>
												</div>
												<p className="mt-1 text-sm font-bold text-outer_space-600 dark:text-platinum-200">
													{s.count}
												</p>
											</div>
										))}
									</div>
								</>
							)}
						</div>
					</div>

					{/* Area Chart: 6-Month Velocity & Activity Trends (8 cols) */}
					<div className="flex flex-col justify-between rounded-2xl border border-french_gray-300/70 bg-white p-6 shadow-sm dark:border-payne's_gray-400/50 dark:bg-outer_space-500 lg:col-span-8">
						<div>
							<div className="mb-4 flex flex-wrap items-center justify-between gap-2">
								<div className="flex items-center gap-2">
									<TrendingUp
										size={18}
										className="text-emerald-500 dark:text-emerald-400"
									/>
									<h3 className="font-bold text-outer_space-600 dark:text-platinum-200">
										Activity & Velocity Trends
									</h3>
								</div>
								<div className="flex items-center gap-4 text-xs">
									<div className="flex items-center gap-1.5">
										<span className="h-2.5 w-2.5 rounded-full bg-blue_munsell-500" />
										<span className="text-payne's_gray-500 dark:text-french_gray-400">
											Projects Created
										</span>
									</div>
									<div className="flex items-center gap-1.5">
										<span className="h-2.5 w-2.5 rounded-full bg-emerald-500" />
										<span className="text-payne's_gray-500 dark:text-french_gray-400">
											Tasks Completed
										</span>
									</div>
								</div>
							</div>

							<div className="h-64 w-full">
								<ResponsiveContainer width="100%" height="100%">
									<AreaChart
										data={monthlyTrends}
										margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
									>
										<defs>
											<linearGradient
												id="colorProjects"
												x1="0"
												y1="0"
												x2="0"
												y2="1"
											>
												<stop
													offset="5%"
													stopColor="#0ea5e9"
													stopOpacity={0.4}
												/>
												<stop
													offset="95%"
													stopColor="#0ea5e9"
													stopOpacity={0.0}
												/>
											</linearGradient>
											<linearGradient
												id="colorTasks"
												x1="0"
												y1="0"
												x2="0"
												y2="1"
											>
												<stop
													offset="5%"
													stopColor="#10b981"
													stopOpacity={0.4}
												/>
												<stop
													offset="95%"
													stopColor="#10b981"
													stopOpacity={0.0}
												/>
											</linearGradient>
										</defs>
										<CartesianGrid
											strokeDasharray="3 3"
											className="stroke-french_gray-200 dark:stroke-payne's_gray-500/30"
											vertical={false}
										/>
										<XAxis
											dataKey="month"
											tickLine={false}
											axisLine={false}
											className="text-[11px] fill-payne's_gray-400 dark:fill-french_gray-400"
										/>
										<YAxis
											allowDecimals={false}
											tickLine={false}
											axisLine={false}
											className="text-[11px] fill-payne's_gray-400 dark:fill-french_gray-400"
										/>
										<Tooltip content={<CustomChartTooltip />} />
										<Area
											type="monotone"
											dataKey="createdProjects"
											name="Projects Created"
											stroke="#0ea5e9"
											strokeWidth={2}
											fillOpacity={1}
											fill="url(#colorProjects)"
										/>
										<Area
											type="monotone"
											dataKey="tasksDone"
											name="Tasks Completed"
											stroke="#10b981"
											strokeWidth={2}
											fillOpacity={1}
											fill="url(#colorTasks)"
										/>
									</AreaChart>
								</ResponsiveContainer>
							</div>
						</div>
					</div>

					{/* Bar Chart: Task Priority Distribution (12 cols or full row) */}
					<div className="rounded-2xl border border-french_gray-300/70 bg-white p-6 shadow-sm dark:border-payne's_gray-400/50 dark:bg-outer_space-500 lg:col-span-12">
						<div className="mb-4 flex flex-wrap items-center justify-between gap-2">
							<div className="flex items-center gap-2">
								<BarChart3
									size={18}
									className="text-amber-500 dark:text-amber-400"
								/>
								<h3 className="font-bold text-outer_space-600 dark:text-platinum-200">
									Task Workload by Priority
								</h3>
							</div>
							<p className="text-xs text-payne's_gray-400 dark:text-french_gray-400">
								Total active tasks sorted by urgency level across all projects
							</p>
						</div>

						<div className="h-56 w-full">
							<ResponsiveContainer width="100%" height="100%">
								<BarChart
									data={priorityDistribution}
									margin={{ top: 10, right: 10, left: -20, bottom: 0 }}
								>
									<CartesianGrid
										strokeDasharray="3 3"
										className="stroke-french_gray-200 dark:stroke-payne's_gray-500/30"
										vertical={false}
									/>
									<XAxis
										dataKey="priority"
										tickLine={false}
										axisLine={false}
										className="text-[11px] fill-payne's_gray-400 dark:fill-french_gray-400 font-semibold"
									/>
									<YAxis
										allowDecimals={false}
										tickLine={false}
										axisLine={false}
										className="text-[11px] fill-payne's_gray-400 dark:fill-french_gray-400"
									/>
									<Tooltip content={<CustomChartTooltip />} />
									<Bar
										dataKey="count"
										name="Tasks"
										radius={[8, 8, 0, 0]}
										maxBarSize={48}
									>
										{priorityDistribution.map((entry) => (
											<Cell
												key={`bar-priority-${entry.priority}`}
												fill={entry.color}
											/>
										))}
									</Bar>
								</BarChart>
							</ResponsiveContainer>
						</div>
					</div>
				</div>
			</div>

			{/* ─── MODALS CONTAINER FOR "ADD PROJECT" ACTION ─────────────────────── */}
			{modalStep !== "closed" && (
				<>
					<CreateProject1
						opened={modalStep === "step1"}
						onClose={handleClose}
						projectName={projectName}
						setProjectName={setProjectName}
						description={description}
						setDescription={setDescription}
						access={access}
						setAccess={setAccess}
						team={team}
						setTeam={setTeam}
						dueDate={dueDate}
						setDueDate={setDueDate}
						onNext={handleNext}
					/>

					<CreateProject2
						opened={modalStep === "step2"}
						onClose={handleClose}
						onBack={handleBack}
						onCreate={onProjectCreated}
					/>
				</>
			)}
		</div>
	);
}
