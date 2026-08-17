
import { useEffect, useState } from "react";
import { createTeamWithMembersAction } from "@/actions/team/CreateTeam";
import { getUserTeamsAction, deleteTeamAction, getTeamDetailAction } from "@/actions/team/Team";
import { getAcceptedInvitesAction, getPersonDetailAction, removePersonAction, removeTeamMemberAction, updateTeamMemberAction } from "@/actions/team/TeamMember";
import { useToast } from "@/hooks/toast/use-toast";
import { type TeamItem, useTeamStore } from "@/stores/team/useTeamStore";
import { useBreadcrumbStore } from "@/stores/components/breadcrumb-store";
import { useRouter } from "next/navigation";

export function useTeamManagement(initialTab?: "people" | "teams") {
	const store = useTeamStore();
	const setActiveTab = useTeamStore((s) => s.setActiveTab);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [loadError, setLoadError] = useState<string | null>(null);
	const { toast } = useToast();

	useEffect(() => {
		if (initialTab) {
			setActiveTab(initialTab);
		}
	}, [initialTab, setActiveTab]);

	// Load real data from the database instead of relying on whatever
	// happens to already be in the (empty, on refresh) Zustand store.
	useEffect(() => {
		let cancelled = false;

		async function loadTeams() {
			const res = await getUserTeamsAction();
			if (!cancelled && res.success) {
				useTeamStore.setState({ teams: res.data as TeamItem[] });
			} else if (!cancelled && !res.success) {
				setLoadError(res.error ?? "Failed to load teams.");
			}
		}

		async function loadPeople() {
			const res = await getAcceptedInvitesAction();
			if (!cancelled && res.success) {
				useTeamStore.setState({ people: res.data as any });
			} else if (!cancelled && !res.success) {
				setLoadError(res.error ?? "Failed to load people.");
			}
		}

		loadTeams();
		loadPeople();

		return () => {
			cancelled = true;
		};
	}, []);

	const handleMainAction = () => {
		if (store.activeTab === "people") {
			store.openAddPeopleModal();
		} else {
			store.resetTeamForm();
			store.openTeamModal();
		}
	};

	const handleTeamStep1Next = () => {
		if (!store.teamName.trim()) return;
		store.setTeamStep(2);
	};

	const handleTeamStep2Back = () => {
		store.setTeamStep(1);
	};

	// Was previously faking a team into local state with Date.now() as the
	// id and never touching the database. Now actually persists the team
	// and its members via createTeamWithMembersAction, then refreshes the
	// team list from the server so the store reflects the real row.
	const handleTeamStep2Submit = async () => {
		if (!store.teamName.trim()) return;

		setIsSubmitting(true);
		setLoadError(null);
		try {
			const result = await createTeamWithMembersAction({
				name: store.teamName,
				icon: store.teamIcon,
				coverUrl: store.coverUrl || undefined,
				members: store.membersList,
			});

			if (!result.success) {
				setLoadError(result.error ?? "Failed to create team.");
				toast({
					title: "Error",
					description: result.error ?? "Failed to create team.",
					variant: "destructive",
				});
				return;
			}

			const refreshed = await getUserTeamsAction();
			if (refreshed.success) {
				useTeamStore.setState({ teams: refreshed.data as TeamItem[] });
			}

			toast({
				title: "Team created",
				description: `"${store.teamName}" has been successfully created.`,
				variant: "success",
			});

			store.closeTeamModal();
			store.resetTeamForm();
		} catch {
			toast({
				title: "Error",
				description: "An unexpected error occurred while creating the team.",
				variant: "destructive",
			});
		} finally {
			setIsSubmitting(false);
		}
	};

	return {
		...store,
		isSubmitting,
		loadError,
		handleMainAction,
		handleTeamStep1Next,
		handleTeamStep2Back,
		handleTeamStep2Submit,
	};
}

export function usePersonManagement(personId: string) {
	const store = useTeamStore();
	const setBreadcrumbMapping = useBreadcrumbStore((s) => s.setMapping);
	const { toast } = useToast();
	const router = useRouter();

	useEffect(() => {
		let isMounted = true;
		async function fetchPersonDetail() {
			if (!personId) return;
			store.setIsPersonLoading(true);
			store.setPersonError(null);
			const res = await getPersonDetailAction(personId);
			if (!isMounted) return;

			if (res.success && res.data) {
				store.setPersonDetail(res.data);
				setBreadcrumbMapping(personId, res.data.name);
			} else {
				store.setPersonError(res.error || "Person not found.");
			}
			store.setIsPersonLoading(false);
		}

		fetchPersonDetail();

		return () => {
			isMounted = false;
		};
	}, [personId, setBreadcrumbMapping, store]);

	const handleDeleteClick = () => {
		store.setIsPersonConfirmOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!store.personDetail) return;
		store.setIsPersonDeleting(true);
		const res = await removePersonAction(store.personDetail.id);
		if (res.success) {
			store.removePerson(store.personDetail.id);
			toast({
				title: "Member removed",
				description: `${store.personDetail.name} has been successfully removed.`,
				variant: "destructive",
			});
			store.setIsPersonConfirmOpen(false);
			router.push("/team");
		} else {
			toast({
				title: "Error",
				description: res.error || "Failed to remove member.",
				variant: "destructive",
			});
			store.setIsPersonConfirmOpen(false);
		}
		store.setIsPersonDeleting(false);
	};

	return {
		personDetail: store.personDetail,
		isLoading: store.isPersonLoading,
		error: store.personError,
		isDeleting: store.isPersonDeleting,
		confirmOpen: store.isPersonConfirmOpen,
		setConfirmOpen: store.setIsPersonConfirmOpen,
		handleDeleteClick,
		handleDeleteConfirm,
	};
}

