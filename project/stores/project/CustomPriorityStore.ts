// stores/custom-priority-store.ts
"use client";

import { create } from "zustand";
import { devtools } from "zustand/middleware";

type Priority = {
	name: string;
	description: string;
	color: string;
	level: number;
};

export interface CustomPriorityState {
	// Form fields
	name: string;
	description: string;
	color: string;
	level: number;
	// Callbacks from component
	onSave: (priority: Priority) => void;
	onClose: () => void;
	// Setters
	setName: (name: string) => void;
	setDescription: (desc: string) => void;
	setColor: (color: string) => void;
	setLevel: (level: number) => void;
	// Initialise with optional defaults and callbacks
	initialize: (
		initialName: string,
		initialDescription: string,
		initialColor: string,
		initialLevel: number,
		onSave: (priority: Priority) => void,
		onClose: () => void,
	) => void;
	// Submit handler
	handleSubmit: (e: React.FormEvent) => void;
}

export const useCustomPriorityStore = create<CustomPriorityState>()(
	devtools((set, get) => ({
		name: "",
		description: "",
		color: "",
		level: 1,
		onSave: () => {},
		onClose: () => {},
		setName: (name) => set({ name }),
		setDescription: (desc) => set({ description: desc }),
		setColor: (color) => set({ color }),
		setLevel: (level) => set({ level }),
		initialize: (
			initialName,
			initialDescription,
			initialColor,
			initialLevel,
			onSave,
			onClose,
		) => {
			set({
				name: initialName,
				description: initialDescription,
				color: initialColor,
				level: initialLevel,
				onSave,
				onClose,
			});
		},
		handleSubmit: (e) => {
			e.preventDefault();
			const { name, description, color, level, onSave, onClose } = get();
			if (!name.trim()) return;
			onSave({ name: name.trim(), description, color, level });
			// Reset fields after save
			set({ name: "", description: "", color: "", level: 1 });
			onClose();
		},
	})),
);
