import { create } from "zustand";

interface BreadcrumbState {
	mappings: Record<string, string>;
	setMapping: (id: string, name: string) => void;
}

export const useBreadcrumbStore = create<BreadcrumbState>((set) => ({
	mappings: {},
	setMapping: (id, name) =>
		set((state) => ({ mappings: { ...state.mappings, [id]: name } })),
}));
