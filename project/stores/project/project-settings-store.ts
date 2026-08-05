// stores/project-settings-store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';
import type { AccessRole, TeamMember, ProjectLabel, ProjectPriority, ProjectStatus } from '@/app/projects/project-settings/page';

/**
 * State that mirrors all settings used in the Project Settings page.
 * This consolidates the three previous custom hooks into a single global store.
 */
export interface ProjectSettingsState {
  // General project info
  title: string;
  description: string;
  team: string;
  access: AccessRole;
  // Editing helpers for general info
  isEditingGeneral: boolean;
  tempTitle: string;
  tempDescription: string;

  // Labels, priorities, statuses
  labels: ProjectLabel[];
  priorities: ProjectPriority[];
  statuses: ProjectStatus[];
  isLabelModalOpen: boolean;
  isPriorityModalOpen: boolean;
  isStatusModalOpen: boolean;

  // Team members and edit state
  members: TeamMember[];
  editingMemberId: string | null;
  editMemberRole: string;
  editMemberAccess: AccessRole;

  // -------------------------------------------------
  // Actions – setters & business logic helpers
  // -------------------------------------------------
  // General info actions
  setTitle: (title: string) => void;
  setDescription: (description: string) => void;
  setTeam: (team: string) => void;
  setAccess: (access: AccessRole) => void;
  setIsEditingGeneral: (editing: boolean) => void;
  setTempTitle: (temp: string) => void;
  setTempDescription: (temp: string) => void;
  // Save / cancel handlers for general section
  handleSaveGeneral: () => void;
  handleCancelGeneral: () => void;

  // Label / priority / status actions
  setIsLabelModalOpen: (open: boolean) => void;
  setIsPriorityModalOpen: (open: boolean) => void;
  setIsStatusModalOpen: (open: boolean) => void;
  handleAddLabel: (newLabel: ProjectLabel) => void;
  handleDeleteLabel: (index: number) => void;
  handleAddPriority: (newPriority: ProjectPriority) => void;
  handleDeletePriority: (index: number) => void;
  handleAddStatus: (newStatus: ProjectStatus) => void;
  handleDeleteStatus: (index: number) => void;

  // Member actions
  setEditMemberRole: (role: string) => void;
  setEditMemberAccess: (access: AccessRole) => void;
  setEditingMemberId: (id: string | null) => void;
  handleEditMemberStart: (member: TeamMember) => void;
  handleEditMemberSave: (id: string) => void;
  handleDeleteMember: (id: string) => void;

  // Initialise store from page props
  initialize: (payload: {
    title: string;
    description: string;
    team: string;
    access: AccessRole;
    members: TeamMember[];
    labels: ProjectLabel[];
    priorities: ProjectPriority[];
    statuses: ProjectStatus[];
  }) => void;
}

export const useProjectSettingsStore = create<ProjectSettingsState>()(
  devtools((set, get) => ({
    // ----- default values (will be overwritten by initialize) -----
    title: '',
    description: '',
    team: '',
    access: 'member',
    isEditingGeneral: false,
    tempTitle: '',
    tempDescription: '',
    labels: [],
    priorities: [],
    statuses: [],
    isLabelModalOpen: false,
    isPriorityModalOpen: false,
    isStatusModalOpen: false,
    members: [],
    editingMemberId: null,
    editMemberRole: '',
    editMemberAccess: 'member',

    // ----- setters -----
    setTitle: (title) => set({ title }),
    setDescription: (description) => set({ description }),
    setTeam: (team) => set({ team }),
    setAccess: (access) => set({ access }),
    setIsEditingGeneral: (isEditingGeneral) => set({ isEditingGeneral }),
    setTempTitle: (tempTitle) => set({ tempTitle }),
    setTempDescription: (tempDescription) => set({ tempDescription }),

    // ----- general handlers -----
    handleSaveGeneral: () => {
      const { tempTitle, tempDescription } = get();
      set({ title: tempTitle, description: tempDescription, isEditingGeneral: false });
    },
    handleCancelGeneral: () => {
      const { title, description } = get();
      set({ tempTitle: title, tempDescription: description, isEditingGeneral: false });
    },

    // ----- UI flags -----
    setIsLabelModalOpen: (open) => set({ isLabelModalOpen: open }),
    setIsPriorityModalOpen: (open) => set({ isPriorityModalOpen: open }),
    setIsStatusModalOpen: (open) => set({ isStatusModalOpen: open }),

    // ----- label actions -----
    handleAddLabel: (newLabel) => set((state) => ({ labels: [...state.labels, newLabel] })),
    handleDeleteLabel: (index) => set((state) => ({ labels: state.labels.filter((_, i) => i !== index) })),

    // ----- priority actions -----
    handleAddPriority: (newPriority) => set((state) => ({ priorities: [...state.priorities, newPriority] })),
    handleDeletePriority: (index) => set((state) => ({ priorities: state.priorities.filter((_, i) => i !== index) })),

    // ----- status actions -----
    handleAddStatus: (newStatus) => set((state) => ({ statuses: [...state.statuses, newStatus] })),
    handleDeleteStatus: (index) => set((state) => ({ statuses: state.statuses.filter((_, i) => i !== index) })),

    // ----- member actions -----
    setEditMemberRole: (role) => set({ editMemberRole: role }),
    setEditMemberAccess: (access) => set({ editMemberAccess: access }),
    setEditingMemberId: (id) => set({ editingMemberId: id }),
    handleEditMemberStart: (member) =>
      set({
        editingMemberId: member.id,
        editMemberRole: member.role,
        editMemberAccess: member.access,
      }),
    handleEditMemberSave: (id) => {
      const { members, editMemberRole, editMemberAccess } = get();
      const updated = members.map((m) =>
        m.id === id ? { ...m, role: editMemberRole, access: editMemberAccess } : m,
      );
      set({ members: updated, editingMemberId: null });
    },
    handleDeleteMember: (id) =>
      set((state) => ({ members: state.members.filter((m) => m.id !== id) })),

    // ----- initialise store from page props -----
    initialize: ({ title, description, team, access, members, labels, priorities, statuses }) => {
      set({
        title,
        description,
        team,
        access,
        tempTitle: title,
        tempDescription: description,
        members,
        labels,
        priorities,
        statuses,
      });
    },
  }))
);
