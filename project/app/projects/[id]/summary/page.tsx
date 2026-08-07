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

// ─── Types ────────────────────────────────────────────────────────────────────

interface ProgressItem {
	label: string;
	count: number;
	percentage: number;
	color: string;
}

interface TeamMember {
	name: string;
	tasks: number;
	load: string;
}

interface ActivityItem {
	id: string;
	title: string;
	author: string;
	time: string;
}

// ─── Static Data ──────────────────────────────────────────────────────────────

const STATUS_OVERVIEW: ProgressItem[] = [
	{ label: "Done", count: 14, percentage: 45, color: "bg-emerald-500" },
	{ label: "In Progress", count: 9, percentage: 29, color: "bg-blue-500" },
	{ label: "In Review", count: 4, percentage: 13, color: "bg-amber-500" },
	{ label: "Todo", count: 4, percentage: 13, color: "bg-slate-400" },
];

const WORK_TYPES: ProgressItem[] = [
	{ label: "Feature", count: 12, percentage: 40, color: "bg-indigo-500" },
	{ label: "Bug Fix", count: 8, percentage: 27, color: "bg-red-500" },
	{ label: "Improvement", count: 6, percentage: 20, color: "bg-purple-500" },
	{ label: "Chore", count: 4, percentage: 13, color: "bg-slate-400" },
];

const TEAM_WORKLOAD: TeamMember[] = [
	{ name: "Alice", tasks: 7, load: "High" },
	{ name: "Bob", tasks: 5, load: "Medium" },
	{ name: "Carol", tasks: 4, load: "Medium" },
	{ name: "Dave", tasks: 2, load: "Low" },
	{ name: "Eve", tasks: 1, load: "Low" },
];

const RECENT_ACTIVITIES: ActivityItem[] = [
	{
		id: "a1",
		title: "Completed task: Design system tokens",
		author: "Alice",
		time: "2 min ago",
	},
	{
		id: "a2",
		title: "Moved 'API Integration' to In Review",
		author: "Bob",
		time: "14 min ago",
	},
	{
		id: "a3",
		title: "Added comment on 'Auth flow' task",
		author: "Carol",
		time: "1 hr ago",
	},
	{
		id: "a4",
		title: "Created task: Write unit tests",
		author: "Dave",
		time: "3 hrs ago",
	},
	{
		id: "a5",
		title: "Updated sprint deadline to Aug 20",
		author: "Alice",
		time: "Yesterday",
	},
];

// ─── Page Component ───────────────────────────────────────────────────────────

