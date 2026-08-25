// stores/custom-sidebar-store.ts
"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

export interface SidebarState {
	collapsed: boolean;
	setCollapsed: (value: boolean) => void;
	isHovered: boolean;
	setIsHovered: (value: boolean) => void;
	openDropdown: string | null;
	setOpenDropdown: (label: string | null) => void;
	isMobile: boolean;
	setIsMobile: (value: boolean) => void;
}

export const useCustomSidebarStore = create<SidebarState>()(
	devtools((set) => ({
		collapsed: false,
		setCollapsed: (value) => set({ collapsed: value }),
		isHovered: false,
		setIsHovered: (value) => set({ isHovered: value }),
		openDropdown: null,
		setOpenDropdown: (label) => set({ openDropdown: label }),
		isMobile: false,
		setIsMobile: (value) => set({ isMobile: value }),
	})),
);
