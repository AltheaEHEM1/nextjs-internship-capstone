// stores/custom-sidebar-header-store.ts
"use client";

import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

export interface SidebarHeaderState {
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

export const useCustomSidebarHeaderStore = create<SidebarHeaderState>()(
  devtools((set) => ({
    isSearchOpen: false,
    setIsSearchOpen: (open) => set({ isSearchOpen: open }),
    searchQuery: "",
    setSearchQuery: (query) => set({ searchQuery: query }),
  }))
);
