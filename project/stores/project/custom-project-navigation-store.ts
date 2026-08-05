// stores/custom-project-navigation-store.ts
"use client";

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ProjectNavigationState {
  /** Currently active navigation slug (e.g., "summary", "list", "") */
  activeSlug: string;
  /** Set the active slug */
  setActiveSlug: (slug: string) => void;
}

export const useCustomProjectNavigationStore = create<ProjectNavigationState>()(
  devtools((set) => ({
    activeSlug: "",
    setActiveSlug: (slug) => set({ activeSlug: slug }),
  }))
);
