"use client";

import { useUser } from "@clerk/nextjs";
import { useRouter } from "next/navigation";
import { useCallback, useEffect } from "react";
import {
	getInvitationByTokenAction,
	respondToInvitation,
} from "@/actions/team/Invitation";
import { useToast } from "@/hooks/toast/use-toast";
import {
	type InvitationData,
	useInvitationStore,
} from "@/stores/invitation/useInvitationStore";

export function useInvitation(token: string) {
	const router = useRouter();
	const { toast } = useToast();
	const { isSignedIn, isLoaded: isUserLoaded } = useUser();

	const invitationData = useInvitationStore((s) => s.invitationData);
	const loading = useInvitationStore((s) => s.loading);
	const actionLoading = useInvitationStore((s) => s.actionLoading);
	const errorMessage = useInvitationStore((s) => s.errorMessage);

	const setInvitationData = useInvitationStore((s) => s.setInvitationData);
	const setLoading = useInvitationStore((s) => s.setLoading);
	const setActionLoading = useInvitationStore((s) => s.setActionLoading);
	const setErrorMessage = useInvitationStore((s) => s.setErrorMessage);
	const reset = useInvitationStore((s) => s.reset);

	const loadInvitation = useCallback(async () => {
		if (!token) return;
		setLoading(true);
		setErrorMessage(null);

		try {
			const res = await getInvitationByTokenAction(token);
			if (res.success && res.invitation) {
				setInvitationData(res.invitation as unknown as InvitationData);
			} else {
				setErrorMessage(res.reason || "Invalid or expired invitation link.");
			}
		} catch (err: unknown) {
			const errorMsg =
				err instanceof Error ? err.message : "Failed to load invitation.";
			setErrorMessage(errorMsg);
		} finally {
			setLoading(false);
		}
	}, [token, setInvitationData, setLoading, setErrorMessage]);

	useEffect(() => {
		loadInvitation();
		return () => {
			reset();
		};
	}, [loadInvitation, reset]);

	const handleResponse = async (action: "accept" | "decline") => {
		if (!token || actionLoading !== null) return;

		// If accepting and user is not logged in, redirect to sign in
		if (action === "accept" && isUserLoaded && !isSignedIn) {
			toast({
				title: "Sign in required",
				description:
					"Please sign in or create an account to accept the invitation.",
				variant: "destructive",
			});
			router.push(
				`/sign-in?redirect_url=${encodeURIComponent(`/invitation/${token}`)}`,
			);
			return;
		}

		setActionLoading(action);

		try {
			const res = await respondToInvitation(token, action);
			if (res.success) {
				toast({
					title:
						action === "accept" ? "Invitation accepted" : "Invitation declined",
					description:
						action === "accept"
							? "You have successfully joined the team! Redirecting..."
							: "You have declined the team invitation.",
					variant: action === "accept" ? "success" : "destructive",
				});
				router.push("/team");
			} else if (res.requiresAuth) {
				toast({
					title: "Sign in required",
					description: res.error || "Please sign in to accept this invitation.",
					variant: "destructive",
				});
				router.push(
					`/sign-in?redirect_url=${encodeURIComponent(`/invitation/${token}`)}`,
				);
				setActionLoading(null);
			} else {
				toast({
					title: "Action failed",
					description: res.error || `Failed to ${action} invitation.`,
					variant: "destructive",
				});
				setActionLoading(null);
			}
		} catch (err: unknown) {
			const errorMsg =
				err instanceof Error ? err.message : `Failed to ${action} invitation.`;
			toast({
				title: "Error",
				description: errorMsg,
				variant: "destructive",
			});
			setActionLoading(null);
		}
	};

	return {
		invitationData,
		loading,
		actionLoading,
		errorMessage,
		isSignedIn: isUserLoaded ? isSignedIn : false,
		handleResponse,
		reload: loadInvitation,
	};
}