export function useTeamDetailManagement(teamId: string) {
	const store = useTeamStore();
	const setBreadcrumbMapping = useBreadcrumbStore((s) => s.setMapping);
	const { toast } = useToast();
	const router = useRouter();

	const closeConfirm = () =>
		store.setTeamConfirmState({ opened: false, loading: false });

	const closeEditRole = () =>
		store.setTeamEditRoleState({ opened: false, loading: false });

	const handleDeleteTeam = () => {
		store.setTeamConfirmState({
			opened: true,
			title: "Delete Team",
			description:
				"Are you sure you want to delete this team? This action cannot be undone and all members will be removed.",
			confirmLabel: "Delete Team",
			loading: false,
			onConfirm: async () => {
				store.setTeamConfirmState({ loading: true });
				const res = await deleteTeamAction(teamId);
				if (res.success) {
					toast({
						title: "Team deleted",
						description: "The team has been successfully deleted.",
						variant: "destructive",
					});
					closeConfirm();
					router.push("/team");
				} else {
					toast({
						title: "Error",
						description: res.error || "Failed to delete team.",
						variant: "destructive",
					});
					closeConfirm();
				}
			},
		});
	};

	const handleDeleteMember = (userId: string, memberName?: string) => {
		store.setTeamConfirmState({
			opened: true,
			title: "Remove Member",
			description: `Are you sure you want to remove ${memberName || "this member"} from the team? They will lose access to this team.`,
			confirmLabel: "Remove Member",
			loading: false,
			onConfirm: async () => {
				store.setTeamConfirmState({ loading: true });
				const res = await removeTeamMemberAction(teamId, userId);
				if (res.success) {
					toast({
						title: "Member removed",
						description: `${memberName || "The member"} has been successfully removed.`,
						variant: "destructive",
					});
					closeConfirm();
					// Refresh team detail in store
					const refreshed = await getTeamDetailAction(teamId);
					if (refreshed.success && refreshed.data) {
						store.setTeamDetail(refreshed.data as any);
					}
				} else {
					toast({
						title: "Error",
						description: res.error || "Failed to remove member.",
						variant: "destructive",
					});
					closeConfirm();
				}
			},
		});
	};

	const handleEditMemberClick = (userId: string, memberName: string, currentRole: string, currentPermission: string) => {
		store.setTeamEditRoleState({
			opened: true,
			userId,
			memberName,
			currentRole,
			currentPermission,
			loading: false,
		});
	};

	const submitEditRole = async (newRole: string, newPermission: string) => {
		if ((newRole && newRole !== store.teamEditRoleState.currentRole) || newPermission !== store.teamEditRoleState.currentPermission) {
			store.setTeamEditRoleState({ loading: true });
			const res = await updateTeamMemberAction({
				teamId,
				userId: store.teamEditRoleState.userId,
				role: newRole,
				permission: newPermission as "administrator" | "member" | "viewer",
			});
			if (res.success) {
				toast({
					title: "Role updated",
					description: "The member's role has been successfully updated.",
					variant: "success",
				});
				const refreshed = await getTeamDetailAction(teamId);
				if (refreshed.success && refreshed.data) {
					store.setTeamDetail(refreshed.data as any);
				}
				closeEditRole();
			} else {
				toast({
					title: "Error",
					description: res.error || "Failed to update member role.",
					variant: "destructive",
				});
				store.setTeamEditRoleState({ loading: false });
			}
		} else {
			closeEditRole();
		}
	};

	useEffect(() => {
		let cancelled = false;

		async function loadTeamDetail() {
			store.setIsTeamDetailLoading(true);
			store.setTeamDetailError(null);
			const res = await getTeamDetailAction(teamId);
			if (cancelled) return;

			if (res.success && res.data) {
				store.setTeamDetail(res.data as any);
				setBreadcrumbMapping(teamId, (res.data as any).name);
			} else {
				store.setTeamDetailError(res.error ?? "Failed to load team.");
				store.setTeamDetail(null);
			}
			store.setIsTeamDetailLoading(false);
		}

		if (teamId) loadTeamDetail();

		return () => {
			cancelled = true;
		};
	}, [teamId, store, setBreadcrumbMapping]);

	return {
		teamDetail: store.teamDetail,
		loading: store.isTeamDetailLoading,
		error: store.teamDetailError,
		confirmState: store.teamConfirmState,
		editRoleState: store.teamEditRoleState,
		isMenuOpen: store.isMenuOpen,
		isAddMemberOpen: store.isAddMemberOpen,
		toggleMenu: store.toggleMenu,
		openAddMemberModal: store.openAddMemberModal,
		closeAddMemberModal: store.closeAddMemberModal,
		closeConfirm,
		closeEditRole,
		handleDeleteTeam,
		handleDeleteMember,
		handleEditMemberClick,
		submitEditRole,
	};
}

