"use client";
import {
	ArrowLeft,
	Check,
	Edit,
	RotateCcw,
	Save,
	Settings,
	Trash2,
	X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { AddLabelModal } from "@/components/modals/project-settings/AddLabelModal";
import { AddStatusModal } from "@/components/modals/project-settings/AddStatusModal";
import ConfirmDialog from "@/components/modals/team/ConfirmDialog";
import {
	useInitializeProjectSettings,
	useProjectSettings,
	useProjectSettingsFormActions,
} from "@/hooks/project/project-settings/useProjectSettings";
import type {
	AccessRole,
	ProjectLabel,
	ProjectStatus,
	TeamMember,
} from "@/stores/project/project-settings/ProjectSettingsStore";
import { useProjectSettingsStore } from "@/stores/project/project-settings/ProjectSettingsStore";
import MemberRole from "./MemberRole";
import {
	ProjectLabelsWidget,
	TaskPrioritiesWidget,
	TaskSizesWidget,
	TaskStatusesWidget,
} from "./ProjectLabelPriorityStatus";

interface ProjectSettingsFormProps {
	projectId: string;
	initialTitle: string;
	initialDescription: string;
	initialTeam: string;
	initialTeamId: string;
	initialDueDate: string;
	initialStatus: string;
	availableTeams: { id: string; name: string }[];
	initialAccess?: AccessRole;
	initialMembers: TeamMember[];
	initialLabels?: ProjectLabel[];
	initialStatuses: ProjectStatus[];
	onSave?: (data: {
		title: string;
		description: string;
		team: string;
		access: AccessRole;
		members: TeamMember[];
		labels: ProjectLabel[];
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

export default function ProjectSettingsForm({
	projectId,
	initialTitle,
	initialDescription,
	initialTeam,
	initialTeamId,
	initialDueDate,
	initialStatus,
	availableTeams,
	initialAccess = "administrator",
	initialMembers,
	initialLabels = DEFAULT_LABELS,
	initialStatuses,
	onSave,
	onDelete,
}: ProjectSettingsFormProps) {
	useInitializeProjectSettings({
		initialTitle,
		initialDescription,
		initialTeam,
		initialTeamId,
		initialDueDate,
		initialStatus,
		availableTeams,
		initialAccess,
		initialMembers,
		initialLabels,
		initialStatuses,
	});

	const {
		title,
		description,
		isEditingGeneral,
		setIsEditingGeneral,
		tempTitle,
		setTempTitle,
		tempDescription,
		setTempDescription,
		tempDueDate,
		setTempDueDate,
		handleCancelGeneral,
		isLabelModalOpen,
		setIsLabelModalOpen,
		handleAddLabel,
		isStatusModalOpen,
		setIsStatusModalOpen,
		handleAddStatus,
		members,
		isDeleteAlertOpen,
		setIsDeleteAlertOpen,
	} = useProjectSettings();
	const router = useRouter();
	const [maxLengthErrors, setMaxLengthErrors] = useState<
		Record<string, string>
	>({});
	const [isArchiveAlertOpen, setIsArchiveAlertOpen] = useState(false);
	const [isRestoreAlertOpen, setIsRestoreAlertOpen] = useState(false);

	const {
		handleSaveDone,
		handleSaveAll,
		handleDeleteConfirm,
		handleArchiveProject,
		handleRestoreProject,
	} = useProjectSettingsFormActions(projectId, onSave, onDelete);

	const projectStatus = useProjectSettingsStore((s) => s.status);

	return (
		<div className="max-w-5xl mx-auto space-y-8 pb-12">
			{/* Back Navigation & Page Header */}
			<div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
				<button
					type="button"
					onClick={() => router.back()}
					className="inline-flex items-center gap-2 text-sm font-medium text-outer_space-700 dark:text-platinum-300 hover:text-outer_space-900 dark:hover:text-platinum-100 transition-all hover:scale-105 w-fit"
				>
					<ArrowLeft size={16} />
					Back
				</button>
			</div>

			{/* Settings Form Container */}
			<form onSubmit={handleSaveAll} className="space-y-6">
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
									onClick={handleSaveDone}
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
									onChange={(e) => {
										let val = e.target.value.replace(/\s{2,}/g, " ");
										if (val.length > 50) {
											val = val.slice(0, 50);
											setMaxLengthErrors((prev) => ({
												...prev,
												title: "Project name is too long",
											}));
										} else {
											setMaxLengthErrors((prev) => ({ ...prev, title: "" }));
										}
										setTempTitle(val);
									}}
									className={`w-full rounded-xl border px-4 py-3 text-sm text-outer_space-900 dark:text-platinum-100 focus:outline-none focus:ring-2 shadow-2xs bg-white dark:bg-outer_space-800 ${maxLengthErrors.title ? "border-red-500 focus:ring-red-500" : "border-french_gray-300 dark:border-payne's_gray-600 focus:ring-blue_munsell-500/50"}`}
								/>
								{maxLengthErrors.title && (
									<p className="mt-1 text-xs text-red-500 font-medium">
										{maxLengthErrors.title}
									</p>
								)}
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
									onChange={(e) => {
										let val = e.target.value.replace(/\s{2,}/g, " ");
										if (val.length > 500) {
											val = val.slice(0, 500);
											setMaxLengthErrors((prev) => ({
												...prev,
												description: "Description is too long",
											}));
										} else {
											setMaxLengthErrors((prev) => ({
												...prev,
												description: "",
											}));
										}
										setTempDescription(val);
									}}
									rows={3}
									className={`w-full rounded-xl border px-4 py-3 text-sm text-outer_space-900 dark:text-platinum-100 focus:outline-none focus:ring-2 resize-none shadow-2xs bg-white dark:bg-outer_space-800 ${maxLengthErrors.description ? "border-red-500 focus:ring-red-500" : "border-french_gray-300 dark:border-payne's_gray-600 focus:ring-blue_munsell-500/50"}`}
								/>
								{maxLengthErrors.description && (
									<p className="mt-1 text-xs text-red-500 font-medium">
										{maxLengthErrors.description}
									</p>
								)}
							</div>
							{/* Due Date */}
							<div>
								<label
									htmlFor="project-duedate"
									className="block text-xs font-semibold text-outer_space-600 dark:text-platinum-400 uppercase tracking-wider mb-2"
								>
									End of the Project
								</label>
								<input
									id="project-duedate"
									type="date"
									required
									value={tempDueDate}
									onChange={(e) => setTempDueDate(e.target.value)}
									className="w-full rounded-xl border border-french_gray-300 px-4 py-3 text-sm text-outer_space-900 dark:border-payne's_gray-600 dark:text-platinum-100 focus:border-blue_munsell-500 focus:outline-none focus:ring-1 focus:ring-blue_munsell-500 shadow-2xs bg-white dark:bg-outer_space-800"
								/>
							</div>
						</div>
					) : (
						<div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-1">
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
									End of the Project
								</span>
								<p className="text-sm text-outer_space-700 dark:text-platinum-300 leading-relaxed">
									{useProjectSettingsStore.getState().dueDate}
								</p>
							</div>
							<div className="p-4 rounded-xl bg-gray-50/50 dark:bg-outer_space-800/30 border border-french_gray-100 dark:border-payne's_gray-800 space-y-1 md:col-span-3">
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

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
					<TaskStatusesWidget />
					<ProjectLabelsWidget />
					<TaskSizesWidget />
					<TaskPrioritiesWidget />
				</div>

				{/* Delete Alert & Actions Footer */}
				<ConfirmDialog
					opened={isDeleteAlertOpen}
					onClose={() => setIsDeleteAlertOpen(false)}
					onConfirm={handleDeleteConfirm}
					title="Confirm Deletion"
					description="Are you sure you want to delete this project? This action cannot be undone."
					confirmLabel="Confirm Delete"
					variant="danger"
				/>
				<ConfirmDialog
					opened={isArchiveAlertOpen}
					onClose={() => setIsArchiveAlertOpen(false)}
					onConfirm={() => {
						setIsArchiveAlertOpen(false);
						handleArchiveProject();
					}}
					title="Archive Project"
					description="Are you sure you want to archive this project? Archived projects will be moved out of your active projects list."
					confirmLabel="Confirm Archive"
					variant="default"
				/>
				<ConfirmDialog
					opened={isRestoreAlertOpen}
					onClose={() => setIsRestoreAlertOpen(false)}
					onConfirm={() => {
						setIsRestoreAlertOpen(false);
						handleRestoreProject();
					}}
					title="Restore Project"
					description="Are you sure you want to restore this project back to active progress?"
					confirmLabel="Confirm Restore"
					variant="default"
				/>

				<div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pt-4 border-t border-french_gray-200/60 dark:border-payne's_gray-800">
					<div className="flex flex-wrap items-center gap-2">
						<button
							type="button"
							onClick={() => setIsDeleteAlertOpen(true)}
							className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/40 transition-colors border border-red-200/60 dark:border-red-900/40"
						>
							<Trash2 size={15} />
							Delete Project
						</button>
						{useProjectSettingsStore.getState().access === "administrator" &&
							(projectStatus === "archived" ? (
								<button
									type="button"
									onClick={() => setIsRestoreAlertOpen(true)}
									className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-emerald-600 hover:bg-emerald-50 dark:text-emerald-400 dark:hover:bg-emerald-950/40 transition-colors border border-emerald-200/60 dark:border-emerald-900/40"
								>
									<RotateCcw size={15} />
									Restore Project
								</button>
							) : (
								<button
									type="button"
									onClick={() => setIsArchiveAlertOpen(true)}
									className="inline-flex items-center gap-2 rounded-xl px-4 py-2.5 text-xs font-bold uppercase tracking-wider text-amber-600 hover:bg-amber-50 dark:text-amber-400 dark:hover:bg-amber-950/40 transition-colors border border-amber-200/60 dark:border-amber-900/40"
								>
									Archive Project
								</button>
							))}
					</div>
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
			<AddStatusModal
				isOpen={isStatusModalOpen}
				onClose={() => setIsStatusModalOpen(false)}
				onSave={handleAddStatus}
			/>
		</div>
	);
}
