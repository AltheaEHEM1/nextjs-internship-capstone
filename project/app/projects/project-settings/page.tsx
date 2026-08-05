"use client";

import { ArrowLeft, Check, Edit, Save, Trash2, X } from "lucide-react";
import Link from "next/link";
import { AddLabelModal } from "@/components/modals/project-settings/AddLabelModal";
import { AddPriorityModal } from "@/components/modals/project-settings/AddPriorityModal";
import { AddStatusModal } from "@/components/modals/project-settings/AddStatusModal";
import { PageHeader } from "@/components/page-header/PageHeader";
import { useProjectSettingsStore } from "@/stores/project/project-settings-store";
import { useEffect } from "react";
import MemberRole from "./MemberRole";
import ProjectLabelPriority from "./ProjectLabelPriorityStatus";

export type AccessRole = "administrator" | "member" | "viewer";

export interface TeamMember {
	id: string;
	name: string;
	email: string;
	role: string;
	access: AccessRole;
}

export interface ProjectLabel {
	name: string;
	color: string;
}

export interface ProjectPriority {
	name: string;
	description: string;
	color: string;
	level: number;
}

export interface ProjectStatus {
	name: string;
	description: string;
	color: string;
}

interface ProjectSettingsPageProps {
	initialTitle?: string;
	initialDescription?: string;
	initialTeam?: string;
	initialAccess?: AccessRole;
	initialMembers?: TeamMember[];
	initialLabels?: ProjectLabel[];
	initialPriorities?: ProjectPriority[];
	initialStatuses?: ProjectStatus[];
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

const DEFAULT_MEMBERS: TeamMember[] = [
	{
		id: "1",
		name: "Yuan Exequiel R. Evangelista",
		email: "yuan@srg.edu",
		role: "Project Manager / Lead Dev",
		access: "administrator",
	},
	{
		id: "2",
		name: "Frontend Developer",
		email: "frontend@srg.edu",
		role: "UI/UX & Frontend Specialist",
		access: "member",
	},
	{
		id: "3",
		name: "Backend Developer",
		email: "backend@srg.edu",
		role: "API & DB Architect",
		access: "member",
	},
	{
		id: "4",
		name: "System Auditor",
		email: "viewer@srg.edu",
		role: "QA & Compliance",
		access: "viewer",
	},
];

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

const DEFAULT_STATUSES: ProjectStatus[] = [
	{
		name: "To Do",
		color:
			"bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
		description: "Tasks that are yet to be started.",
	},
	{
		name: "In Progress",
		color:
			"bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800",
		description: "Tasks currently being worked on.",
	},
	{
		name: "Completed",
		color:
			"bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800",
		description: "Tasks that have been fully finished.",
	},
];

export default function ProjectSettingsPage({
	initialTitle = "PUP Inventory Management System",
	initialDescription = "Managing inventory assets and role-based access for departments.",
	initialTeam = "Core Architecture Unit",
	initialAccess = "administrator",
	initialMembers = DEFAULT_MEMBERS,
	initialLabels = DEFAULT_LABELS,
	initialPriorities = DEFAULT_PRIORITIES,
	initialStatuses = DEFAULT_STATUSES,
	onSave,
	onDelete,
}: ProjectSettingsPageProps) {
	// Initialise global store with props received from the page
	useEffect(() => {
		useProjectSettingsStore.getState().initialize({
			title: initialTitle,
			description: initialDescription,
			team: initialTeam,
			access: initialAccess,
			members: initialMembers,
			labels: initialLabels,
			priorities: initialPriorities,
			statuses: initialStatuses,
		});
	}, []);

	const {
		title,
		description,
		team,
		access,
		setTitle,
		setDescription,
		setTeam,
		setAccess,
		isEditingGeneral,
		setIsEditingGeneral,
		tempTitle,
		setTempTitle,
		tempDescription,
		setTempDescription,
		handleSaveGeneral,
		handleCancelGeneral,

		// Labels, priorities, statuses
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
		handleDeleteLabel,
		handleAddPriority,
		handleDeletePriority,
		handleAddStatus,
		handleDeleteStatus,

		// Members
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
	} = useProjectSettingsStore();

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
		<div className="space-y-6">
			<div className="flex items-center">
				<Link
					href="/projects/pages"
					className="inline-flex items-center gap-2 rounded-xl border border-french_gray-200 bg-white px-3 py-2 text-sm font-medium text-outer_space-700 shadow-xs transition-colors hover:bg-platinum-100 dark:border-payne's_gray-600 dark:bg-outer_space-500 dark:text-platinum-200 dark:hover:bg-outer_space-400"
				>
					<ArrowLeft size={16} />
					Back to Teams
				</Link>
			</div>
			<PageHeader
				title="Projects"
				description="Manage and organize your team projects"
			/>

			{/* Settings Form Container */}
			<form onSubmit={handleSave} className="space-y-6">
				{/* General Settings Section */}
				<div className="rounded-2xl border border-french_gray-200 bg-white p-6 shadow-xs dark:border-payne's_gray-700 dark:bg-outer_space-900 space-y-4">
					<div className="flex items-center justify-between mb-2">
						<h2 className="text-sm font-bold text-outer_space-800 dark:text-platinum-100 uppercase tracking-wider">
							General Configuration
						</h2>
						{!isEditingGeneral ? (
							<button
								type="button"
								onClick={() => setIsEditingGeneral(true)}
								className="inline-flex items-center gap-1.5 text-xs font-semibold text-blue_munsell-600 dark:text-blue_munsell-400 hover:underline"
							>
								<Edit size={14} /> Edit Details
							</button>
						) : (
							<div className="flex items-center gap-2">
								<button
									type="button"
									onClick={handleSaveGeneral}
									className="inline-flex items-center gap-1 px-3 py-1 bg-blue_munsell-500 hover:bg-blue_munsell-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
								>
									<Check size={13} /> Done
								</button>
								<button
									type="button"
									onClick={handleCancelGeneral}
									className="inline-flex items-center gap-1 px-2.5 py-1 bg-french_gray-200 dark:bg-payne's_gray-700 text-outer_space-700 dark:text-platinum-200 rounded-lg text-xs font-medium"
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
									className="block text-xs font-semibold text-outer_space-600 dark:text-platinum-400 uppercase tracking-wider mb-1.5"
								>
									Project Name <span className="text-red-500">*</span>
								</label>
								<input
									id="project-title"
									type="text"
									required
									value={tempTitle}
									onChange={(e) => setTempTitle(e.target.value)}
									className="w-full rounded-xl border border-french_gray-300 dark:border-payne's_gray-600 bg-white dark:bg-outer_space-800 px-3.5 py-2.5 text-sm text-outer_space-900 dark:text-platinum-100 focus:outline-hidden focus:ring-2 focus:ring-blue_munsell-500/50"
								/>
							</div>

							{/* Description */}
							<div>
								<label
									htmlFor="project-description"
									className="block text-xs font-semibold text-outer_space-600 dark:text-platinum-400 uppercase tracking-wider mb-1.5"
								>
									Description
								</label>
								<textarea
									id="project-description"
									value={tempDescription}
									onChange={(e) => setTempDescription(e.target.value)}
									rows={3}
									className="w-full rounded-xl border border-french_gray-300 dark:border-payne's_gray-600 bg-white dark:bg-outer_space-800 px-3.5 py-2.5 text-sm text-outer_space-900 dark:text-platinum-100 focus:outline-hidden focus:ring-2 focus:ring-blue_munsell-500/50 resize-none"
								/>
							</div>
						</div>
					) : (
						<div className="space-y-3 pt-1">
							<div>
								<span className="block text-[11px] font-semibold text-outer_space-500 dark:text-platinum-400 uppercase tracking-wider">
									Project Name
								</span>
								<p className="text-base font-bold text-outer_space-900 dark:text-platinum-100 mt-0.5">
									{title}
								</p>
							</div>
							<div>
								<span className="block text-[11px] font-semibold text-outer_space-500 dark:text-platinum-400 uppercase tracking-wider">
									Description
								</span>
								<p className="text-sm text-outer_space-700 dark:text-platinum-300 mt-0.5 leading-relaxed">
									{description || "No description provided."}
								</p>
							</div>
						</div>
					)}
				</div>

				<MemberRole
					members={members}
					editingMemberId={editingMemberId}
					editMemberRole={editMemberRole}
					editMemberAccess={editMemberAccess}
					setEditMemberRole={setEditMemberRole}
					setEditMemberAccess={setEditMemberAccess}
					handleEditMemberSave={handleEditMemberSave}
					setEditingMemberId={setEditingMemberId}
					handleEditMemberStart={handleEditMemberStart}
					handleDeleteMember={handleDeleteMember}
				/>

				<ProjectLabelPriority />

				{/* Actions Footer */}
				<div className="flex items-center justify-between pt-2">
					<button
						type="button"
						onClick={() => {
							if (
								window.confirm(
									"Are you sure you want to delete this project? This action cannot be undone.",
								)
							) {
								onDelete?.();
							}
						}}
						className="inline-flex items-center gap-1.5 rounded-xl px-4 py-2.5 text-sm font-medium text-red-600 hover:bg-red-50 dark:text-red-400 dark:hover:bg-red-950/50 transition-colors"
					>
						<Trash2 size={16} />
						Delete Project
					</button>

					<button
						type="submit"
						className="inline-flex items-center gap-2 rounded-xl bg-blue_munsell-500 hover:bg-blue_munsell-600 px-5 py-2.5 text-sm font-semibold text-white shadow-md transition-all"
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
