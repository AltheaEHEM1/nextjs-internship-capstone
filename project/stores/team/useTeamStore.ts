import { create } from "zustand";

export interface PersonItem {
	id: string;
	name: string;
	email: string;
	role: string;
	avatar: string;
}

export interface InvitationItem {
	id: string;
	email: string;
	role: string;
	status: "pending" | "accepted" | "declined";
	sentAt: string;
}

export interface TeamMemberItem {
	member: string; // Member/Person ID
	role: string;
	accessibility: "administrator" | "member" | "viewer";
}

export interface TeamItem {
	id: string;
	name: string;
	icon: string;
	membersCount: number;
}

export interface TeamState {
	activeTab: "people" | "teams";

	// Modal Visibility
	isAddPeopleOpen: boolean;
	isTeamModalOpen: boolean;
	isAddMemberOpen: boolean;
	isMenuOpen: boolean;

	// Form & Wizard State
	teamStep: number;
	teamName: string;
	teamIcon: string;
	coverUrl: string;
	addPeopleContact: string;
	addPeopleNotes: string;

	// Collections
	invitations: InvitationItem[];
	people: PersonItem[];
	teams: TeamItem[];
	membersList: TeamMemberItem[];
	teamDetail: any | null;

	// Actions
	setActiveTab: (tab: "people" | "teams") => void;
	setTeamStep: (step: number) => void;
	openAddPeopleModal: () => void;
	closeAddPeopleModal: () => void;
	openTeamModal: () => void;
	closeTeamModal: () => void;
	openAddMemberModal: () => void;
	closeAddMemberModal: () => void;
	toggleMenu: () => void;

	setTeamName: (val: string) => void;
	setTeamIcon: (val: string) => void;
	setCoverUrl: (val: string) => void;
	setAddPeopleContact: (val: string) => void;
	setAddPeopleNotes: (val: string) => void;

	// Invite Flow Actions
	sendInvitation: (email: string, role?: string) => void;
	acceptInvitation: (invitationId: string) => void;

	addMemberToList: (member: TeamMemberItem) => void;
	removeMemberFromList: (index: number) => void;
	setTeamDetail: (detail: any) => void;
	resetTeamForm: () => void;
}

export const useTeamStore = create<TeamState>((set) => ({
	activeTab: "people",

	isAddPeopleOpen: false,
	isTeamModalOpen: false,
	isAddMemberOpen: false,
	isMenuOpen: false,

	teamStep: 0,
	teamName: "",
	teamIcon: "🚀",
	coverUrl: "",
	addPeopleContact: "",
	addPeopleNotes: "",

	invitations: [],
	people: [],
	teams: [],
	membersList: [],
	teamDetail: null,

	setActiveTab: (activeTab) => set({ activeTab }),
	setTeamStep: (teamStep) => set({ teamStep }),

	openAddPeopleModal: () => set({ isAddPeopleOpen: true }),
	closeAddPeopleModal: () => set({ isAddPeopleOpen: false }),

	openTeamModal: () => set({ isTeamModalOpen: true, teamStep: 1 }),
	closeTeamModal: () => set({ isTeamModalOpen: false, teamStep: 0 }),

	openAddMemberModal: () => set({ isAddMemberOpen: true }),
	closeAddMemberModal: () => set({ isAddMemberOpen: false }),
	toggleMenu: () => set((state) => ({ isMenuOpen: !state.isMenuOpen })),

	setTeamName: (teamName) => set({ teamName }),
	setTeamIcon: (teamIcon) => set({ teamIcon }),
	setCoverUrl: (coverUrl) => set({ coverUrl }),
	setAddPeopleContact: (addPeopleContact) => set({ addPeopleContact }),
	setAddPeopleNotes: (addPeopleNotes) => set({ addPeopleNotes }),

	// Step 1: Send invitation to an individual
	sendInvitation: (email, role = "Member") =>
		set((state) => ({
			invitations: [
				...state.invitations,
				{
					id: Date.now().toString(),
					email,
					role,
					status: "pending",
					sentAt: new Date().toISOString(),
				},
			],
		})),

	// Step 2: User accepts invitation -> Add them to available 'people' and update invite status
	acceptInvitation: (invitationId) =>
		set((state) => {
			const targetInvite = state.invitations.find(
				(inv) => inv.id === invitationId,
			);
			if (!targetInvite || targetInvite.status === "accepted") return state;

			const newPerson: PersonItem = {
				id: targetInvite.id,
				name: targetInvite.email.split("@")[0], // Fallback name generation
				email: targetInvite.email,
				role: targetInvite.role,
				avatar: targetInvite.email.charAt(0).toUpperCase(),
			};

			return {
				invitations: state.invitations.map((inv) =>
					inv.id === invitationId ? { ...inv, status: "accepted" } : inv,
				),
				people: [...state.people, newPerson],
			};
		}),

	addMemberToList: (member) =>
		set((state) => ({ membersList: [...state.membersList, member] })),

	removeMemberFromList: (index) =>
		set((state) => ({
			membersList: state.membersList.filter((_, i) => i !== index),
		})),

	setTeamDetail: (teamDetail) => set({ teamDetail }),

	resetTeamForm: () =>
		set({
			teamStep: 0,
			teamName: "",
			teamIcon: "🚀",
			coverUrl: "",
			membersList: [],
			addPeopleContact: "",
			addPeopleNotes: "",
		}),
}));
