import { useEffect } from "react";
import { useTeamStore } from "@/stores/team/team-store";

/* ── Shared domain types ──────────────────────────────────── */

export interface Person {
	id: string;
	name: string;
	avatar: string;
	email: string;
	role: string;
}

export interface TeamMember {
	id: string;
	name: string;
	avatar: string;
	role: string;
}

export interface Team {
	id: string;
	name: string;
	icon: string;
	coverUrl: string;
	membersCount: number;
	members: TeamMember[];
}

export interface TeamFormState {
	teamName: string;
	teamIcon: string;
	coverUrl: string;
	members: TeamMember[];
}

/* ── Hook ─────────────────────────────────────────────────── */

/**
 * Convenience hook that selects the relevant slice from the
 * team Zustand store and sets the active tab on mount.
 */
export function useTeamManagement(defaultTab: "people" | "teams") {
	const store = useTeamStore();

	useEffect(() => {
		store.setActiveTab(defaultTab);
		// Only run on mount
		// eslint-disable-next-line react-hooks/exhaustive-deps
	}, []);

	return {
		activeTab: store.activeTab,
		people: store.people,
		teams: store.teams,
		isAddPeopleOpen: store.isAddPeopleOpen,
		teamStep: store.teamStep,
		teamData: store.teamData,
		handleMainAction: store.handleMainAction,
		closeAddPeopleModal: store.closeAddPeopleModal,
		closeTeamModal: store.closeTeamModal,
		handleTeamStep1Next: store.handleTeamStep1Next,
		handleTeamStep2Back: store.handleTeamStep2Back,
		handleTeamStep2Submit: store.handleTeamStep2Submit,
	};
}
