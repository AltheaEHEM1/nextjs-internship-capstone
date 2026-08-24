import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth/GetUser";
import { db } from "@/lib/db/index";
import { teamMembers, teams, users } from "@/lib/db/schema/index";
import { notifyTeamMembers, notifyUser } from "@/lib/notifications/NotifyTeam";
import { teamMemberSchema } from "@/lib/validation/Validations";
import type { UpdateTeamMemberRequest } from "@/types/api/team";

// PATCH /api/team/[teamId]/members/[userId] — update a member's role/permission
export async function PATCH(
	req: Request,
	{ params }: { params: Promise<{ teamId: string; userId: string }> },
) {
	try {
		const { teamId, userId } = await params;
		const data: UpdateTeamMemberRequest = await req.json();

		const validationResult = teamMemberSchema.safeParse({
			teamId,
			userId,
			...data,
		});
		if (!validationResult.success) {
			return NextResponse.json(
				{
					success: false,
					error:
						validationResult.error.issues[0]?.message ||
						"Invalid update team member data",
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
					error: "Only team administrators can update members.",
				},
				{ status: 403 },
			);
		}

		const targetMember = await db.query.teamMembers.findFirst({
			where: and(
				eq(teamMembers.teamId, teamId),
				eq(teamMembers.userId, userId),
			),
		});

		if (!targetMember) {
			return NextResponse.json(
				{ success: false, error: "Team member not found." },
				{ status: 404 },
			);
		}

		const updateData: Record<string, unknown> = {};
		if (data.role !== undefined) updateData.role = data.role;
		if (data.permission !== undefined) updateData.permission = data.permission;

		if (Object.keys(updateData).length > 0) {
			await db
				.update(teamMembers)
				.set(updateData)
				.where(
					and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)),
				);

			revalidatePath(`/team/team/${teamId}`);
			revalidatePath("/team");

			// Fetch team name and target user name for a rich notification
			const [teamRecord, targetUser] = await Promise.all([
				db.query.teams.findFirst({ where: eq(teams.id, teamId) }),
				db.query.users.findFirst({ where: eq(users.id, userId) }),
			]);

			await notifyTeamMembers(
				teamId,
				"team-member-updated",
				{
					teamId,
					teamName: teamRecord?.name,
					targetName: targetUser?.name || targetUser?.email,
				},
				dbUser.clerkId,
			);
		}

		return NextResponse.json({ success: true });
	} catch (err: unknown) {
		console.error("PATCH /api/team/[teamId]/members/[userId] Error:", err);
		return NextResponse.json(
			{
				success: false,
				error:
					err instanceof Error ? err.message : "Failed to update team member.",
			},
			{ status: 500 },
		);
	}
}

// DELETE /api/team/[teamId]/members/[userId] — remove a member
export async function DELETE(
	_req: Request,
	{ params }: { params: Promise<{ teamId: string; userId: string }> },
) {
	try {
		const { teamId, userId } = await params;
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
					error: "Only team administrators can remove members.",
				},
				{ status: 403 },
			);
		}

		const targetUser = await db.query.users.findFirst({
			where: eq(users.id, userId),
		});

		const team = await db.query.teams.findFirst({
			where: eq(teams.id, teamId),
		});

		await db
			.delete(teamMembers)
			.where(
				and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)),
			);

		revalidatePath(`/team/team/${teamId}`);
		revalidatePath("/team");

		if (targetUser?.clerkId) {
			await notifyUser(targetUser.clerkId, "you-were-removed", {
				teamName: team?.name,
			});
		}

		await notifyTeamMembers(
			teamId,
			"team-member-removed",
			{
				teamId,
				teamName: team?.name,
				targetName: targetUser?.name || targetUser?.email,
			},
			dbUser.clerkId,
		);

		return NextResponse.json({ success: true });
	} catch (err: unknown) {
		console.error("DELETE /api/team/[teamId]/members/[userId] Error:", err);
		return NextResponse.json(
			{
				success: false,
				error:
					err instanceof Error ? err.message : "Failed to remove team member.",
			},
			{ status: 500 },
		);
	}
}
