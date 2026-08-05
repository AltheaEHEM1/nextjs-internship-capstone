import { create } from 'zustand';
import { devtools, persist } from 'zustand/middleware';
import type { Person, Team, TeamFormState } from '@/hooks/team/useTeam';
import type { TeamMemberAssignment } from '@/stores/team/custom-add-team-member-store';

export interface TeamState {
  activeTab: 'people' | 'teams';
  setActiveTab: (tab: 'people' | 'teams') => void;
  isAddPeopleOpen: boolean;
  setAddPeopleOpen: (open: boolean) => void;
  teamStep: 0 | 1 | 2;
  setTeamStep: (step: 0 | 1 | 2) => void;
  teamData: TeamFormState;
  setTeamData: (data: Partial<TeamFormState>) => void;
  people: Person[];
  teams: Team[];
  // added for SpecificTeam page
  team: Team;
  isMenuOpen: boolean;
  isAddMemberOpen: boolean;
  toggleMenu: () => void;
  openAddMemberModal: () => void;
  closeAddMemberModal: () => void;
  // actions for modal navigation
  handleMainAction: () => void;
  closeAddPeopleModal: () => void;
  closeTeamModal: () => void;
  handleTeamStep1Next: (data: { teamName: string; teamIcon: string; coverUrl: string }) => void;
  handleTeamStep2Back: () => void;
  handleTeamStep2Submit: (members: TeamMemberAssignment[]) => void;
}

export const useTeamStore = create<TeamState>()(
  devtools(
    // persist can be toggled based on user preference
    persist(
      (set, get) => ({
        activeTab: 'people',
        setActiveTab: (tab) => set({ activeTab: tab }),
        isAddPeopleOpen: false,
        setAddPeopleOpen: (open) => set({ isAddPeopleOpen: open }),
        teamStep: 0,
        setTeamStep: (step) => set({ teamStep: step }),
        teamData: { teamName: '', teamIcon: '💻', coverUrl: '', members: [] },
        setTeamData: (partial) =>
          set((state) => ({ teamData: { ...state.teamData, ...partial } })),
        people: [
          { id: 'p1', name: 'Althea Santos', avatar: 'AS', email: 'althea@capstone.dev', role: 'Lead Developer' },
          { id: 'p2', name: 'Carlos Rivera', avatar: 'CR', email: 'carlos@capstone.dev', role: 'UI/UX Designer' },
          { id: 'p3', name: 'Maria Chen', avatar: 'MC', email: 'maria@capstone.dev', role: 'Backend Engineer' },
          { id: 'p4', name: 'James Reyes', avatar: 'JR', email: 'james@capstone.dev', role: 'QA Engineer' },
          { id: 'p5', name: 'Sofia Kim', avatar: 'SK', email: 'sofia@capstone.dev', role: 'Product Manager' },
          { id: 'p6', name: 'Daniel Cruz', avatar: 'DC', email: 'daniel@capstone.dev', role: 'DevOps Engineer' },
        ],
        teams: [
          {
            id: 'team-1',
            name: 'Core Engineering',
            icon: '⚙️',
            coverUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
            membersCount: 3,
            members: [
              { id: 'p1', name: 'Althea Santos', avatar: 'AS', role: 'Lead Developer' },
              { id: 'p3', name: 'Maria Chen', avatar: 'MC', role: 'Backend Engineer' },
              { id: 'p6', name: 'Daniel Cruz', avatar: 'DC', role: 'DevOps Engineer' },
            ],
          },
          {
            id: 'team-2',
            name: 'Design & UX',
            icon: '🎨',
            coverUrl: 'https://images.unsplash.com/photo-1558655146-9f40138edfeb?w=800&q=80',
            membersCount: 2,
            members: [
              { id: 'p2', name: 'Carlos Rivera', avatar: 'CR', role: 'UI/UX Designer' },
              { id: 'p5', name: 'Sofia Kim', avatar: 'SK', role: 'Product Manager' },
            ],
          },
          {
            id: 'team-3',
            name: 'Quality Assurance',
            icon: '🧪',
            coverUrl: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&q=80',
            membersCount: 2,
            members: [
              { id: 'p4', name: 'James Reyes', avatar: 'JR', role: 'QA Engineer' },
              { id: 'p3', name: 'Maria Chen', avatar: 'MC', role: 'Backend Engineer' },
            ],
          },
        ],
        // defaults for SpecificTeam page
        team: {
          id: 'team-1',
          name: 'Core Engineering',
          icon: '⚙️',
          coverUrl: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=800&q=80',
          membersCount: 3,
          members: [
            { id: 'p1', name: 'Althea Santos', avatar: 'AS', role: 'Lead Developer' },
            { id: 'p3', name: 'Maria Chen', avatar: 'MC', role: 'Backend Engineer' },
            { id: 'p6', name: 'Daniel Cruz', avatar: 'DC', role: 'DevOps Engineer' },
          ],
        },
        isMenuOpen: false,
        isAddMemberOpen: false,
        toggleMenu: () => set(state => ({ isMenuOpen: !state.isMenuOpen })),
        openAddMemberModal: () => set({ isAddMemberOpen: true }),
        closeAddMemberModal: () => set({ isAddMemberOpen: false }),
        handleMainAction: () => {
          const { activeTab, setAddPeopleOpen, setTeamStep } = get();
          if (activeTab === 'people') {
            setAddPeopleOpen(true);
            return;
          }
          setTeamStep(1);
        },
        closeAddPeopleModal: () => set({ isAddPeopleOpen: false }),
        closeTeamModal: () => set({ teamStep: 0 }),
        handleTeamStep1Next: (data) => {
          const { setTeamData, setTeamStep } = get();
          setTeamData(data);
          setTeamStep(2);
        },
        handleTeamStep2Back: () => set({ teamStep: 1 }),
        handleTeamStep2Submit: (members) => {
          const { teamData, setTeamStep } = get();
          const finalPayload = { ...teamData, members };
          console.log('Creating final team payload:', finalPayload);
          setTeamStep(0);
        },
      }),
      {
        name: 'team-store',
        merge: (persistedState, currentState) => {
          const persisted = persistedState as Partial<TeamState> | undefined;
          if (!persisted) return currentState;
          return {
            ...currentState,
            ...persisted,
            // Keep dummy data if persisted arrays are empty
            people: persisted.people?.length ? persisted.people : currentState.people,
            teams: persisted.teams?.length ? persisted.teams : currentState.teams,
            team: persisted.team?.id ? persisted.team : currentState.team,
          };
        },
      }
    )
  )
);
