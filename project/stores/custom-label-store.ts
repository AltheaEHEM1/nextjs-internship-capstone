// stores/custom-label-store.ts
"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Label = { name: string; color: string };

export interface CustomLabelState {
  // Form fields
  name: string;
  selectedColor: string;
  // Callbacks from component
  onSave: (label: Label) => void;
  onClose: () => void;
  // Setters
  setName: (name: string) => void;
  setSelectedColor: (color: string) => void;
  // Initialise with optional defaults and callbacks
  initialize: (initialName: string, initialColor: string, onSave: (label: Label) => void, onClose: () => void) => void;
  // Submit handler
  handleSubmit: (e: React.FormEvent) => void;
}

export const useCustomLabelStore = create<CustomLabelState>()(
  devtools((set, get) => ({
    name: "",
    selectedColor: "",
    onSave: () => {},
    onClose: () => {},
    setName: (name) => set({ name }),
    setSelectedColor: (color) => set({ selectedColor: color }),
    initialize: (initialName, initialColor, onSave, onClose) => {
      set({ name: initialName, selectedColor: initialColor, onSave, onClose });
    },
    handleSubmit: (e) => {
      e.preventDefault();
      const { name, selectedColor, onSave, onClose } = get();
      if (!name.trim()) return;
      onSave({ name: name.trim(), color: selectedColor });
      set({ name: "", selectedColor: "" });
      onClose();
    },
  }))
);
