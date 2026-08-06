import { create } from "zustand";

export interface TeamMemberAssignment {
  member: string;
  role: string;
  accessibility: string;
}

export interface Person {
  id: string;
  name: string;
  email: string;
  avatar: string;
  role: string;
}

export interface TeamItem {
  id: string;
  name: string;
  icon: string;
  membersCount: number;
}

export interface TeamDetail {
  name: string;
  icon: string;
  coverUrl: string;
  members: Array<{ id: string; name: string; avatar: string; role: string }>;
}

interface TeamState {
  activeTab: "people" | "teams";
  setActiveTab: (tab: "people" | "teams") => void;
  people: Person[];
  teams: TeamItem[];
  teamDetail: TeamDetail;
  isMenuOpen: boolean;
  isAddMemberOpen: boolean;
  isAddPeopleOpen: boolean;
  teamStep: number;
  addPeopleContact: string;
  addPeopleNotes: string;
  teamName: string;
  teamIcon: string;
  coverUrl: string;
  showEmojiPicker: boolean;
  membersList: TeamMemberAssignment[];
  currentMember: string;
  currentRole: string;
  currentAccessibility: string;
  toggleMenu: () => void;
  openAddMemberModal: () => void;
  closeAddMemberModal: () => void;
  openAddPeopleModal: () => void;
  closeAddPeopleModal: () => void;
  openTeamModal: () => void;
  closeTeamModal: () => void;
  setTeamStep: (step: number) => void;
  setAddPeopleContact: (val: string) => void;
  setAddPeopleNotes: (val: string) => void;
  setTeamName: (val: string) => void;
  setTeamIcon: (val: string) => void;
  setCoverUrl: (val: string) => void;
  setShowEmojiPicker: (val: boolean) => void;
  setCurrentMember: (val: string) => void;
  setCurrentRole: (val: string) => void;
  setCurrentAccessibility: (val: string) => void;
  setMembersList: (list: TeamMemberAssignment[]) => void;
  handleAddMemberToList: () => void;
  handleRemoveMemberFromList: (index: number) => void;
  addMembersToTeamDetail: () => void;
  resetTeamForm: () => void;
}

export const useTeamStore = create<TeamState>((set, get) => ({
  activeTab: "people",
  setActiveTab: (tab) => set({ activeTab: tab }),
  people: [
    { id: "1", name: "Alex Mercer", email: "alex@srg.tech", avatar: "AM", role: "Software Engineer" },
    { id: "2", name: "Sarah Jenkins", email: "sarah@srg.tech", avatar: "SJ", role: "Product Manager" },
  ],
  teams: [
    { id: "core-arch", name: "Core Architecture Unit", icon: "⚡", membersCount: 4 },
  ],
  teamDetail: {
    name: "Core Architecture Unit",
    icon: "⚡",
    coverUrl: "https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80",
    members: [
      { id: "1", name: "Alex Mercer", avatar: "AM", role: "Lead Architect" },
    ],
  },
  isMenuOpen: false,
  isAddMemberOpen: false,
  isAddPeopleOpen: false,
  teamStep: 0,
  addPeopleContact: "",
  addPeopleNotes: "",
  teamName: "",
  teamIcon: "🚀",
  coverUrl: "",
  showEmojiPicker: false,
  membersList: [],
  currentMember: "",
  currentRole: "",
  currentAccessibility: "member",
  toggleMenu: () => set((s) => ({ isMenuOpen: !s.isMenuOpen })),
  openAddMemberModal: () => set({ isAddMemberOpen: true }),
  closeAddMemberModal: () => set({ isAddMemberOpen: false }),
  openAddPeopleModal: () => set({ isAddPeopleOpen: true }),
  closeAddPeopleModal: () => set({ isAddPeopleOpen: false }),
  openTeamModal: () => set({ teamStep: 1 }),
  closeTeamModal: () => set({ teamStep: 0 }),
  setTeamStep: (step) => set({ teamStep: step }),
  setAddPeopleContact: (addPeopleContact) => set({ addPeopleContact }),
  setAddPeopleNotes: (addPeopleNotes) => set({ addPeopleNotes }),
  setTeamName: (teamName) => set({ teamName }),
  setTeamIcon: (teamIcon) => set({ teamIcon }),
  setCoverUrl: (coverUrl) => set({ coverUrl }),
  setShowEmojiPicker: (showEmojiPicker) => set({ showEmojiPicker }),
  setCurrentMember: (currentMember) => set({ currentMember }),
  setCurrentRole: (currentRole) => set({ currentRole }),
  setCurrentAccessibility: (currentAccessibility) => set({ currentAccessibility }),
  setMembersList: (membersList) => set({ membersList }),
  handleAddMemberToList: () => {
    const { currentMember, currentRole, currentAccessibility, membersList } = get();
    if (!currentMember) return;
    set({
      membersList: [
        ...membersList,
        { member: currentMember, role: currentRole || "Member", accessibility: currentAccessibility },
      ],
      currentMember: "",
      currentRole: "",
      currentAccessibility: "member",
    });
  },
  handleRemoveMemberFromList: (index) => {
    set((state) => ({
      membersList: state.membersList.filter((_, i) => i !== index),
    }));
  },
  addMembersToTeamDetail: () => {
    const { membersList, teamDetail } = get();
    const newMembers = membersList.map((m, index) => ({
      id: `${Date.now()}-${index}`,
      name: m.member,
      avatar: m.member.split(" ").map((n) => n[0]).join("").toUpperCase(),
      role: m.role,
    }));
    set({
      teamDetail: {
        ...teamDetail,
        members: [...teamDetail.members, ...newMembers],
      },
      membersList: [],
      isAddMemberOpen: false,
    });
  },
  resetTeamForm: () =>
    set({
      teamName: "",
      teamIcon: "🚀",
      coverUrl: "",
      membersList: [],
      currentMember: "",
      currentRole: "",
      currentAccessibility: "member",
      showEmojiPicker: false,
    }),
}));