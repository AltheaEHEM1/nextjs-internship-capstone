"use client";
import { ArrowLeft, Check, Edit, Save, Trash2, X, Settings } from "lucide-react";
import Link from "next/link";
import { AddLabelModal } from "@/components/modals/project-settings/AddLabelModal";
import { AddPriorityModal } from "@/components/modals/project-settings/AddPriorityModal";
import { AddStatusModal } from "@/components/modals/project-settings/AddStatusModal";

import {
	useInitializeProjectSettings,
	useProjectSettings,
} from "@/hooks/project/project-settings/useProjectSettings";
import MemberRole from "./MemberRole";
import ProjectLabelPriority from "./ProjectLabelPriorityStatus";

import type {
	AccessRole,
	TeamMember,
	ProjectLabel,
	ProjectPriority,
	ProjectStatus,
} from "@/stores/project/project-settings/ProjectSettingsStore";

interface ProjectSettingsFormProps {
	projectId: string;
	initialTitle: string;
	initialDescription: string;
	initialTeam: string;
	initialTeamId: string;
	availableTeams: { id: string; name: string }[];
	initialAccess?: AccessRole;
	initialMembers: TeamMember[];
	initialLabels?: ProjectLabel[];
	initialPriorities?: ProjectPriority[];
	initialStatuses: ProjectStatus[];
	onSave?: (data: {
		title: string;
		description: string;
		team: string;
		access: AccessRole;
		members: TeamMember[];
		labels: ProjectLabel[];
		priorities: ProjectPriority[];
		statuses: ProjectStatus[];
	}) => void;
	onDelete?: () => void;
}

const DEFAULT_LABELS: ProjectLabel[] = [
	{
		name: "Frontend",
		color: "bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
	},
	{
		name: "Bug",
		color: "bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
	},
	{
		name: "Feature",
		color:
			"bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
	},
];

const DEFAULT_PRIORITIES: ProjectPriority[] = [
	{
		name: "Critical",
		description: "System blockages or emergency fixes",
		color: "bg-red-500 text-white",
		level: 1,
	},
	{
		name: "Urgent",
		description: "High impact tasks for current sprint",
		color: "bg-amber-500 text-white",
		level: 2,
	},
];

