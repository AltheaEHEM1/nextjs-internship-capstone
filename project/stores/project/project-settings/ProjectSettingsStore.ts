import { create } from "zustand";

export type AccessRole = "administrator" | "member" | "viewer";

export interface TeamMember {
    id: string;
    name: string;
    email: string;
    role: string;
    access: AccessRole;
}

export interface ProjectLabel {
    name: string;
    color: string;
}


export interface ProjectStatus {
    id?: string;
    name: string;
    description: string;
    color: string;
}

interface ProjectSettingsState {
    // General Settings State
    title: string;
    description: string;
    team: string; // The team name
    teamId: string; // The team ID
    availableTeams: { id: string; name: string }[];
    access: AccessRole;
    isEditingGeneral: boolean;
    tempTitle: string;
    tempDescription: string;
    tempTeamId: string;

    // Data Collections
    members: TeamMember[];
    labels: ProjectLabel[];
    statuses: ProjectStatus[];

    // Edit Member State
    editingMemberId: string | null;
    editMemberRole: string;
    editMemberAccess: AccessRole;

    // Modals State
    isLabelModalOpen: boolean;
    isStatusModalOpen: boolean;

    // Actions & Handlers
    initialize: (data: {
        title: string;
        description: string;
        team: string;
        teamId: string;
        availableTeams: { id: string; name: string }[];
        access: AccessRole;
        members: TeamMember[];
        labels: ProjectLabel[];
        statuses: ProjectStatus[];
    }) => void;
    setTitle: (title: string) => void;
    setDescription: (description: string) => void;
    setTeam: (team: string) => void;
    setTeamId: (teamId: string) => void;
    setAccess: (access: AccessRole) => void;
    setIsEditingGeneral: (isEditing: boolean) => void;
    setMembers: (members: TeamMember[]) => void;
    setTempTitle: (tempTitle: string) => void;
    setTempDescription: (tempDescription: string) => void;
    setTempTeamId: (tempTeamId: string) => void;
    handleSaveGeneral: () => void;
    handleCancelGeneral: () => void;

    // Modal Actions
    setIsLabelModalOpen: (isOpen: boolean) => void;
    setIsStatusModalOpen: (isOpen: boolean) => void;

    // Entity Handlers
    handleAddLabel: (label: ProjectLabel) => void;
    handleDeleteLabel: (index: number) => void;
    handleAddStatus: (status: ProjectStatus) => void;
    handleDeleteStatus: (index: number) => void;

    // Member Actions
    setEditMemberRole: (role: string) => void;
    setEditMemberAccess: (access: AccessRole) => void;
    setEditingMemberId: (id: string | null) => void;
    handleEditMemberStart: (member: TeamMember) => void;
    handleEditMemberSave: (id: string) => void;
    handleDeleteMember: (id: string) => void;
}

export const useProjectSettingsStore = create<ProjectSettingsState>((set, get) => ({
    title: "",
    description: "",
    team: "",
    teamId: "",
    availableTeams: [],
    access: "administrator",
    isEditingGeneral: false,
    tempTitle: "",
    tempDescription: "",
    tempTeamId: "",

    members: [],
    labels: [],
    statuses: [],

    editingMemberId: null,
    editMemberRole: "",
    editMemberAccess: "member",

    isLabelModalOpen: false,
    isStatusModalOpen: false,

    initialize: (data) =>
        set({
            title: data.title,
            description: data.description,
            team: data.team,
            teamId: data.teamId,
            availableTeams: data.availableTeams,
            access: data.access,
            tempTitle: data.title,
            tempDescription: data.description,
            tempTeamId: data.teamId,
            members: data.members,
            labels: data.labels,
            statuses: data.statuses,
        }),

    setTitle: (title) => set({ title }),
    setDescription: (description) => set({ description }),
    setTeam: (team) => set({ team }),
    setTeamId: (teamId) => set({ teamId }),
    setMembers: (members) => set({ members }),
    setAccess: (access) => set({ access }),
    setIsEditingGeneral: (isEditingGeneral) => set({ isEditingGeneral }),
    setTempTitle: (tempTitle) => set({ tempTitle }),
    setTempDescription: (tempDescription) => set({ tempDescription }),
    setTempTeamId: (tempTeamId) => set({ tempTeamId }),

    handleSaveGeneral: () => {
        const { tempTitle, tempDescription } = get();

        set({
            title: tempTitle,
            description: tempDescription,
            isEditingGeneral: false,
        });
    },

    handleCancelGeneral: () => {
        const { title, description } = get();
        set({
            tempTitle: title,
            tempDescription: description,
            isEditingGeneral: false,
        });
    },

    setIsLabelModalOpen: (isLabelModalOpen) => set({ isLabelModalOpen }),
    setIsStatusModalOpen: (isStatusModalOpen) => set({ isStatusModalOpen }),

    handleAddLabel: (label) => set((state) => ({ labels: [...state.labels, label] })),
    handleDeleteLabel: (index) =>
        set((state) => ({ labels: state.labels.filter((_, i) => i !== index) })),


    handleAddStatus: (status) => set((state) => ({ statuses: [...state.statuses, status] })),
    handleDeleteStatus: (index) =>
        set((state) => ({ statuses: state.statuses.filter((_, i) => i !== index) })),

    setEditMemberRole: (editMemberRole) => set({ editMemberRole }),
    setEditMemberAccess: (editMemberAccess) => set({ editMemberAccess }),
    setEditingMemberId: (editingMemberId) => set({ editingMemberId }),

    handleEditMemberStart: (member) =>
        set({
            editingMemberId: member.id,
            editMemberRole: member.role,
            editMemberAccess: member.access,
        }),

    handleEditMemberSave: (id) =>
        set((state) => ({
            members: state.members.map((m) =>
                m.id === id
                    ? { ...m, role: state.editMemberRole, access: state.editMemberAccess }
                    : m
            ),
            editingMemberId: null,
        })),

    handleDeleteMember: (id) =>
        set((state) => ({
            members: state.members.filter((m) => m.id !== id),
        })),
}));