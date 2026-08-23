/**
 * API request/response types for Invitation routes.
 */

// POST /api/invitation/send
export interface SendInvitationRequest {
	email: string;
	notes?: string;
}

// POST /api/invitation/[token]/respond
export interface RespondToInvitationRequest {
	action: "accept" | "decline";
}
