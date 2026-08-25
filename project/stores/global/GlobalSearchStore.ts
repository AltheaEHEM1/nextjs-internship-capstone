import { create } from "zustand";

interface GlobalSearchState {
	searchQuery: string;
	setSearchQuery: (query: string) => void;
}

export const useGlobalSearchStore = create<GlobalSearchState>((set) => ({
	searchQuery: "",
	setSearchQuery: (query: string) => set({ searchQuery: query }),
}));
