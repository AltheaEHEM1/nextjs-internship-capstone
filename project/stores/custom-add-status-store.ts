// stores/custom-add-status-store.ts
"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

import type { FormEvent } from "react";

type Status = { name: string; description: string; color: string };

export interface CustomAddStatusState {
  // Form fields
  name: string;
  description: string;
  color: string;
  // Callbacks from component
  onSave: (status: Status) => void;
  onClose: () => void;
  // Setters
  setName: (name: string) => void;
  setDescription: (desc: string) => void;
  setColor: (color: string) => void;
  // Initialise with defaults and callbacks
  initialize: (
    initialName: string,
    initialDescription: string,
    initialColor: string,
    onSave: (status: Status) => void,
    onClose: () => void
  ) => void;
  // Submit handler
  handleSubmit: (e: React.FormEvent) => void;
}

export const useCustomAddStatusStore = create<CustomAddStatusState>()(
  devtools((set, get) => ({
    name: "",
    description: "",
    color: "",
    onSave: () => {},
    onClose: () => {},
    setName: (name: string) => set({ name }),
    setDescription: (desc: string) => set({ description: desc }),
    setColor: (c: string) => set({ color: c }),
    initialize: (
      initialName: string,
      initialDescription: string,
      initialColor: string,
      onSave: (status: Status) => void,
      onClose: () => void
    ) => {
      set({
        name: initialName,
        description: initialDescription,
        color: initialColor,
        onSave,
        onClose,
      });
    },
    handleSubmit: (e: FormEvent) => {
      e.preventDefault();
      const { name, description, color, onSave, onClose } = get();
      if (!name.trim()) return;
      onSave({ name: name.trim(), description, color });
      // reset fields after save
      set({ name: "", description: "", color: "" });
      onClose();
    },
  }))
);
