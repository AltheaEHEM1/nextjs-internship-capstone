"use client";

import {
	Activity,
	CheckCircle2,
	Clock,
	Layers,
	ListTodo,
	ShieldCheck,
	Sparkles,
	Zap,
} from "lucide-react";

export function Features() {
	return (
		<section className="flex-1 flex flex-col justify-center relative py-16 sm:py-24 lg:py-28 px-4 sm:px-6 lg:px-8 bg-slate-950 text-slate-100 overflow-hidden font-sans">
			{/* Background Radial Glow */}
			<div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[320px] h-[320px] sm:w-[600px] sm:h-[600px] bg-indigo-600/15 rounded-full blur-[100px] sm:blur-[140px] pointer-events-none" />

			<div className="max-w-7xl mx-auto relative z-10">
				{/* Header */}
				<div className="flex flex-col md:flex-row md:items-end justify-between mb-10 sm:mb-16 gap-6">
					<div>
						<div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-semibold uppercase tracking-wider mb-4">
							<Sparkles className="w-3.5 h-3.5 text-indigo-400 shrink-0" />
							Architecture Overview
						</div>
						<h2 className="text-3xl sm:text-5xl font-black tracking-tight text-white leading-tight">
							Built for precision. <br />
							<span className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
								Engineered for speed.
							</span>
						</h2>
					</div>

					<div className="flex items-center gap-3 px-4 py-3 rounded-xl bg-slate-900/80 border border-slate-800 backdrop-blur-md self-start md:self-auto">
						<Activity className="w-4 h-4 text-emerald-400 animate-pulse shrink-0" />
						<span className="text-xs font-medium text-slate-300">
							System Health:{" "}
							<strong className="text-emerald-400 font-bold">99.99%</strong>
						</span>
					</div>
				</div>

				{/* Bento Grid */}
				<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-4 sm:gap-6">
					{/* Core (Featured Large Card) */}
					<div className="lg:col-span-8 bg-slate-900/50 border border-slate-800 hover:border-indigo-500/50 transition-all rounded-3xl p-5 sm:p-8 flex flex-col justify-between backdrop-blur-md relative overflow-hidden group">
						<div className="absolute top-0 right-0 p-8 opacity-10 group-hover:opacity-20 transition-opacity hidden sm:block">
							<ListTodo className="w-48 h-48 text-indigo-500" />
						</div>

						<div>
							<div className="flex flex-wrap items-center justify-between gap-2 mb-6">
								<span className="px-3 py-1 rounded-md bg-indigo-500/10 border border-indigo-500/20 text-indigo-400 text-xs font-bold">
									Module 01 • Core Engine
								</span>
								<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
									<span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
									Live & Active
								</span>
							</div>

							<h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
								Core Workflow Engine
							</h3>
							<p className="text-slate-400 text-xs sm:text-sm max-w-xl mb-6 sm:mb-8">
								The primary operations layer handling state persistence, project
								lifecycles, kanban views, and assignment indexing.
							</p>

							{/* Metrics */}
							<div className="grid grid-cols-2 gap-3 sm:gap-4 mb-6 sm:mb-8 max-w-md">
								<div className="bg-slate-950/60 border border-slate-800 p-3 sm:p-4 rounded-xl">
									<span className="text-xs text-slate-500 block">
										Data Latency
									</span>
									<span className="text-lg sm:text-xl font-bold text-white">
										&lt; 45ms
									</span>
								</div>
								<div className="bg-slate-950/60 border border-slate-800 p-3 sm:p-4 rounded-xl">
									<span className="text-xs text-slate-500 block">
										State Sync
									</span>
									<span className="text-lg sm:text-xl font-bold text-white">
										Realtime
									</span>
								</div>
							</div>
						</div>

						{/* Checklist */}
						<div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-6 border-t border-slate-800/80">
							{[
								"User auth & protected routes",
								"Project CRUD engine",
								"Interactive Kanban board",
								"Priority scoring & due dates",
								"Activity audit history",
								"Multi-attribute global fuzzy search",
							].map((feat) => (
								<div
									key={feat}
									className="flex items-center gap-2 text-xs text-slate-300"
								>
									<CheckCircle2 className="w-4 h-4 text-indigo-400 shrink-0" />
									<span>{feat}</span>
								</div>
							))}
						</div>
					</div>

					{/* Team Controls */}
					<div className="lg:col-span-4 bg-slate-900/50 border border-slate-800 hover:border-amber-500/50 transition-all rounded-3xl p-5 sm:p-8 flex flex-col justify-between backdrop-blur-md">
						<div>
							<div className="flex items-center justify-between mb-6 gap-2">
								<span className="px-3 py-1 rounded-md bg-amber-500/10 border border-amber-500/20 text-amber-400 text-xs font-bold">
									Module 02
								</span>
								<span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20">
									In Development
								</span>
							</div>

							<div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-amber-400 flex items-center justify-center mb-4">
								<Layers className="w-5 h-5 sm:w-6 sm:h-6" />
							</div>

							<h3 className="text-lg sm:text-xl font-bold text-white mb-2">
								Team & Workspace Controls
							</h3>
							<p className="text-slate-400 text-xs sm:text-sm mb-6">
								Manage enterprise permissions, team roles, and multi-tenant
								notification pipelines.
							</p>
						</div>

						<div className="space-y-2 pt-6 border-t border-slate-800/80">
							{[
								"Team onboarding & invites",
								"RBAC (Admin, Member, Viewer)",
								"Automated workflow triggers",
								"Real-time notifications",
							].map((f) => (
								<div
									key={f}
									className="flex items-center gap-2 text-xs text-slate-300"
								>
									<CheckCircle2 className="w-3.5 h-3.5 text-amber-400 shrink-0" />
									<span>{f}</span>
								</div>
							))}
						</div>
					</div>

					{/* UX Layer */}
					<div className="lg:col-span-6 bg-slate-900/50 border border-slate-800 hover:border-emerald-500/50 transition-all rounded-3xl p-5 sm:p-8 backdrop-blur-md">
						<div className="flex items-center justify-between mb-6 gap-2">
							<div className="flex items-center gap-3">
								<div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 flex items-center justify-center shrink-0">
									<ShieldCheck className="w-5 h-5" />
								</div>
								<div>
									<span className="text-xs text-emerald-400 font-bold block">
										Module 03
									</span>
									<h3 className="text-base sm:text-lg font-bold text-white">
										UX Layer
									</h3>
								</div>
							</div>
							<span className="text-xs text-slate-400 font-mono shrink-0">
								FCP Speed: 0.2s
							</span>
						</div>

						<p className="text-slate-400 text-xs sm:text-sm mb-6">
							Designed to reduce friction with instantaneous transitions,
							persistent themes, and modal workflows.
						</p>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-300">
							<div>• Responsive layout system</div>
							<div>• Dark/Light system sync</div>
							<div>• Side-drawer management</div>
							<div>• Structural deep links</div>
						</div>
					</div>

					{/* Advanced Engine Roadmap */}
					<div className="lg:col-span-6 bg-slate-900/50 border border-slate-800 hover:border-slate-700 transition-all rounded-3xl p-5 sm:p-8 backdrop-blur-md">
						<div className="flex items-center justify-between mb-6 gap-2">
							<div className="flex items-center gap-3">
								<div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-slate-800 border border-slate-700 text-slate-400 flex items-center justify-center shrink-0">
									<Zap className="w-5 h-5" />
								</div>
								<div>
									<span className="text-xs text-slate-400 font-bold block">
										Module 04
									</span>
									<h3 className="text-base sm:text-lg font-bold text-white">
										Advanced Engine Roadmap
									</h3>
								</div>
							</div>
							<span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-800 text-slate-400 shrink-0">
								Target: Q4 2026
							</span>
						</div>

						<p className="text-slate-400 text-xs sm:text-sm mb-6">
							Future architectural enhancements focusing on WebSockets, hotkey
							execution, and optimistic UI.
						</p>

						<div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-slate-400">
							<div className="flex items-center gap-2">
								<Clock className="w-3.5 h-3.5 shrink-0" /> WebSocket multi-sync
							</div>
							<div className="flex items-center gap-2">
								<Clock className="w-3.5 h-3.5 shrink-0" /> Optimistic UI
								rendering
							</div>
							<div className="flex items-center gap-2">
								<Clock className="w-3.5 h-3.5 shrink-0" /> Power-user hotkeys
							</div>
							<div className="flex items-center gap-2">
								<Clock className="w-3.5 h-3.5 shrink-0" /> E2E test suite
							</div>
						</div>
					</div>
				</div>
			</div>
		</section>
	);
}

export default Features;
