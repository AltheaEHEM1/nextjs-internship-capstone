import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { useToast } from "@/hooks/toast/use-toast";
import { useBreadcrumbStore } from "@/stores/components/BreadCrumbStore";
import { type TeamItem, useTeamStore } from "@/stores/team/TeamStore";

export function useTeamManagement(initialTab?: "people" | "teams") {
	const store = useTeamStore();
	const setActiveTab = useTeamStore((s) => s.setActiveTab);
	const [isLoading, setIsLoading] = useState(true);
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

		async function loadData() {
			setIsLoading(true);
			try {
				const [teamsReq, peopleReq] = await Promise.all([
					fetch("/api/team/user-teams"),
					fetch("/api/team/members/accepted-invites"),
				]);
				const [teamsRes, peopleRes] = await Promise.all([
					teamsReq.json(),
					peopleReq.json(),
				]);

				if (!cancelled) {
					if (teamsRes.success) {
						useTeamStore.setState({ teams: teamsRes.data as TeamItem[] });
					} else {
						setLoadError(teamsRes.error ?? "Failed to load teams.");
					}

					if (peopleRes.success) {
						useTeamStore.setState({ people: peopleRes.data as never });
					} else {
						setLoadError(peopleRes.error ?? "Failed to load people.");
					}
				}
			} catch {
				if (!cancelled) {
					setLoadError("Failed to load team data.");
				}
			} finally {
				if (!cancelled) {
					setIsLoading(false);
				}
			}
		}

		loadData();

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
			const req = await fetch("/api/team/create", {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({
					name: store.teamName,
					icon: store.teamIcon,
					coverUrl: store.coverUrl || undefined,
					members: store.membersList,
				}),
			});
			const result = await req.json();

			if (!result.success) {
				setLoadError(result.error ?? "Failed to create team.");
				toast({
					title: "Error",
					description: result.error ?? "Failed to create team.",
					variant: "destructive",
				});
				return;
			}

			const reqRefreshed = await fetch("/api/team/user-teams");
			const refreshed = await reqRefreshed.json();
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
		isLoading,
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

	const setIsPersonLoading = store.setIsPersonLoading;
	const setPersonError = store.setPersonError;
	const setPersonDetail = store.setPersonDetail;

	useEffect(() => {
		let isMounted = true;
		async function fetchPersonDetail() {
			if (!personId) return;
			setIsPersonLoading(true);
			setPersonError(null);
			const req = await fetch(`/api/team/members/${personId}`);
			const res = await req.json();
			if (!isMounted) return;

			if (res.success && res.data) {
				setPersonDetail(res.data);
				setBreadcrumbMapping(personId, res.data.name);
			} else {
				setPersonError(res.error || "Person not found.");
			}
			setIsPersonLoading(false);
		}

		fetchPersonDetail();

		return () => {
			isMounted = false;
		};
	}, [
		personId,
		setBreadcrumbMapping,
		setIsPersonLoading,
		setPersonError,
		setPersonDetail,
	]);

	const handleDeleteClick = () => {
		store.setIsPersonConfirmOpen(true);
	};

	const handleDeleteConfirm = async () => {
		if (!store.personDetail) return;
		store.setIsPersonDeleting(true);
		const req = await fetch(`/api/team/members/${store.personDetail.id}`, {
			method: "DELETE",
		});
		const res = await req.json();
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
				const req = await fetch(`/api/team/${teamId}`, { method: "DELETE" });
				const res = await req.json();
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
				const req = await fetch(`/api/team/${teamId}/members/${userId}`, {
					method: "DELETE",
				});
				const res = await req.json();
				if (res.success) {
					toast({
						title: "Member removed",
						description: `${memberName || "The member"} has been successfully removed.`,
						variant: "destructive",
					});
					closeConfirm();
					// Refresh team detail in store
					const reqRefreshed = await fetch(`/api/team/${teamId}`);
					const refreshed = await reqRefreshed.json();
					if (refreshed.success && refreshed.data) {
						store.setTeamDetail(refreshed.data as never);
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

	const handleEditMemberClick = (
		userId: string,
		memberName: string,
		currentRole: string,
		currentPermission: string,
	) => {
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
		if (
			(newRole && newRole !== store.teamEditRoleState.currentRole) ||
			newPermission !== store.teamEditRoleState.currentPermission
		) {
			store.setTeamEditRoleState({ loading: true });
			const req = await fetch(
				`/api/team/${teamId}/members/${store.teamEditRoleState.userId}`,
				{
					method: "PATCH",
					headers: { "Content-Type": "application/json" },
					body: JSON.stringify({
						role: newRole,
						permission: newPermission as "administrator" | "member" | "viewer",
					}),
				},
			);
			const res = await req.json();
			if (res.success) {
				toast({
					title: "Role updated",
					description: "The member's role has been successfully updated.",
					variant: "success",
				});
				const refreshedReq = await fetch(`/api/team/${teamId}`);
				const refreshed = await refreshedReq.json();
				if (refreshed.success && refreshed.data) {
					store.setTeamDetail(refreshed.data as never);
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

	const submitEditTeam = async (data: {
		name: string;
		icon: string;
		coverUrl: string;
	}) => {
		const req = await fetch(`/api/team/${teamId}`, {
			method: "PATCH",
			headers: { "Content-Type": "application/json" },
			body: JSON.stringify(data),
		});
		const res = await req.json();
		if (res.success) {
			toast({
				title: "Team updated",
				description: "The team details have been successfully updated.",
				variant: "success",
			});
			// Refresh team detail in store
			const reqRefreshed = await fetch(`/api/team/${teamId}`);
			const refreshed = await reqRefreshed.json();
			if (refreshed.success && refreshed.data) {
				store.setTeamDetail(refreshed.data as never);
			}
		} else {
			toast({
				title: "Error",
				description: res.error || "Failed to update team.",
				variant: "destructive",
			});
			throw new Error(res.error || "Failed to update team.");
		}
	};

	const setIsTeamDetailLoading = store.setIsTeamDetailLoading;
	const setTeamDetailError = store.setTeamDetailError;
	const setTeamDetail = store.setTeamDetail;

	useEffect(() => {
		let cancelled = false;

		async function loadTeamDetail() {
			setIsTeamDetailLoading(true);
			setTeamDetailError(null);
			const req = await fetch(`/api/team/${teamId}`);
			const res = await req.json();
			if (cancelled) return;

			if (res.success && res.data) {
				setTeamDetail(res.data as never);
				setBreadcrumbMapping(teamId, (res.data as { name: string }).name);
			} else {
				setTeamDetailError(res.error ?? "Failed to load team.");
				setTeamDetail(null);
			}
			setIsTeamDetailLoading(false);
		}

		if (teamId) loadTeamDetail();

		return () => {
			cancelled = true;
		};
	}, [
		teamId,
		setBreadcrumbMapping,
		setIsTeamDetailLoading,
		setTeamDetailError,
		setTeamDetail,
	]);

	return {
		teamDetail: store.teamDetail,
		loading: store.isTeamDetailLoading,
		error: store.teamDetailError,
		confirmState: store.teamConfirmState,
		editRoleState: store.teamEditRoleState,
		isMenuOpen: store.isMenuOpen,
		isAddMemberOpen: store.isAddMemberOpen,
		isEditTeamModalOpen: store.isEditTeamModalOpen,
		editTeamData: store.editTeamData,
		openEditTeamModal: store.openEditTeamModal,
		closeEditTeamModal: store.closeEditTeamModal,
		toggleMenu: store.toggleMenu,
		openAddMemberModal: store.openAddMemberModal,
		closeAddMemberModal: store.closeAddMemberModal,
		closeConfirm,
		closeEditRole,
		handleDeleteTeam,
		handleDeleteMember,
		handleEditMemberClick,
		submitEditRole,
		submitEditTeam,
	};
}
