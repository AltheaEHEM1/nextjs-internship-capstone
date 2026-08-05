// stores/custom-add-team-member-store.ts
"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export type TeamMemberAssignment = {
  member: string;
  role: string;
  accessibility: string;
};

export interface CustomAddTeamMemberState {
  // data
  membersList: TeamMemberAssignment[];
  currentMember: string;
  currentRole: string;
  currentAccessibility: string;
  // callbacks
  onSubmit?: (members: TeamMemberAssignment[]) => void;
  // setters
  setMembersList: (list: TeamMemberAssignment[]) => void;
  setCurrentMember: (v: string) => void;
  setCurrentRole: (v: string) => void;
  setCurrentAccessibility: (v: string) => void;
  // actions
  handleAddToList: () => void;
  handleRemoveMember: (index: number) => void;
  handleCreate: () => void;
  // initializer / reset
  initialize: (params: { onSubmit?: (members: TeamMemberAssignment[]) => void }) => void;
  reset: () => void;
}

export const useCustomAddTeamMemberStore = create<CustomAddTeamMemberState>()(
  devtools((set, get) => ({
    membersList: [],
    currentMember: "",
    currentRole: "Member",
    currentAccessibility: "member",
    onSubmit: undefined,
    // setters
    setMembersList: (list) => set({ membersList: list }),
    setCurrentMember: (v) => set({ currentMember: v }),
    setCurrentRole: (v) => set({ currentRole: v }),
    setCurrentAccessibility: (v) => set({ currentAccessibility: v }),
    // actions
    handleAddToList: () => {
      const { currentMember, currentRole, currentAccessibility, membersList, setMembersList, setCurrentMember, setCurrentRole, setCurrentAccessibility } = get();
      if (!currentMember) return;
      if (membersList.some((m) => m.member === currentMember)) {
        alert(`${currentMember} is already added to the list.`);
        return;
      }
      const newList = [...membersList, { member: currentMember, role: currentRole || "Member", accessibility: currentAccessibility }];
      setMembersList(newList);
      setCurrentMember("");
      setCurrentRole("Member");
      setCurrentAccessibility("member");
    },
    handleRemoveMember: (index) => {
      const { membersList } = get();
      set({ membersList: membersList.filter((_, i) => i !== index) });
    },
    handleCreate: () => {
      const { membersList, onSubmit } = get();
      if (onSubmit) onSubmit(membersList);
    },
    // initializer
    initialize: ({ onSubmit }) => {
      set({ onSubmit });
    },
    // reset all fields
    reset: () => set({ membersList: [], currentMember: "", currentRole: "Member", currentAccessibility: "member", onSubmit: undefined }),
  }))
);
