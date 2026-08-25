import { eq } from "drizzle-orm";
import { db } from "@/lib/db/index";
import { invitations } from "@/lib/db/schema/index";

/**
 * Server-side read-only query helpers for invitations.
 * Used directly by Server Components (no HTTP round-trip needed).
 */

export async function getInvitationByTokenQuery(token: string) {
	try {
		const invitation = await db.query.invitations.findFirst({
			where: eq(invitations.token, token),
			with: {
				invitedBy: true,
			},
		});

		if (!invitation) return { success: false, reason: "Invitation not found." };

		if (invitation.status === "accepted")
			return { success: false, reason: "Invitation has already been used." };

		if (new Date() > new Date(invitation.expiresAt)) {
			if (invitation.status !== "expired") {
				await db
					.update(invitations)
					.set({ status: "expired" })
					.where(eq(invitations.id, invitation.id));
			}
			return { success: false, reason: "Invitation link has expired." };
		}

		return { success: true, invitation };
	} catch (err: unknown) {
		console.error("getInvitationByTokenQuery Error:", err);
		return { success: false, reason: "Failed to verify invitation." };
	}
}
