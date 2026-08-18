"use client";

import { arrayMove } from "@dnd-kit/sortable";
import { create } from "zustand";
import { devtools } from "zustand/middleware";

type StatusShape = {
	notStarted: string[];
	active: string[];
	done: string[];
	closed: string[];
};

export interface CustomStatusState {
	// UI inputs for adding new status
	inputs: { [K in keyof StatusShape]: string };
	setInputs: (inputs: { [K in keyof StatusShape]: string }) => void;
	// Core data
	status: StatusShape;
	onChangeStatus: (s: StatusShape) => void;
	// Actions
	handleAdd: (category: keyof StatusShape) => void;
	handleRemove: (category: keyof StatusShape, index: number) => void;
	handleReorder: (
		category: keyof StatusShape,
		fromIndex: number,
		toIndex: number,
	) => void;
	addPrompted: (category: keyof StatusShape, label: string) => void;
	// Initializer – called from component when props become available
	initialize: (status: StatusShape, onChange: (s: StatusShape) => void) => void;
}

export const useCustomStatusStore = create<CustomStatusState>()(
	devtools((set, get) => ({
		inputs: { notStarted: "", active: "", done: "", closed: "" },
		setInputs: (inputs) => set({ inputs }),
		status: { notStarted: [], active: [], done: [], closed: [] },
		onChangeStatus: () => {},
		initialize: (status, onChange) => {
			set({ status, onChangeStatus: onChange });
		},
		handleAdd: (category) => {
			const { inputs, status, onChangeStatus } = get();
			const val = inputs[category].trim();
			if (!val) return;
			onChangeStatus({
				...status,
				[category]: [...status[category], val],
			});
			set((s) => ({
				...s,
				inputs: { ...s.inputs, [category]: "" },
			}));
		},
		handleRemove: (category, index) => {
			const { status, onChangeStatus } = get();
			onChangeStatus({
				...status,
				[category]: status[category].filter((_, i) => i !== index),
			});
		},
		handleReorder: (category, fromIndex, toIndex) => {
			const { status, onChangeStatus } = get();
			onChangeStatus({
				...status,
				[category]: arrayMove(status[category], fromIndex, toIndex),
			});
		},
		addPrompted: (category, label) => {
			const { status, onChangeStatus } = get();
			const val = prompt(`Add new status for ${label}:`);
			if (val) {
				onChangeStatus({
					...status,
					[category]: [...status[category], val],
				});
			}
		},
	})),
);
