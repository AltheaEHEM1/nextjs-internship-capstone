"use client";

import { useParams } from "next/navigation";
import { InvitationCard } from "@/components/invitation/InvitationCard";
import { InvitationErrorState } from "@/components/invitation/InvitationErrorState";
import { InvitationLoadingState } from "@/components/invitation/InvitationLoadingState";
import { useInvitation } from "@/hooks/invitation/useInvitation";

export default function InvitationPage() {
	const params = useParams();
	const token = params.token as string;

	const {
		invitationData,
		loading,
		actionLoading,
		errorMessage,
		isSignedIn,
		handleResponse,
	} = useInvitation(token);

	if (loading) {
		return <InvitationLoadingState />;
	}

	if (errorMessage || !invitationData) {
		return (
			<InvitationErrorState
				message={errorMessage || "Unable to find or verify this invitation."}
			/>
		);
	}

	return (
		<InvitationCard
			invitation={invitationData}
			actionLoading={actionLoading}
			isSignedIn={isSignedIn}
			onResponse={handleResponse}
		/>
	);
}
