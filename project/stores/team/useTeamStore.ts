import { create } from "zustand";

export interface PersonItem {
	id: string;
	name: string;
	email: string;
	avatar?: string | null;
	role?: string;
	projects?: {
		id: number | string;
		name: string;
		role: string;
		status: string;
	}[];
	teams?: { id: string; name: string; icon: string }[];
}

export interface TeamItem {
	id: string;
	name: string;
	icon?: string | null;
	coverUrl?: string | null;
	membersCount?: number;
}

export interface TeamMemberInput {
	userId: string;
	role: string;
	permission: "administrator" | "member" | "viewer";
}

export interface TeamDetail extends TeamItem {
	members: Array<{
		id: string;
		userId: string;
		role: string | null;
		permission: "administrator" | "member" | "viewer";
		name: string;
		email: string;
		avatar?: string | null;
	}>;
}

export interface PersonDetail {
	id: string;
	name: string;
	email: string;
	avatar?: string | null;
	role?: string;
	teams: { id: string; name: string; icon: string; coverUrl?: string | null; role?: string }[];
	projects: {
		id: string | number;
		name: string;
		role: string;
		status: string;
	}[];
}

export interface TeamState {
	// tab + lists
	activeTab: "people" | "teams";
	people: PersonItem[];
	teams: TeamItem[];
	teamDetail: TeamDetail | null;

	// "Add People" modal
	isAddPeopleOpen: boolean;
	addPeopleContact: string;
	addPeopleNotes: string;

	// "Create Team" 2-step modal
	isTeamModalOpen: boolean;
	teamStep: number; // 0 = closed, 1 = step 1, 2 = step 2
	teamName: string;
	teamIcon: string;
	coverUrl: string;
	membersList: TeamMemberInput[];

	// Specific team page
	isMenuOpen: boolean;
	isAddMemberOpen: boolean;
	isTeamDetailLoading: boolean;
	teamDetailError: string | null;
	teamConfirmState: {
		opened: boolean;
		title: string;
		description: string;
		confirmLabel: string;
		onConfirm: () => void;
		loading: boolean;
	};
	teamEditRoleState: {
		opened: boolean;
		userId: string;
		memberName: string;
		currentRole: string;
		currentPermission: string;
		loading: boolean;
	};

	// Person Detail
	personDetail: PersonDetail | null;
	isPersonLoading: boolean;
	personError: string | null;
	isPersonDeleting: boolean;
	isPersonConfirmOpen: boolean;

	// setters
	setActiveTab: (tab: "people" | "teams") => void;
	setPeople: (people: PersonItem[]) => void;
	setTeams: (teams: TeamItem[]) => void;
	setTeamDetail: (team: TeamDetail | null) => void;
	setAddPeopleContact: (v: string) => void;
	setAddPeopleNotes: (v: string) => void;
	openAddPeopleModal: () => void;
	closeAddPeopleModal: () => void;
	setTeamName: (v: string) => void;
	setTeamIcon: (v: string) => void;
	setCoverUrl: (v: string) => void;
	setTeamStep: (step: number) => void;
	openTeamModal: () => void;
	closeTeamModal: () => void;
	resetTeamForm: () => void;
	addMemberToList: (member: TeamMemberInput) => void;
	removeMemberFromList: (userId: string) => void;
	removePerson: (id: string) => void;
	toggleMenu: () => void;
	openAddMemberModal: () => void;
	closeAddMemberModal: () => void;
	setIsTeamDetailLoading: (v: boolean) => void;
	setTeamDetailError: (v: string | null) => void;
	setTeamConfirmState: (state: Partial<TeamState["teamConfirmState"]>) => void;
	setTeamEditRoleState: (state: Partial<TeamState["teamEditRoleState"]>) => void;

	setPersonDetail: (p: PersonDetail | null) => void;
	setIsPersonLoading: (v: boolean) => void;
	setPersonError: (v: string | null) => void;
	setIsPersonDeleting: (v: boolean) => void;
	setIsPersonConfirmOpen: (v: boolean) => void;
}

const formDefaults = {
	teamName: "",
	teamIcon: "🚀",
	coverUrl: "",
	teamStep: 0,
	isTeamModalOpen: false,
	membersList: [] as TeamMemberInput[],
};

export const useTeamStore = create<TeamState>((set, _get) => ({
	activeTab: "people",
	people: [],
	teams: [],
	teamDetail: null,
	isAddPeopleOpen: false,
	addPeopleContact: "",
	addPeopleNotes: "",
	...formDefaults,
	isMenuOpen: false,
	isAddMemberOpen: false,
	isTeamDetailLoading: true,
	teamDetailError: null,
	teamConfirmState: {
		opened: false,
		title: "",
		description: "",
		confirmLabel: "",
		onConfirm: () => { },
		loading: false,
	},
	teamEditRoleState: {
		opened: false,
		userId: "",
		memberName: "",
		currentRole: "",
		currentPermission: "member",
		loading: false,
	},
	personDetail: null,
	isPersonLoading: true,
	personError: null,
	isPersonDeleting: false,
	isPersonConfirmOpen: false,

	setActiveTab: (tab) => set({ activeTab: tab }),
	setPeople: (people) => set({ people }),
	setTeams: (teams) => set({ teams }),
	setTeamDetail: (team) => set({ teamDetail: team }),
	setAddPeopleContact: (v) => set({ addPeopleContact: v }),
	setAddPeopleNotes: (v) => set({ addPeopleNotes: v }),
	openAddPeopleModal: () => set({ isAddPeopleOpen: true }),
	closeAddPeopleModal: () => set({ isAddPeopleOpen: false }),
	setTeamName: (v) => set({ teamName: v }),
	setTeamIcon: (v) => set({ teamIcon: v }),
	setCoverUrl: (v) => set({ coverUrl: v }),
	setTeamStep: (step) => set({ teamStep: step, isTeamModalOpen: step > 0 }),
	openTeamModal: () => set({ isTeamModalOpen: true, teamStep: 1 }),
	closeTeamModal: () => set({ isTeamModalOpen: false, teamStep: 0 }),
	resetTeamForm: () => set({ ...formDefaults }),

	addMemberToList: (member) =>
		set((state) => {
			const exists = state.membersList.some((m) => m.userId === member.userId);
			if (exists) return state;
			return { membersList: [...state.membersList, member] };
		}),

	removeMemberFromList: (userId) =>
		set((state) => ({
			membersList: state.membersList.filter((m) => m.userId !== userId),
		})),

	removePerson: (id) =>
		set((state) => ({
			people: state.people.filter((p) => p.id !== id),
		})),

	toggleMenu: () => set((s) => ({ isMenuOpen: !s.isMenuOpen })),
	openAddMemberModal: () => set({ isAddMemberOpen: true, isMenuOpen: false }),
	closeAddMemberModal: () => set({ isAddMemberOpen: false }),
	setIsTeamDetailLoading: (v) => set({ isTeamDetailLoading: v }),
	setTeamDetailError: (v) => set({ teamDetailError: v }),
	setTeamConfirmState: (state) => set((s) => ({ teamConfirmState: { ...s.teamConfirmState, ...state } })),
	setTeamEditRoleState: (state) => set((s) => ({ teamEditRoleState: { ...s.teamEditRoleState, ...state } })),

	setPersonDetail: (p) => set({ personDetail: p }),
	setIsPersonLoading: (v) => set({ isPersonLoading: v }),
	setPersonError: (v) => set({ personError: v }),
	setIsPersonDeleting: (v) => set({ isPersonDeleting: v }),
	setIsPersonConfirmOpen: (v) => set({ isPersonConfirmOpen: v }),
}));
