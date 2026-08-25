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
		<section className="flex-1 flex flex-col justify-center relative px-4 py-12 sm:py-16 sm:px-6 lg:px-8 overflow-hidden bg-slate-50 text-slate-900 font-sans">
			{/* Subtle high-tech background grid */}
			<div className="absolute inset-0 bg-[radial-gradient(#cbd5e1_1px,transparent_1px)] [background-size:24px_24px] opacity-60 pointer-events-none" />

			{/* Ambient soft glows */}
			<div className="absolute top-1/4 left-4 w-48 h-48 sm:w-96 sm:h-96 bg-cyan-500/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none sm:left-10" />
			<div className="absolute bottom-10 right-4 w-48 h-48 sm:w-96 sm:h-96 bg-indigo-500/10 rounded-full blur-[80px] sm:blur-[100px] pointer-events-none sm:right-10" />

			<div className="container relative z-10 mx-auto flex flex-col items-center justify-center gap-12 lg:gap-16 pt-8">
				{/* TOP COLUMN: TEXT */}
				<div className="w-full max-w-4xl text-center flex flex-col items-center space-y-4 sm:space-y-6">
					{/* Top Badge */}
					<div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 shadow-sm backdrop-blur-md">
						<Sparkles size={15} className="text-cyan-600 shrink-0" />
						<span className="text-[10px] sm:text-xs font-bold bg-gradient-to-r from-cyan-600 to-indigo-600 bg-clip-text text-transparent uppercase tracking-wider">
							Project Management System
						</span>
					</div>

					{/* Main Heading */}
					<h1 className="text-4xl font-black text-slate-900 sm:text-5xl lg:text-7xl tracking-tight leading-[1.15]">
						Manage Projects with{" "}
						<span className="bg-gradient-to-r from-emerald-600 via-cyan-600 to-indigo-600 bg-clip-text text-transparent block sm:inline">
							Projectnify
						</span>
					</h1>

					{/* Subtitle */}
					<p className="text-sm sm:text-lg text-slate-600 max-w-2xl mx-auto leading-relaxed">
						Organize tasks, collaborate with your team, track progress, and
						deliver projects on time with our intuitive drag-and-drop
						Kanban-style platform.
					</p>

					{/* CTA Buttons */}
					<div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4 pt-4">
						<Link
							href="/sign-in"
							className="inline-flex items-center justify-center rounded-xl bg-gradient-to-r from-cyan-600 via-blue-600 to-indigo-600 px-8 sm:px-10 py-3.5 sm:py-4 text-sm sm:text-base font-bold text-white shadow-xl shadow-cyan-500/15 hover:shadow-cyan-500/30 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 border border-cyan-400/30 text-center"
						>
							Start Managing Projects
							<ArrowRight className="ml-2.5 shrink-0" size={18} />
						</Link>
					</div>
				</div>

				{/* BOTTOM COLUMN: CARDS */}
				<div className="w-full max-w-6xl relative z-20 grid grid-cols-1 md:grid-cols-3 gap-6 pt-4 lg:pt-8">
					{/* Card 1: Kanban Feature */}
					<div className="w-full bg-white/80 p-5 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-emerald-300 group">
						<div className="flex items-center justify-between mb-4 gap-2">
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
							<span className="text-[10px] font-bold text-emerald-700 bg-emerald-500/10 px-2.5 py-1 rounded-full uppercase tracking-wider border border-emerald-500/20 shrink-0 hidden lg:block">
								Active
							</span>
						</div>

						<div className="space-y-1.5 mb-4">
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
					<div className="w-full bg-white/80 p-5 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-cyan-300 group">
						<div className="flex items-center justify-between mb-4 gap-2">
							<div className="flex items-center gap-3">
								<div className="p-2 sm:p-2.5 rounded-2xl bg-cyan-500/10 border border-cyan-500/20 text-cyan-600 shadow-inner shrink-0">
									<Users size={18} />
								</div>
								<div>
									<h4 className="font-bold text-slate-900 text-sm sm:text-base group-hover:text-cyan-600 transition-colors">
										Team Sync
									</h4>
									<p className="text-[11px] text-slate-500 font-medium">
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
							</div>
						</div>
						<p className="text-xs text-slate-600 leading-relaxed mt-10">
							Work together effortlessly with live updates and team channels.
						</p>
					</div>

					{/* Card 3: Goal Tracking */}
					<div className="w-full bg-white/80 p-5 sm:p-6 rounded-3xl shadow-xl shadow-slate-200/50 border border-slate-200 backdrop-blur-xl transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:border-indigo-300 group">
						<div className="flex items-center justify-between mb-4 gap-2">
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
							<div className="flex items-center gap-1.5 text-xs font-bold text-amber-700 bg-amber-500/10 px-2.5 py-1 rounded-full border border-amber-500/20 shrink-0 hidden lg:flex">
								<Flame size={13} className="text-amber-600" />
								<span>Streak</span>
							</div>
						</div>
						<p className="text-xs text-slate-600 leading-relaxed mt-10">
							Keep track of every objective efficiently and never miss
							deadlines.
						</p>
					</div>
				</div>
			</div>
		</section>
	);
}
