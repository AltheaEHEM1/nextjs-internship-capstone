import { useEffect } from "react";
import { useTeamStore, TeamItem } from "@/stores/team/useTeamStore";

export function useTeamManagement(initialTab?: "people" | "teams") {
  const store = useTeamStore();

  useEffect(() => {
    if (initialTab) {
      store.setActiveTab(initialTab);
    }
  }, [initialTab]);

  const handleMainAction = () => {
    if (store.activeTab === "people") {
      store.openAddPeopleModal();
    } else {
      store.resetTeamForm();
      store.openTeamModal();
    }
  };

  const handleSendInvites = () => {
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
    useTeamStore.setState((state) => ({
      teams: [...state.teams, newTeam],
    }));
    store.closeTeamModal();
    store.resetTeamForm();
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      store.setCoverUrl(url);
    }
  };

  return {
    ...store,
    handleMainAction,
    handleSendInvites,
    handleTeamStep1Next,
    handleTeamStep2Back,
    handleTeamStep2Submit,
    handleFileChange,
  };
}