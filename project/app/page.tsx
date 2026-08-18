import {
	ArrowRight,
	CheckCircle2,
	Flame,
	Kanban,
	Sparkles,
	Users,
} from "lucide-react";
import Link from "next/link";

export default function HomePage() {
	return (
		<div className="min-h-screen w-full max-w-full overflow-x-hidden bg-gradient-to-br from-platinum-900 to-platinum-800 dark:from-outer_space-500 dark:to-payne's_gray-500">
			<section className="relative px-4 py-12 sm:py-16 sm:px-6 lg:px-8 overflow-hidden bg-slate-50 text-slate-900 font-sans">
				{/* Subtle high-tech background grid */}
				<div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

				{/* Ambient soft glows */}
				<div className="absolute top-1/4 left-4 w-48 h-48 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none sm:left-10" />
				<div className="absolute bottom-10 right-4 w-48 h-48 sm:w-96 sm:h-96 bg-indigo-500/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none sm:right-10" />

				<div className="container relative z-10 mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-8 items-center">
					{/* LEFT COLUMN */}
					<div className="lg:col-span-6 text-left space-y-4 sm:space-y-6">
						{/* Top Badge */}
						<div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 shadow-sm backdrop-blur-md">
							<Sparkles size={15} className="text-cyan-600 shrink-0" />
							<span className="text-[10px] sm:text-xs font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent uppercase tracking-wider">
								Project Management System
							</span>
						</div>

						{/* Main Heading */}
						<h1 className="text-3xl font-black text-slate-900 sm:text-5xl lg:text-6xl tracking-tight leading-[1.15]">
							Manage Projects with{" "}
							<span className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent">
								Projectnify
							</span>
						</h1>

						{/* Subtitle */}
						<p className="text-sm sm:text-lg text-slate-600 max-w-xl leading-relaxed">
							Organize tasks, collaborate with your team, track progress, and
							deliver projects on time with our intuitive drag-and-drop
							Kanban-style platform.
						</p>

						{/* CTA Buttons */}
						<div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3 sm:gap-4 pt-2">
							<Link
								href="/sign-up"
								className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 px-6 sm:px-8 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-cyan-500/15 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-cyan-400/30 text-center"
							>
								Start Managing Projects
								<ArrowRight className="ml-2.5 shrink-0" size={18} />
							</Link>
						</div>
					</div>

					{/* --- RIGHT COLUMN: STACKED CARDS --- */}
					<div className="lg:col-span-6 relative flex items-center justify-center pt-4 lg:pt-0">
						<div className="relative w-full max-w-md flex flex-col gap-4 z-20">
							{/* Card 1: Kanban Feature */}
							<div className="w-full bg-white/80 p-4 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 group">
								<div className="flex items-center justify-between mb-3 gap-2">
									<div className="flex items-center gap-3">
										<div className="p-2 sm:p-2.5 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-600 shadow-inner shrink-0">
											<Kanban size={20} />
										</div>
										<div>
											<h3 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-emerald-600 transition-colors">
												Drag & Drop Boards
											</h3>
											<p className="text-[11px] text-slate-500 font-medium">
												Workflow Engine
											</p>
										</div>
									</div>
									<span className="text-[10px] font-bold text-emerald-700 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20 shrink-0">
										Active
									</span>
								</div>

								<div className="space-y-1.5 mb-3">
									<div className="flex justify-between text-xs text-slate-500 font-medium">
										<span>Sprint Progress</span>
										<span className="text-slate-900 font-bold">85%</span>
									</div>
									<div className="h-2 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200">
										<div className="h-full w-[85%] bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-full"></div>
									</div>
								</div>
								<p className="text-xs text-slate-600 leading-relaxed">
									Seamless workflow organization and rapid card reordering.
								</p>
							</div>

							{/* Card 2: Team Collaboration */}
							<div className="w-full bg-white/80 p-4 sm:p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 group">
								<div className="flex items-center justify-between mb-2 gap-2">
									<div className="flex items-center gap-3">
										<div className="p-2 sm:p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 shadow-inner shrink-0">
											<Users size={18} />
										</div>
										<div>
											<h4 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-cyan-600 transition-colors">
												Team Sync
											</h4>
											<p className="text-[10px] text-slate-500 font-medium">
												Real-time collaboration
											</p>
										</div>
									</div>
									<div className="flex -space-x-2 shrink-0">
										<div className="w-6 h-6 rounded-full bg-cyan-600 border-2 border-white text-[9px] font-bold text-white flex items-center justify-center shadow-sm">
											JD
										</div>
										<div className="w-6 h-6 rounded-full bg-indigo-600 border-2 border-white text-[9px] font-bold text-white flex items-center justify-center shadow-sm">
											AS
										</div>
										<div className="w-6 h-6 rounded-full bg-emerald-600 border-2 border-white text-[9px] font-bold text-white flex items-center justify-center shadow-sm">
											+2
										</div>
									</div>
								</div>
								<p className="text-xs text-slate-600 leading-relaxed">
									Work together effortlessly with live updates and team
									channels.
								</p>
							</div>

							{/* Card 3: Goal Tracking */}
							<div className="w-full bg-white/80 p-4 sm:p-5 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:border-slate-300 group">
								<div className="flex items-center justify-between mb-2 gap-2">
									<div className="flex items-center gap-3">
										<div className="p-2 sm:p-2.5 rounded-2xl bg-indigo-500/10 border border-indigo-500/20 text-indigo-600 shadow-inner shrink-0">
											<CheckCircle2 size={18} />
										</div>
										<div>
											<h5 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-indigo-600 transition-colors">
												Goal Tracking
											</h5>
											<p className="text-[10px] text-slate-500 font-medium">
												Milestones
											</p>
										</div>
									</div>
									<div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 shrink-0">
										<Flame size={13} className="text-amber-600" />
										<span>Streak</span>
									</div>
								</div>
								<p className="text-xs text-slate-600 leading-relaxed">
									Keep track of every objective efficiently and never miss
									deadlines.
								</p>
							</div>
						</div>
					</div>
				</div>
			</section>

			{/* Navigation Demo Section */}
			<section className="bg-white/50 px-4 py-12 sm:py-16 dark:bg-outer_space-400/50 sm:px-6 lg:px-8">
				<div className="container mx-auto text-center">
					<h2 className="mb-4 sm:mb-8 text-2xl sm:text-3xl font-bold text-outer_space-500 dark:text-platinum-500">
						🚀 Navigate the Mock Site
					</h2>
					<p className="mb-6 sm:mb-8 text-sm sm:text-lg text-payne's_gray-500 dark:text-french_gray-500">
						All pages are accessible without authentication for development
						purposes
					</p>

					<div className="mx-auto grid max-w-4xl grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
						<Link
							href="/dashboard"
							className="rounded-lg border border-french_gray-300 bg-white p-4 transition-shadow hover:shadow-lg dark:border-payne's_gray-400 dark:bg-outer_space-500"
						>
							<h3 className="mb-2 font-semibold text-outer_space-500 dark:text-platinum-500">
								Dashboard
							</h3>
							<p className="text-sm text-payne's_gray-500 dark:text-french_gray-400">
								Main dashboard view
							</p>
						</Link>

						<Link
							href="/projects"
							className="rounded-lg border border-french_gray-300 bg-white p-4 transition-shadow hover:shadow-lg dark:border-payne's_gray-400 dark:bg-outer_space-500"
						>
							<h3 className="mb-2 font-semibold text-outer_space-500 dark:text-platinum-500">
								Projects
							</h3>
							<p className="text-sm text-payne's_gray-500 dark:text-french_gray-400">
								Projects listing page
							</p>
						</Link>

						<Link
							href="/projects/1"
							className="rounded-lg border border-french_gray-300 bg-white p-4 transition-shadow hover:shadow-lg dark:border-payne's_gray-400 dark:bg-outer_space-500"
						>
							<h3 className="mb-2 font-semibold text-outer_space-500 dark:text-platinum-500">
								Kanban Board
							</h3>
							<p className="text-sm text-payne's_gray-500 dark:text-french_gray-400">
								Project board view
							</p>
						</Link>

						<Link
							href="/sign-in"
							className="rounded-lg border border-french_gray-300 bg-white p-4 transition-shadow hover:shadow-lg dark:border-payne's_gray-400 dark:bg-outer_space-500"
						>
							<h3 className="mb-2 font-semibold text-outer_space-500 dark:text-platinum-500">
								Auth Pages
							</h3>
							<p className="text-sm text-payne's_gray-500 dark:text-french_gray-400">
								Sign in/up placeholders
							</p>
						</Link>
					</div>
				</div>
			</section>

			{/* Task Implementation Status */}
			<section className="px-4 py-12 sm:py-16 sm:px-6 lg:px-8">
				<div className="container mx-auto">
					<h2 className="mb-8 sm:mb-12 text-center text-2xl sm:text-3xl font-bold text-outer_space-500 dark:text-platinum-500">
						Implementation Roadmap
					</h2>

					<div className="grid grid-cols-1 gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-4">
						{[
							{
								phase: "1.0",
								title: "Project Setup",
								status: "pending",
								tasks: 6,
							},
							{
								phase: "2.0",
								title: "Authentication",
								status: "pending",
								tasks: 6,
							},
							{
								phase: "3.0",
								title: "Database Setup",
								status: "pending",
								tasks: 6,
							},
							{
								phase: "4.0",
								title: "Core Features",
								status: "pending",
								tasks: 6,
							},
							{
								phase: "5.0",
								title: "Kanban Board",
								status: "pending",
								tasks: 6,
							},
							{
								phase: "6.0",
								title: "Advanced Features",
								status: "pending",
								tasks: 6,
							},
							{ phase: "7.0", title: "Testing", status: "pending", tasks: 6 },
							{
								phase: "8.0",
								title: "Deployment",
								status: "pending",
								tasks: 6,
							},
						].map((item) => (
							<div
								key={item.phase}
								className="rounded-lg border border-french_gray-300 bg-white p-6 dark:border-payne's_gray-400 dark:bg-outer_space-500"
							>
								<div className="mb-2 text-sm font-semibold text-blue_munsell-500">
									Phase {item.phase}
								</div>
								<h3 className="mb-2 font-semibold text-outer_space-500 dark:text-platinum-500">
									{item.title}
								</h3>
								<div className="mb-3 text-sm text-payne's_gray-500 dark:text-french_gray-400">
									{item.tasks} tasks
								</div>
								<div className="flex items-center">
									<div className="mr-2 h-2 w-2 rounded-full bg-yellow-500"></div>
									<span className="text-sm capitalize text-payne's_gray-500 dark:text-french_gray-400">
										{item.status}
									</span>
								</div>
							</div>
						))}
					</div>
				</div>
			</section>
		</div>
	);
}
