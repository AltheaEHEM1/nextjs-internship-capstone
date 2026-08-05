// stores/custom-add-member-store.ts
"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

type AddMemberState = {
  contact: string;
  notes: string;
  // callbacks
  onClose?: () => void;
  // setters
  setContact: (c: string) => void;
  setNotes: (n: string) => void;
  // actions
  handleSendInvites: () => void;
  // initializer
  initialize: (params: { onClose: () => void }) => void;
  // reset
  reset: () => void;
};

export const useCustomAddMemberStore = create<AddMemberState>()(
  devtools((set, get) => ({
    contact: "",
    notes: "",
    onClose: undefined,
    setContact: (c) => set({ contact: c }),
    setNotes: (n) => set({ notes: n }),
    handleSendInvites: () => {
      const { contact, notes, onClose, reset } = get();
      // Placeholder for real invite logic
      console.log({ contact, notes });
      if (onClose) onClose();
      reset();
    },
    initialize: ({ onClose }) => {
      set({ onClose });
    },
    reset: () => set({ contact: "", notes: "", onClose: undefined }),
  }))
);