export default function Summary() {
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
							Website Redesign Phase 2
						</h2>
						<p className="mt-1 text-sm text-outer_space-500 dark:text-platinum-400">
							Tracking core development metrics, task velocity, and team
							contributions for the current cycle.
						</p>
					</div>
					<div className="flex items-center gap-3">
						<div className="rounded-xl bg-blue_munsell-50 px-4 py-2.5 text-center dark:bg-blue_munsell-950/40">
							<span className="block text-xs font-medium text-outer_space-400 dark:text-platinum-400">
								Sprint Progress
							</span>
							<span className="text-lg font-bold text-blue_munsell-600 dark:text-blue_munsell-400">
								72%
							</span>
						</div>
					</div>
				</div>
			</div>

			{/* 2. Metrics Grid (Last 7 Days) */}
			<div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
				{/* Completed */}
				<div className="rounded-xl border border-french_gray-200 bg-white p-5 shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium text-outer_space-500 dark:text-platinum-400">
							Completed (7d)
						</span>
						<span className="rounded-lg bg-emerald-500/10 p-2 text-emerald-600 dark:text-emerald-400">
							<CheckCircle2 size={18} />
						</span>
					</div>
					<div className="mt-4 flex items-baseline gap-2">
						<span className="text-3xl font-bold text-outer_space-800 dark:text-platinum-100">
							14
						</span>
						<span className="text-xs font-medium text-emerald-600 dark:text-emerald-400">
							+12% vs last week
						</span>
					</div>
				</div>

				{/* Created */}
				<div className="rounded-xl border border-french_gray-200 bg-white p-5 shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium text-outer_space-500 dark:text-platinum-400">
							Created (7d)
						</span>
						<span className="rounded-lg bg-blue_munsell-500/10 p-2 text-blue_munsell-600 dark:text-blue_munsell-400">
							<PlusCircle size={18} />
						</span>
					</div>
					<div className="mt-4 flex items-baseline gap-2">
						<span className="text-3xl font-bold text-outer_space-800 dark:text-platinum-100">
							8
						</span>
						<span className="text-xs font-medium text-blue_munsell-600 dark:text-blue_munsell-400">
							New backlog items
						</span>
					</div>
				</div>

				{/* Due Soon */}
				<div className="rounded-xl border border-french_gray-200 bg-white p-5 shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium text-outer_space-500 dark:text-platinum-400">
							Due in 7 Days
						</span>
						<span className="rounded-lg bg-amber-500/10 p-2 text-amber-600 dark:text-amber-400">
							<CalendarClock size={18} />
						</span>
					</div>
					<div className="mt-4 flex items-baseline gap-2">
						<span className="text-3xl font-bold text-outer_space-800 dark:text-platinum-100">
							5
						</span>
						<span className="text-xs font-medium text-amber-600 dark:text-amber-400">
							Requires attention
						</span>
					</div>
				</div>

				{/* Edited */}
				<div className="rounded-xl border border-french_gray-200 bg-white p-5 shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500">
					<div className="flex items-center justify-between">
						<span className="text-sm font-medium text-outer_space-500 dark:text-platinum-400">
							Edited (7d)
						</span>
						<span className="rounded-lg bg-purple-500/10 p-2 text-purple-600 dark:text-purple-400">
							<Edit3 size={18} />
						</span>
					</div>
					<div className="mt-4 flex items-baseline gap-2">
						<span className="text-3xl font-bold text-outer_space-800 dark:text-platinum-100">
							32
						</span>
						<span className="text-xs font-medium text-purple-600 dark:text-purple-400">
							Active revisions
						</span>
					</div>
				</div>
			</div>

			{/* 3. Analytics & Breakdown Section */}
			<div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
				{/* Status Overview */}
				<div className="rounded-xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-payne's_gray-600 dark:bg-outer_space-500">
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-semibold text-outer_space-800 dark:text-platinum-100 flex items-center gap-2">
							<BarChart3 size={18} className="text-blue_munsell-500" /> Status
							Overview
						</h3>
					</div>
					<div className="space-y-4">
						{STATUS_OVERVIEW.map((item: ProgressItem) => (
							<div key={item.label}>
								<div className="flex justify-between text-xs font-medium mb-1 text-outer_space-600 dark:text-platinum-300">
									<span>{item.label}</span>
									<span>{item.count} tasks</span>
								</div>
								<div className="h-2 w-full rounded-full bg-french_gray-100 dark:bg-payne's_gray-400 overflow-hidden">
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
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-semibold text-outer_space-800 dark:text-platinum-100 flex items-center gap-2">
							<PieChart size={18} className="text-purple-500" /> Types of Work
						</h3>
					</div>
					<div className="space-y-4">
						{WORK_TYPES.map((item: ProgressItem) => (
							<div key={item.label}>
								<div className="flex justify-between text-xs font-medium mb-1 text-outer_space-600 dark:text-platinum-300">
									<span>{item.label}</span>
									<span>{item.count} items</span>
								</div>
								<div className="h-2 w-full rounded-full bg-french_gray-100 dark:bg-payne's_gray-400 overflow-hidden">
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
					<div className="flex items-center justify-between mb-4">
						<h3 className="font-semibold text-outer_space-800 dark:text-platinum-100 flex items-center gap-2">
							<Users size={18} className="text-emerald-500" /> Team Workload
						</h3>
					</div>
					<div className="space-y-3">
						{TEAM_WORKLOAD.map((member: TeamMember) => (
							<div
								key={member.name}
								className="flex items-center justify-between p-2 rounded-lg bg-platinum-100/50 dark:bg-outer_space-400/50"
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
				<div className="flex items-center justify-between mb-4">
					<h3 className="font-semibold text-outer_space-800 dark:text-platinum-100 flex items-center gap-2">
						<Clock size={18} className="text-blue_munsell-500" /> Recent
						Activity Log
					</h3>
					<span className="text-xs text-outer_space-400 dark:text-platinum-400">
						Showing last 5 updates
					</span>
				</div>
				<div className="divide-y divide-french_gray-100 dark:divide-payne's_gray-400">
					{RECENT_ACTIVITIES.map((act: ActivityItem) => (
						<div
							key={act.id}
							className="flex flex-col sm:flex-row sm:items-center sm:justify-between py-3 first:pt-0 last:pb-0 gap-1 sm:gap-4"
						>
							<div className="flex items-center gap-3">
								<div className="h-2 w-2 rounded-full bg-blue_munsell-500 flex-shrink-0" />
								<p className="text-sm font-medium text-outer_space-700 dark:text-platinum-200">
									{act.title}
								</p>
							</div>
							<div className="flex items-center gap-2 pl-5 sm:pl-0 text-xs text-outer_space-400 dark:text-platinum-400">
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
