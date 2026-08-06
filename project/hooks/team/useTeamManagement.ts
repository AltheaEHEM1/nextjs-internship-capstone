// hooks/team/useTeamManagement.ts
import { useEffect } from "react";
import {
	type TeamItem,
	type TeamState,
	useTeamStore,
} from "@/stores/team/useTeamStore";

export function useTeamManagement(initialTab?: "people" | "teams") {
	const store = useTeamStore();
	const setActiveTab = useTeamStore((s) => s.setActiveTab);

	useEffect(() => {
		if (initialTab) {
			setActiveTab(initialTab);
		}
	}, [initialTab, setActiveTab]);

	const handleMainAction = () => {
		if (store.activeTab === "people") {
			store.openAddPeopleModal();
		} else {
			store.resetTeamForm();
			store.openTeamModal();
		}
	};

	const handleSendInvites = () => {
		if (store.addPeopleContact.trim()) {
			store.sendInvitation(store.addPeopleContact);
		}
		store.closeAddPeopleModal();
		store.setAddPeopleContact("");
		store.setAddPeopleNotes("");
	};

	const handleTeamStep1Next = () => {
		if (!store.teamName.trim()) return;
		store.setTeamStep(2);
	};

	const handleTeamStep2Back = () => {
		store.setTeamStep(1);
	};

	const handleTeamStep2Submit = () => {
		const newTeam: TeamItem = {
			id: Date.now().toString(),
			name: store.teamName,
			icon: store.teamIcon,
			membersCount: store.membersList.length,
		};
		useTeamStore.setState((state: TeamState) => ({
			teams: [...state.teams, newTeam],
		}));
		store.closeTeamModal();
		store.resetTeamForm();
	};

	return {
		...store,
		handleMainAction,
		handleSendInvites,
		handleTeamStep1Next,
		handleTeamStep2Back,
		handleTeamStep2Submit,
	};
}
