import { create } from "zustand";

interface PublicState {
	// About section state
	aboutActiveTab: number;
	setAboutActiveTab: (tab: number | ((prev: number) => number)) => void;

	// Pricing section state
	isYearly: boolean;
	setIsYearly: (isYearly: boolean) => void;
	openFaq: number | null;
	setOpenFaq: (faq: number | null) => void;
	mousePosition: { x: number; y: number };
	setMousePosition: (pos: { x: number; y: number }) => void;
}

export const usePublicStore = create<PublicState>((set) => ({
	// About
	aboutActiveTab: 0,
	setAboutActiveTab: (tab) =>
		set((state) => ({
			aboutActiveTab:
				typeof tab === "function" ? tab(state.aboutActiveTab) : tab,
		})),

	// Pricing
	isYearly: false,
	setIsYearly: (isYearly) => set({ isYearly }),
	openFaq: null,
	setOpenFaq: (openFaq) => set({ openFaq }),
	mousePosition: { x: 0, y: 0 },
	setMousePosition: (mousePosition) => set({ mousePosition }),
}));
