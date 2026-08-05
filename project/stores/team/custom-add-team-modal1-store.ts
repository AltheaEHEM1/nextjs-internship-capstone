// stores/custom-add-team-modal1-store.ts
"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

type InitialData = {
  teamName?: string;
  teamIcon?: string;
  coverUrl?: string;
};

export interface CustomAddTeamModal1State {
  // data
  teamName: string;
  teamIcon: string;
  coverUrl: string;
  showEmojiPicker: boolean;
  // callbacks
  onNext?: (data: { teamName: string; teamIcon: string; coverUrl: string }) => void;
  // setters
  setTeamName: (v: string) => void;
  setTeamIcon: (v: string) => void;
  setCoverUrl: (v: string) => void;
  setShowEmojiPicker: (v: boolean) => void;
  // actions
  handleFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  handleNext: () => void;
  // initializer / reset
  initialize: (params: { onNext?: (data: { teamName: string; teamIcon: string; coverUrl: string }) => void; initialData?: InitialData }) => void;
  reset: () => void;
}

export const useCustomAddTeamModal1Store = create<CustomAddTeamModal1State>()(
  devtools((set, get) => ({
    // initial state
    teamName: "",
    teamIcon: "💻",
    coverUrl: "",
    showEmojiPicker: false,
    onNext: undefined,
    // setters
    setTeamName: (v) => set({ teamName: v }),
    setTeamIcon: (v) => set({ teamIcon: v }),
    setCoverUrl: (v) => set({ coverUrl: v }),
    setShowEmojiPicker: (v) => set({ showEmojiPicker: v }),
    // actions
    handleFileChange: (e) => {
      const file = e.target.files?.[0];
      if (file) {
        const objectUrl = URL.createObjectURL(file);
        set({ coverUrl: objectUrl });
      }
    },
    handleNext: () => {
      const { teamName, teamIcon, coverUrl, onNext } = get();
      if (onNext) onNext({ teamName, teamIcon, coverUrl });
    },
    // initializer
    initialize: ({ onNext, initialData }) => {
      set({ onNext });
      if (initialData) {
        set({
          teamName: initialData.teamName ?? "",
          teamIcon: initialData.teamIcon ?? "💻",
          coverUrl: initialData.coverUrl ?? "",
        });
      }
    },
    // reset all fields
    reset: () =>
      set({
        teamName: "",
        teamIcon: "💻",
        coverUrl: "",
        showEmojiPicker: false,
        onNext: undefined,
      }),
  }))
);
