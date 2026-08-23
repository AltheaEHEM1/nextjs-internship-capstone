"use client";

import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

import { useToast } from "@/hooks/toast/use-toast";
import type {
	AccessRole,
	ProjectLabel,
	ProjectStatus,
	TeamMember,
} from "@/stores/project/project-settings/ProjectSettingsStore";
import { useProjectSettingsStore } from "@/stores/project/project-settings/ProjectSettingsStore";

/**
 * Combined custom hooks containing all Hook logic (useState, useEffect, Zustand consumption)
 */

// Hook extracted from ProjectSettingsForm
export function useProjectSettingsFormActions(
	projectId: string,
	onSave?: (data: {
		title: string;
		description: string;
		team: string;
		access: AccessRole;
		members: TeamMember[];
		labels: ProjectLabel[];
		statuses: ProjectStatus[];
	}) => void,
	onDelete?: () => void,
) {
	const store = useProjectSettingsStore();
	const { toast } = useToast();
	const router = useRouter();

	const handleSaveDone = async () => {
		const req = await fetch(`/api/project/${projectId}/settings`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: store.tempTitle,
				description: store.tempDescription,
				teamId: store.teamId,
			}),
		});
		const result = await req.json();

		if (result.success) {
			toast({
				title: "Success",
				description: "Project details updated.",
			});
			store.handleSaveGeneral();
		} else {
			toast({
				title: "Error",
				description: result.error || "Failed to update project details.",
				variant: "destructive",
			});
		}
	};

	const handleSaveAll = async (e?: React.FormEvent) => {
		if (e) e.preventDefault();

		let finalTitle = store.title;
		let finalDescription = store.description;

		if (store.isEditingGeneral) {
			finalTitle = store.tempTitle;
			finalDescription = store.tempDescription;
			store.handleSaveGeneral();
		}

		const req = await fetch(`/api/project/${projectId}/settings`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify({
				name: finalTitle,
				description: finalDescription,
				teamId: store.teamId,
				statuses: store.statuses,
			}),
		});
		const result = await req.json();

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
			team: store.team,
			access: store.access,
			members: store.members,
			labels: store.labels,
			statuses: store.statuses,
		});
	};

	const handleDeleteConfirm = async () => {
		const req = await fetch(`/api/project/${projectId}`, { method: "DELETE" });
		const result = await req.json();
		if (result.success) {
			toast({
				title: "Project deleted",
				description: "Project has been successfully deleted.",
				variant: "success",
			});
			store.setIsDeleteAlertOpen(false);
			onDelete?.();
			router.push("/projects");
		} else {
			toast({
				title: "Error",
				description: result.error || "Failed to delete project.",
				variant: "destructive",
			});
		}
	};

	return {
		handleSaveDone,
		handleSaveAll,
		handleDeleteConfirm,
	};
}

// Hook extracted from MemberRole
export function useMemberRoleState() {
	const [confirmDeleteId, setConfirmDeleteId] = useState<string | null>(null);
	const {
		pendingTeamId,
		setPendingTeamId,
		availableTeams,
		setTeamId,
		setTeam,
		setMembers,
	} = useProjectSettingsStore();

	const handleConfirmTeamChange = async () => {
		if (!pendingTeamId) return;
		const newTeamId = pendingTeamId;
		const selected = availableTeams.find((t) => t.id === newTeamId);
		if (selected) {
			setTeamId(newTeamId);
			setTeam(selected.name);

			const req = await fetch(`/api/team/${newTeamId}`);
			const res = await req.json();
			if (res.success && res.data?.members) {
				const newMembers: TeamMember[] = res.data.members.map(
					(m: {
						id: string;
						name: string | null;
						email: string | null;
						role: string | null;
						permission: string | null;
					}) => ({
						id: m.id,
						name: m.name || "Unknown",
						email: m.email || "",
						role: m.role || "Member",
						access: (m.permission as AccessRole) || "member",
					}),
				);
				setMembers(newMembers);
			}
		}
		setPendingTeamId(null);
	};

	return {
		confirmDeleteId,
		setConfirmDeleteId,
		pendingTeamId,
		setPendingTeamId,
		handleConfirmTeamChange,
	};
}

// Hooks extracted from ProjectLabelPriorityStatus widgets
export function useTaskStatusesWidgetActions() {
	const { statuses, setIsStatusModalOpen, handleDeleteStatus } =
		useProjectSettingsStore();
	const { toast } = useToast();
	const [deleteStatusIdx, setDeleteStatusIdx] = useState<number | null>(null);

	const confirmRemoveStatus = () => {
		if (deleteStatusIdx !== null) {
			handleDeleteStatus(deleteStatusIdx);
			toast({
				title: "Status removed",
				description: "Status has been removed.",
				variant: "success",
			});
			setDeleteStatusIdx(null);
		}
	};

	return {
		statuses,
		setIsStatusModalOpen,
		deleteStatusIdx,
		setDeleteStatusIdx,
		confirmRemoveStatus,
	};
}

export function useProjectLabelsWidgetActions() {
	const { labels, setIsLabelModalOpen, handleDeleteLabel } =
		useProjectSettingsStore();
	const { toast } = useToast();
	const [deleteLabelIdx, setDeleteLabelIdx] = useState<number | null>(null);

	const confirmRemoveLabel = () => {
		if (deleteLabelIdx !== null) {
			handleDeleteLabel(deleteLabelIdx);
			toast({
				title: "Label removed",
				description: "Label has been removed.",
				variant: "success",
			});
			setDeleteLabelIdx(null);
		}
	};

	return {
		labels,
		setIsLabelModalOpen,
		deleteLabelIdx,
		setDeleteLabelIdx,
		confirmRemoveLabel,
	};
}

// Hook extracted from page.tsx to initialize Zustand state on mount
export function useInitializeProjectSettings(initialData: {
	initialTitle: string;
	initialDescription: string;
	initialTeam: string;
	initialTeamId: string;
	availableTeams: { id: string; name: string }[];
	initialAccess: AccessRole;
	initialMembers: TeamMember[];
	initialLabels: ProjectLabel[];
	initialStatuses: ProjectStatus[];
}) {
	// biome-ignore lint/correctness/useExhaustiveDependencies: stringify is used for deep comparison
	useEffect(() => {
		useProjectSettingsStore.getState().initialize({
			title: initialData.initialTitle,
			description: initialData.initialDescription,
			team: initialData.initialTeam,
			teamId: initialData.initialTeamId,
			availableTeams: initialData.availableTeams,
			access: initialData.initialAccess,
			members: initialData.initialMembers,
			labels: initialData.initialLabels,
			statuses: initialData.initialStatuses,
		});
	}, [JSON.stringify(initialData)]);
}

// Hook re-exporting store subscriptions for component reuse
export function useProjectSettings() {
	return useProjectSettingsStore();
}
