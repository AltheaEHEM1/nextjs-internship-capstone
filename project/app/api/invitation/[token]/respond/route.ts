import { auth } from "@clerk/nextjs/server";
import { and, eq, gt } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth/GetUser";
import { db } from "@/lib/db/index";
import { invitations, teamMembers } from "@/lib/db/schema/index";

export async function POST(
	req: Request,
	{ params }: { params: Promise<{ token: string }> },
) {
	try {
		const { token } = await params;
		const { action } = await req.json();

		const invite = await db.query.invitations.findFirst({
			where: and(
				eq(invitations.token, token),
				gt(invitations.expiresAt, new Date()),
			),
		});

		if (!invite) {
			return NextResponse.json(
				{
					success: false,
					error: "Invitation token is invalid or expired.",
				},
				{ status: 400 },
			);
		}

		if (invite.status === "accepted") {
			return NextResponse.json(
				{
					success: false,
					error: "This invitation has already been accepted.",
				},
				{ status: 409 },
			);
		}

		// Handle decline (no auth needed)
		if (action === "decline") {
			await db
				.update(invitations)
				.set({ status: "declined" })
				.where(eq(invitations.id, invite.id));

			revalidatePath("/team");
			return NextResponse.json({ success: true, status: "declined" });
		}

		// Accept requires auth
		const { userId } = await auth();
		if (!userId) {
			return NextResponse.json(
				{
					success: false,
					requiresAuth: true,
					error: "Please sign in to accept this invitation.",
				},
				{ status: 401 },
			);
		}

		const dbUser = await getAuthenticatedDbUser();

		if (invite.teamId) {
			const existingMember = await db.query.teamMembers.findFirst({
				where: and(
					eq(teamMembers.teamId, invite.teamId),
					eq(teamMembers.userId, dbUser.id),
				),
			});

			if (!existingMember) {
				await db.insert(teamMembers).values({
					teamId: invite.teamId,
					userId: dbUser.id,
					role: "Member",
					permission: "member",
				});
			}
		}

		await db
			.update(invitations)
			.set({ status: "accepted" })
			.where(eq(invitations.id, invite.id));

		revalidatePath("/team");
		return NextResponse.json({ success: true, status: "accepted" });
	} catch (err: unknown) {
		const errorMsg =
			err instanceof Error ? err.message : "Failed to respond to invitation.";
		console.error("POST /api/invitation/[token]/respond Error:", errorMsg);
		return NextResponse.json(
			{ success: false, error: errorMsg },
			{ status: 500 },
		);
	}
}
