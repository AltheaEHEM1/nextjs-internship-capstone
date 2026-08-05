// stores/custom-project-header-store.ts
"use client";

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface ProjectHeaderState {
  // UI flags
  dropdownOpen: boolean;
  setDropdownOpen: (open: boolean) => void;
  isCreateTaskOpen: boolean;
  setIsCreateTaskOpen: (open: boolean) => void;
  // Navigation callback — must be set by the consuming component via setNavigate
  navigate: (path: string) => void;
  setNavigate: (fn: (path: string) => void) => void;
  // Settings navigation
  handleSettings: () => void;
}

export const useCustomProjectHeaderStore = create<ProjectHeaderState>()(
  devtools((set, get) => ({
    dropdownOpen: false,
    setDropdownOpen: (open) => set({ dropdownOpen: open }),
    isCreateTaskOpen: false,
    setIsCreateTaskOpen: (open) => set({ isCreateTaskOpen: open }),
    // Fallback uses window.location; components should call setNavigate(router.push)
    navigate: (path: string) => { window.location.href = path; },
    setNavigate: (fn) => set({ navigate: fn }),
    handleSettings: () => {
      // Navigate to project settings page (adjust route as needed)
      get().navigate('/projects/project-settings');
    },
  }))
);
