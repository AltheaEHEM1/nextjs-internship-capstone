// hooks/team/useTeamManagement.ts
import { useEffect, useState } from "react";
import { createTeamWithMembersAction } from "@/actions/team/CreateTeam";
import { getUserTeamsAction } from "@/actions/team/Team";
import { getAcceptedInvitesAction } from "@/actions/team/TeamMember";
import { type TeamItem, useTeamStore } from "@/stores/team/useTeamStore";

export function useTeamManagement(initialTab?: "people" | "teams") {
	const store = useTeamStore();
	const setActiveTab = useTeamStore((s) => s.setActiveTab);
	const [isSubmitting, setIsSubmitting] = useState(false);
	const [loadError, setLoadError] = useState<string | null>(null);

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
				return;
			}

			const refreshed = await getUserTeamsAction();
			if (refreshed.success) {
				useTeamStore.setState({ teams: refreshed.data as TeamItem[] });
			}

			store.closeTeamModal();
			store.resetTeamForm();
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
