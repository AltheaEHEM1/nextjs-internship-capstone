"use client";
import {
	AlertCircle,
	ArrowLeft,
	Check,
	Edit,
	Save,
	Settings,
	Trash2,
	X,
} from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { updateProjectSettingsAction } from "@/actions/project/Project";
import { Alert, AlertDescription, AlertTitle } from "@/components/alert/alert";
import { AddLabelModal } from "@/components/modals/project-settings/AddLabelModal";
import { AddStatusModal } from "@/components/modals/project-settings/AddStatusModal";
import {
	useInitializeProjectSettings,
	useProjectSettings,
} from "@/hooks/project/project-settings/useProjectSettings";
import { useToast } from "@/hooks/toast/use-toast";
import type {
	AccessRole,
	ProjectLabel,
	ProjectStatus,
	TeamMember,
} from "@/stores/project/project-settings/ProjectSettingsStore";
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
		availableTeams,
		initialAccess,
		initialMembers,
		initialLabels,
		initialStatuses,
	});

	const {
		title,
		description,
		team,
		teamId,
		access,
		isEditingGeneral,
		setIsEditingGeneral,
		tempTitle,
		setTempTitle,
		tempDescription,
		setTempDescription,
		handleSaveGeneral,
		handleCancelGeneral,
		labels,
		statuses,
		isLabelModalOpen,
		isStatusModalOpen,
		setIsLabelModalOpen,
		setIsStatusModalOpen,
		handleAddLabel,
		handleAddStatus,
		members,
	} = useProjectSettings();
	const { toast } = useToast();
	const router = useRouter();
	const [showDeleteAlert, setShowDeleteAlert] = useState(false);

	const handleSave = async (e: React.FormEvent) => {
		e.preventDefault();

		let finalTitle = title;
		let finalDescription = description;

		if (isEditingGeneral) {
			finalTitle = tempTitle;
			finalDescription = tempDescription;
			handleSaveGeneral();
		}

		const result = await updateProjectSettingsAction(projectId, {
			name: finalTitle,
			description: finalDescription,
			teamId: teamId,
			statuses: statuses,
		});

		if (result.success) {
			toast({
				title: "Success",
				description: "Project settings updated successfully.",
			});
		} else {
			toast({
				title: "Error",
				description: result.error || "Failed to update project settings.",
				variant: "destructive",
			});
		}

		onSave?.({
			title: finalTitle,
			description: finalDescription,
			team,
			access,
			members,
			labels,
			statuses,
		});
	};

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
									onClick={async () => {
										// Save to DB immediately when clicking Done
										const result = await updateProjectSettingsAction(
											projectId,
											{
												name: tempTitle,
												description: tempDescription,
												teamId: teamId,
											},
										);

										if (result.success) {
											toast({
												title: "Success",
												description: "Project details updated.",
											});
											handleSaveGeneral(); // updates store and hides edit mode
										} else {
											toast({
												title: "Error",
												description:
													result.error || "Failed to update project details.",
												variant: "destructive",
											});
										}
									}}
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

				<div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
					<TaskStatusesWidget />
					<ProjectLabelsWidget />
					<TaskSizesWidget />
					<TaskPrioritiesWidget />
				</div>

				{/* Delete Alert & Actions Footer */}
				{showDeleteAlert && (
					<Alert
						variant="destructive"
						className="bg-red-50/50 dark:bg-red-950/20 border-red-200 dark:border-red-900/50"
					>
						<AlertCircle className="h-4 w-4" />
						<AlertTitle>Confirm Deletion</AlertTitle>
						<AlertDescription>
							Are you sure you want to delete this project? This action cannot
							be undone.
							<div className="flex justify-end gap-3 mt-4">
								<button
									type="button"
									onClick={() => setShowDeleteAlert(false)}
									className="px-4 py-2 text-xs font-semibold rounded-lg bg-white dark:bg-outer_space-800 text-outer_space-600 dark:text-platinum-300 border border-french_gray-200 dark:border-payne's_gray-600 hover:bg-gray-50 dark:hover:bg-outer_space-700 transition"
								>
									Cancel
								</button>
								<button
									type="button"
									onClick={() => {
										onDelete?.();
										toast({
											title: "Project deleted",
											description: "Project has been successfully deleted.",
											variant: "success",
										});
									}}
									className="px-4 py-2 text-xs font-bold rounded-lg bg-red-600 text-white hover:bg-red-700 transition"
								>
									Confirm Delete
								</button>
							</div>
						</AlertDescription>
					</Alert>
				)}

				<div className="flex items-center justify-between pt-4 border-t border-french_gray-200/60 dark:border-payne's_gray-800">
					<button
						type="button"
						onClick={() => setShowDeleteAlert(true)}
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
			<AddStatusModal
				isOpen={isStatusModalOpen}
				onClose={() => setIsStatusModalOpen(false)}
				onSave={handleAddStatus}
			/>
		</div>
	);
}
