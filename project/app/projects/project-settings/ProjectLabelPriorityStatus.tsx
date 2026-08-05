import { Flag, Layers, Tag, Trash2, X } from "lucide-react";
import type { ProjectLabel, ProjectPriority, ProjectStatus } from "./page";

interface ProjectLabelPriorityProps {
	labels: ProjectLabel[];
	priorities: ProjectPriority[];
	statuses: ProjectStatus[];
	setIsLabelModalOpen: (open: boolean) => void;
	setIsPriorityModalOpen: (open: boolean) => void;
	setIsStatusModalOpen: (open: boolean) => void;
	handleDeleteLabel: (index: number) => void;
	handleDeletePriority: (index: number) => void;
	handleDeleteStatus: (index: number) => void;
}

function ProjectLabelPriority({
	labels = [],
	priorities = [],
	statuses = [],
	setIsLabelModalOpen,
	setIsPriorityModalOpen,
	setIsStatusModalOpen,
	handleDeleteLabel,
	handleDeletePriority,
	handleDeleteStatus,
}: ProjectLabelPriorityProps) {
	return (
		<>
			{/* Project Statuses Section */}
			<div className="rounded-2xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-payne's_gray-700 dark:bg-outer_space-900 space-y-4">
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

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{statuses.map((status, idx) => (
						<div
							key={idx}
							className="flex items-center justify-between p-3 rounded-xl border border-french_gray-200 dark:border-payne's_gray-700 bg-french_gray-50 dark:bg-outer_space-800"
						>
							<div>
								<div className="flex items-center gap-2">
									<span
										className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${status.color}`}
									>
										{status.name}
									</span>
								</div>
								<p className="text-xs text-outer_space-600 dark:text-platinum-300 mt-1">
									{status.description}
								</p>
							</div>
							<button
								type="button"
								onClick={() => handleDeleteStatus(idx)}
								className="text-red-500 hover:text-red-700 p-1"
							>
								<Trash2 size={14} />
							</button>
						</div>
					))}
				</div>
			</div>

			{/* Project Labels Section */}
			<div className="rounded-2xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-payne's_gray-700 dark:bg-outer_space-900 space-y-4">
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
					{labels.map((lbl, idx) => (
						<span
							key={idx}
							className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-semibold border ${lbl.color}`}
						>
							<Tag size={12} />
							{lbl.name}
							<button
								type="button"
								onClick={() => handleDeleteLabel(idx)}
								className="ml-1 hover:text-red-600 transition-colors"
							>
								<X size={12} />
							</button>
						</span>
					))}
				</div>
			</div>

			{/* Project Priorities Section */}
			<div className="rounded-2xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-payne's_gray-700 dark:bg-outer_space-900 space-y-4">
				<div className="flex items-center justify-between">
					<h2 className="text-sm font-bold text-outer_space-800 dark:text-platinum-100 uppercase tracking-wider">
						Task Priorities
					</h2>
					<button
						type="button"
						onClick={() => setIsPriorityModalOpen(true)}
						className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue_munsell-600 dark:text-blue_munsell-400 hover:underline"
					>
						<Flag size={14} /> Add Priority
					</button>
				</div>

				<div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
					{priorities.map((pri, idx) => (
						<div
							key={idx}
							className="flex items-center justify-between p-3 rounded-xl border border-french_gray-200 dark:border-payne's_gray-700 bg-french_gray-50 dark:bg-outer_space-800"
						>
							<div>
								<div className="flex items-center gap-2">
									<span
										className={`px-2 py-0.5 rounded-md text-[10px] font-bold ${pri.color}`}
									>
										{pri.name}
									</span>
									<span className="text-xs text-outer_space-500 dark:text-platinum-400">
										Level {pri.level}
									</span>
								</div>
								<p className="text-xs text-outer_space-600 dark:text-platinum-300 mt-1">
									{pri.description}
								</p>
							</div>
							<button
								type="button"
								onClick={() => handleDeletePriority(idx)}
								className="text-red-500 hover:text-red-700 p-1"
							>
								<Trash2 size={14} />
							</button>
						</div>
					))}
				</div>
			</div>
		</>
	);
}

export default ProjectLabelPriority;
