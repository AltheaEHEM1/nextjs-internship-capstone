import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth/GetUser";
import { db } from "@/lib/db/index";
import { teamMembers, teams, users } from "@/lib/db/schema/index";
import { notifyTeamMembers, notifyUser } from "@/lib/notifications/NotifyTeam";
import { teamMemberSchema } from "@/lib/validation/Validations";

// POST /api/team/[teamId]/members — add a member
export async function POST(
	req: Request,
	{ params }: { params: Promise<{ teamId: string }> },
) {
	try {
		const { teamId } = await params;
		const data = await req.json();

		const validationResult = teamMemberSchema.safeParse({ teamId, ...data });
		if (!validationResult.success) {
			return NextResponse.json(
				{
					success: false,
					error:
						validationResult.error.issues[0]?.message ||
						"Invalid team member data",
				},
				{ status: 400 },
			);
		}

		const dbUser = await getAuthenticatedDbUser();

		const currentUserMember = await db.query.teamMembers.findFirst({
			where: and(
				eq(teamMembers.teamId, teamId),
				eq(teamMembers.userId, dbUser.id),
			),
		});

		if (currentUserMember?.permission !== "administrator") {
			return NextResponse.json(
				{
					success: false,
					error: "Only team administrators can add new members.",
				},
				{ status: 403 },
			);
		}

		let targetUserId = data.userId;

		if (!targetUserId && data.email) {
			const user = await db.query.users.findFirst({
				where: sql`LOWER(${users.email}) = LOWER(${data.email})`,
			});
			if (user) {
				targetUserId = user.id;
			}
		}

		const team = await db.query.teams.findFirst({
			where: eq(teams.id, teamId),
		});

		if (!targetUserId) {
			if (data.email) {
				// User not yet registered — send an invitation
				const { sendUserInvitationHandler } = await import(
					"@/app/api/invitation/send/route"
				);
				const inviteRes = await sendUserInvitationHandler(
					data.email,
					undefined,
					dbUser,
				);
				if (inviteRes.success) {
					await notifyTeamMembers(teamId, "team-member-invited", {
						teamId,
						teamName: team?.name,
						email: data.email,
					});
				}
				return NextResponse.json({
					success: inviteRes.success,
					error: inviteRes.error,
				});
			}
			return NextResponse.json(
				{ success: false, error: "User not found." },
				{ status: 404 },
			);
		}

		const existingMember = await db.query.teamMembers.findFirst({
			where: and(
				eq(teamMembers.teamId, teamId),
				eq(teamMembers.userId, targetUserId),
			),
		});

		if (existingMember) {
			return NextResponse.json(
				{ success: false, error: "This person is already in the team." },
				{ status: 409 },
			);
		}

		await db.insert(teamMembers).values({
			teamId,
			userId: targetUserId,
			role: data.role || "Member",
			permission: data.permission || "member",
		});

		revalidatePath(`/team/team/${teamId}`);
		revalidatePath("/team");

		const addedUser = await db.query.users.findFirst({
			where: eq(users.id, targetUserId),
		});

		const notificationPayload = {
			teamId,
			teamName: team?.name,
			targetName: addedUser?.name || addedUser?.email,
		};

		if (addedUser?.clerkId) {
			await notifyUser(addedUser.clerkId, "you-were-added", {
				teamName: team?.name,
			});
			await notifyTeamMembers(
				teamId,
				"team-member-added",
				notificationPayload,
				addedUser.clerkId,
			);
		} else {
			await notifyTeamMembers(teamId, "team-member-added", notificationPayload);
		}

		return NextResponse.json({ success: true });
	} catch (err: unknown) {
		console.error("POST /api/team/[teamId]/members Error:", err);
		return NextResponse.json(
			{
				success: false,
				error:
					err instanceof Error ? err.message : "Failed to add member to team.",
			},
			{ status: 500 },
		);
	}
}
