import { create } from "zustand";

export interface InvitationInviter {
	id?: string;
	name?: string | null;
	email?: string;
	avatar?: string | null;
}

export interface InvitationTeam {
	id?: string;
	name?: string;
	icon?: string | null;
	coverUrl?: string | null;
}

export interface InvitationData {
	id: string;
	email: string;
	notes?: string | null;
	teamId?: string | null;
	invitedById: string;
	token: string;
	status: "pending" | "accepted" | "expired" | "declined";
	expiresAt: Date | string;
	createdAt: Date | string;
	invitedBy?: InvitationInviter | null;
	team?: InvitationTeam | null;
}

export type ActionLoading = "accept" | "decline" | null;

export interface InvitationState {
	invitationData: InvitationData | null;
	loading: boolean;
	actionLoading: ActionLoading;
	errorMessage: string | null;

	setInvitationData: (data: InvitationData | null) => void;
	setLoading: (loading: boolean) => void;
	setActionLoading: (action: ActionLoading) => void;
	setErrorMessage: (error: string | null) => void;
	reset: () => void;
}

const initialState = {
	invitationData: null,
	loading: true,
	actionLoading: null as ActionLoading,
	errorMessage: null,
};

export const useInvitationStore = create<InvitationState>((set) => ({
	...initialState,

	setInvitationData: (data) => set({ invitationData: data }),
	setLoading: (loading) => set({ loading }),
	setActionLoading: (actionLoading) => set({ actionLoading }),
	setErrorMessage: (errorMessage) => set({ errorMessage }),
	reset: () => set({ ...initialState }),
}));
