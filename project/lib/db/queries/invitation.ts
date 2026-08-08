import { eq } from "drizzle-orm";
import { db } from "@/lib/db";
import { invitations } from "@/lib/db/schema";

export async function getInvitationByToken(token: string) {
	const invitation = await db.query.invitations.findFirst({
		where: (inv, { eq }) => eq(inv.token, token),
	});

	if (!invitation) {
		return { valid: false, reason: "Invitation not found." };
	}

	if (invitation.status === "accepted") {
		return { valid: false, reason: "Invitation has already been used." };
	}

	if (new Date() > new Date(invitation.expiresAt)) {
		if (invitation.status !== "expired") {
			await db
				.update(invitations)
				.set({ status: "expired" })
				.where(eq(invitations.id, invitation.id));
		}
		return { valid: false, reason: "Invitation link has expired." };
	}

	return { valid: true, invitation };
}
