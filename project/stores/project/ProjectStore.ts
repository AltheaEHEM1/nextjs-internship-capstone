// Project Zustand store
import { create } from "zustand";
import { devtools } from "zustand/middleware";
import type { AccessRole } from "@/components/modals/project/CreateProject1Modal";

type ModalStep = "closed" | "step1" | "step2";

interface ProjectForm {
	projectName: string;
	description: string;
	access: AccessRole;
	team: string;
	dueDate: string;
}

export interface ProjectState {
	modalStep: ModalStep;
	form: ProjectForm;
	setModalStep: (step: ModalStep) => void;
	setFormField: <K extends keyof ProjectForm>(
		key: K,
		value: ProjectForm[K],
	) => void;
	resetForm: () => void;
}

export const useProjectStore = create<ProjectState>()(
	devtools((set) => ({
		modalStep: "closed",
		form: {
			projectName: "",
			description: "",
			access: "administrator",
			team: "",
			dueDate: "",
		},
		setModalStep: (step) => set({ modalStep: step }),
		setFormField: (key, value) =>
			set((state) => ({
				form: { ...state.form, [key]: value },
			})),
		resetForm: () =>
			set({
				modalStep: "closed",
				form: {
					projectName: "",
					description: "",
					access: "administrator",
					team: "",
					dueDate: "",
				},
			}),
	})),
);