export default function ProjectSettingsForm({
	projectId,
	initialTitle,
	initialDescription,
	initialTeam,
	initialTeamId,
	availableTeams,
	initialAccess = "administrator",
	initialMembers,
	initialLabels = DEFAULT_LABELS,
	initialPriorities = DEFAULT_PRIORITIES,
	initialStatuses,
	onSave,
	onDelete,
}: ProjectSettingsFormProps) {
	useInitializeProjectSettings({
		initialTitle,
		initialDescription,
		initialTeam,
		initialTeamId,
		availableTeams,
		initialAccess,
		initialMembers,
		initialLabels,
		initialPriorities,
		initialStatuses,
	});

	const {
		title,
		description,
		team,
		access,
		isEditingGeneral,
		setIsEditingGeneral,
		tempTitle,
		setTempTitle,
		tempDescription,
		setTempDescription,
		tempTeamId,
		setTempTeamId,
		availableTeams: storeAvailableTeams,
		handleSaveGeneral,
		handleCancelGeneral,
		labels,
		priorities,
		statuses,
		isLabelModalOpen,
		isPriorityModalOpen,
		isStatusModalOpen,
		setIsLabelModalOpen,
		setIsPriorityModalOpen,
		setIsStatusModalOpen,
		handleAddLabel,
		handleAddPriority,
		handleAddStatus,
		members,
		editingMemberId,
		editMemberRole,
		editMemberAccess,
		setEditMemberRole,
		setEditMemberAccess,
		setEditingMemberId,
		handleEditMemberStart,
		handleEditMemberSave,
		handleDeleteMember,
	} = useProjectSettings();

	const handleSave = (e: React.FormEvent) => {
		e.preventDefault();
		onSave?.({
			title,
			description,
			team,
			access,
			members,
			labels,
			priorities,
			statuses,
		});
	};

	return (
		<div className="max-w-5xl mx-auto space-y-8 pb-12">
			{/* Back Navigation & Page Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<Link
					href={`/projects/${projectId}`}
					className="inline-flex items-center gap-2 text-xs font-semibold text-outer_space-600 dark:text-platinum-400 hover:text-blue_munsell-600 dark:hover:text-blue_munsell-400 transition-colors w-fit"
				>
					<ArrowLeft size={15} />
					Back to Project
				</Link>
			</div>

			{/* Settings Form Container */}
			<form onSubmit={handleSave} className="space-y-6">
				{/* General Settings Section */}
				<div className="rounded-2xl border border-french_gray-200/80 bg-white p-6 sm:p-8 shadow-xs dark:border-payne's_gray-800 dark:bg-outer_space-900 space-y-6">
					<div className="flex items-center justify-between pb-4 border-b border-french_gray-100 dark:border-payne's_gray-800">
						<div className="space-y-1">
							<h2 className="text-sm font-bold text-outer_space-800 dark:text-platinum-100 uppercase tracking-wider flex items-center gap-2">
								<span className="flex h-7 w-7 items-center justify-center rounded-lg bg-blue_munsell-500/10 text-blue_munsell-600 dark:text-blue_munsell-400">
									<Settings size={15} />
								</span>
								General Configuration
							</h2>
							<p className="text-xs text-outer_space-500 dark:text-platinum-400">
								Manage basic project details and metadata info
							</p>
						</div>

						{!isEditingGeneral ? (
							<button
								type="button"
								onClick={() => setIsEditingGeneral(true)}
								className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold bg-blue_munsell-50 dark:bg-blue_munsell-500/10 text-blue_munsell-600 dark:text-blue_munsell-400 hover:bg-blue_munsell-100 dark:hover:bg-blue_munsell-500/20 border border-blue_munsell-100 dark:border-blue_munsell-500/20 transition-all shadow-2xs"
							>
								<Edit size={13} /> Edit Details
							</button>
						) : (
							<div className="flex items-center gap-2">
								<button
									type="button"
									onClick={handleSaveGeneral}
									className="inline-flex items-center gap-1 px-3.5 py-1.5 bg-blue_munsell-500 hover:bg-blue_munsell-600 text-white rounded-xl text-xs font-semibold shadow-xs transition-all"
								>
									<Check size={13} /> Done
								</button>
								<button
									type="button"
									onClick={handleCancelGeneral}
									className="inline-flex items-center gap-1 px-3 py-1.5 bg-gray-100 hover:bg-gray-200 dark:bg-payne's_gray-800 dark:hover:bg-payne's_gray-700 text-outer_space-700 dark:text-platinum-200 rounded-xl text-xs font-medium transition-colors"
								>
									<X size={13} /> Cancel
								</button>
							</div>
						)}
					</div>

					{isEditingGeneral ? (
						<div className="space-y-4 pt-1 animate-fadeIn">
							{/* Project Title */}
							<div>
								<label
									htmlFor="project-title"
									className="block text-xs font-semibold text-outer_space-600 dark:text-platinum-400 uppercase tracking-wider mb-2"
								>
									Project Name <span className="text-red-500">*</span>
								</label>
								<input
									id="project-title"
									type="text"
									required
									value={tempTitle}
									onChange={(e) => setTempTitle(e.target.value)}
									className="w-full rounded-xl border border-french_gray-300 dark:border-payne's_gray-600 bg-white dark:bg-outer_space-800 px-4 py-3 text-sm text-outer_space-900 dark:text-platinum-100 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500/50 shadow-2xs"
								/>
							</div>
							{/* Description */}
							<div>
								<label
									htmlFor="project-description"
									className="block text-xs font-semibold text-outer_space-600 dark:text-platinum-400 uppercase tracking-wider mb-2"
								>
									Description
								</label>
								<textarea
									id="project-description"
									value={tempDescription}
									onChange={(e) => setTempDescription(e.target.value)}
									rows={3}
									className="w-full rounded-xl border border-french_gray-300 dark:border-payne's_gray-600 bg-white dark:bg-outer_space-800 px-4 py-3 text-sm text-outer_space-900 dark:text-platinum-100 focus:outline-none focus:ring-2 focus:ring-blue_munsell-500/50 resize-none shadow-2xs"
								/>
							</div>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
							<div className="p-4 rounded-xl bg-gray-50/50 dark:bg-outer_space-800/30 border border-french_gray-100 dark:border-payne's_gray-800 space-y-1">
								<span className="block text-[11px] font-semibold text-outer_space-500 dark:text-platinum-400 uppercase tracking-wider">
									Project Name
								</span>
								<p className="text-base font-bold text-outer_space-900 dark:text-platinum-100 tracking-tight">
									{title}
								</p>
							</div>
							<div className="p-4 rounded-xl bg-gray-50/50 dark:bg-outer_space-800/30 border border-french_gray-100 dark:border-payne's_gray-800 space-y-1">
								<span className="block text-[11px] font-semibold text-outer_space-500 dark:text-platinum-400 uppercase tracking-wider">
									Description
								</span>
								<p className="text-sm text-outer_space-700 dark:text-platinum-300 leading-relaxed line-clamp-2">
									{description || "No description provided."}
								</p>
							</div>
						</div>
					)}
				</div>

				<MemberRole members={members} />
				<ProjectLabelPriority />

				{/* Actions Footer */}
				<div className="flex items-center justify-between pt-4 border-t border-french_gray-200/60 dark:border-payne's_gray-800">
					<button
						type="button"
						onClick={() => {
							if (
								window.confirm(
									"Are you sure you want to delete this project? This action cannot be undone."
								)
							) {
								onDelete?.();
							}
						}}
						className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition-colors border border-red-200/60 dark:border-red-900/40"
					>
						<Trash2 size={15} />
						Delete Project
					</button>
					<button
						type="submit"
						className="inline-flex items-center gap-2 rounded-xl bg-blue_munsell-500 hover:bg-blue_munsell-600 px-6 py-3 text-sm font-bold text-white shadow-sm transition-all shadow-blue_munsell-500/20"
					>
						<Save size={16} />
						Save Changes
					</button>
				</div>
			</form>

			{/* Modals */}
			<AddLabelModal
				isOpen={isLabelModalOpen}
				onClose={() => setIsLabelModalOpen(false)}
				onSave={handleAddLabel}
			/>
			<AddPriorityModal
				isOpen={isPriorityModalOpen}
				onClose={() => setIsPriorityModalOpen(false)}
				onSave={handleAddPriority}
			/>
			<AddStatusModal
				isOpen={isStatusModalOpen}
				onClose={() => setIsStatusModalOpen(false)}
				onSave={handleAddStatus}
			/>
		</div>
	);
}