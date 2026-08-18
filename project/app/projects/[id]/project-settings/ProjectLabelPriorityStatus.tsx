import { Layers, Tag, X } from "lucide-react";
import { useProjectSettings } from "@/hooks/project/project-settings/useProjectSettings";
import { useToast } from "@/hooks/toast/use-toast";

export function TaskStatusesWidget() {
	const { statuses, setIsStatusModalOpen, handleDeleteStatus } =
		useProjectSettings();
	const { toast } = useToast();

	const onRemove = (idx: number) => {
		handleDeleteStatus(idx);
		toast({
			title: "Status removed",
			description: "Status has been removed.",
			variant: "success",
		});
	};

	return (
		<div className="rounded-2xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-payne's_gray-700 dark:bg-outer_space-900 space-y-4 flex flex-col h-full">
			<div className="flex items-center justify-between">
				<h2 className="text-sm font-bold text-outer_space-800 dark:text-platinum-100 uppercase tracking-wider">
					Task Statuses
				</h2>
				<button
					type="button"
					onClick={() => setIsStatusModalOpen(true)}
					className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue_munsell-600 dark:text-blue_munsell-400 hover:underline"
				>
					<Layers size={14} /> Add Status
				</button>
			</div>
			<div className="flex flex-wrap gap-2">
				{statuses.map(
					(
						status: {
							name: string;
							description?: string;
							color: string;
							id?: string;
						},
						idx: number,
					) => (
						<span
							key={status.id || status.name}
							title={status.description}
							className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${status.color}`}
						>
							<Layers size={12} />
							{status.name}
							<button
								type="button"
								onClick={() => onRemove(idx)}
								className="hover:opacity-75"
							>
								<X size={12} />
							</button>
						</span>
					),
				)}
			</div>
		</div>
	);
}

export function TaskPrioritiesWidget() {
	const PRIORITIES = [
		{
			name: "Urgent",
			description: "Urgent task requiring immediate attention",
			color:
				"bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
		},
		{
			name: "High",
			description: "High priority task",
			color:
				"bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
		},
		{
			name: "Medium",
			description: "Medium priority task",
			color:
				"bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
		},
		{
			name: "Low",
			description: "Low priority task",
			color:
				"bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
		},
	];

	return (
		<div className="rounded-2xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-payne's_gray-700 dark:bg-outer_space-900 space-y-4 flex flex-col h-full">
			<div className="flex items-center justify-between">
				<h2 className="text-sm font-bold text-outer_space-800 dark:text-platinum-100 uppercase tracking-wider">
					Task Priorities
				</h2>
			</div>
			<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
				{PRIORITIES.map((priority) => (
					<div
						key={priority.name}
						className="flex items-center justify-between p-3 rounded-xl border border-french_gray-200 dark:border-payne's_gray-700 bg-french_gray-50 dark:bg-outer_space-800"
					>
						<div>
							<div className="flex items-center gap-2">
								<span
									className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${priority.color}`}
								>
									{priority.name}
								</span>
							</div>
							<p className="text-xs text-outer_space-600 dark:text-platinum-300 mt-1">
								{priority.description}
							</p>
						</div>
					</div>
				))}
			</div>
		</div>
	);
}

export function ProjectLabelsWidget() {
	const { labels, setIsLabelModalOpen, handleDeleteLabel } =
		useProjectSettings();
	const { toast } = useToast();

	const onRemove = (idx: number) => {
		handleDeleteLabel(idx);
		toast({
			title: "Label removed",
			description: "Label has been removed.",
			variant: "success",
		});
	};

	return (
		<div className="rounded-2xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-payne's_gray-700 dark:bg-outer_space-900 space-y-4 flex flex-col h-full">
			<div className="flex items-center justify-between">
				<h2 className="text-sm font-bold text-outer_space-800 dark:text-platinum-100 uppercase tracking-wider">
					Project Labels
				</h2>
				<button
					type="button"
					onClick={() => setIsLabelModalOpen(true)}
					className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue_munsell-600 dark:text-blue_munsell-400 hover:underline"
				>
					<Tag size={14} /> Add Label
				</button>
			</div>
			<div className="flex flex-wrap gap-2">
				{labels.map(
					(lbl: { name: string; color: string; id?: string }, idx: number) => (
						<span
							key={lbl.id || lbl.name}
							className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${lbl.color}`}
						>
							<Tag size={12} />
							{lbl.name}
							<button
								type="button"
								onClick={() => onRemove(idx)}
								className="hover:opacity-75"
							>
								<X size={12} />
							</button>
						</span>
					),
				)}
			</div>
		</div>
	);
}

export function TaskSizesWidget() {
	const SIZES = [
		{
			name: "XS",
			color:
				"bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800",
		},
		{
			name: "S",
			color:
				"bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
		},
		{
			name: "M",
			color:
				"bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
		},
		{
			name: "L",
			color:
				"bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
		},
		{
			name: "XL",
			color:
				"bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800",
		},
	];

	return (
		<div className="rounded-2xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-payne's_gray-700 dark:bg-outer_space-900 space-y-4 flex flex-col h-full">
			<div className="flex items-center justify-between">
				<h2 className="text-sm font-bold text-outer_space-800 dark:text-platinum-100 uppercase tracking-wider">
					Task Sizes
				</h2>
			</div>
			<div className="flex flex-wrap gap-2">
				{SIZES.map((size) => (
					<span
						key={size.name}
						className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${size.color}`}
					>
						<Layers size={12} />
						{size.name}
					</span>
				))}
			</div>
		</div>
	);
}
