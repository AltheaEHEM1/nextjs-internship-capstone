import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth/GetUser";
import { db } from "@/lib/db/index";
import { teamMembers, teams } from "@/lib/db/schema/index";
import { notifyTeamMembers } from "@/lib/notifications/NotifyTeam";
import { getTeamDetailQuery } from "@/lib/queries/team";

export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ teamId: string }> },
) {
	try {
		const { teamId } = await params;
		const result = await getTeamDetailQuery(teamId);
		if (!result.success) {
			return NextResponse.json(result, { status: 404 });
		}
		return NextResponse.json(result);
	} catch (err: unknown) {
		console.error("GET /api/team/[teamId] Error:", err);
		return NextResponse.json(
			{
				success: false,
				error: err instanceof Error ? err.message : "Failed to fetch team.",
			},
			{ status: 500 },
		);
	}
}

export async function DELETE(
	_req: Request,
	{ params }: { params: Promise<{ teamId: string }> },
) {
	try {
		const { teamId } = await params;
		const dbUser = await getAuthenticatedDbUser();

		const memberRecord = await db.query.teamMembers.findFirst({
			where: and(
				eq(teamMembers.teamId, teamId),
				eq(teamMembers.userId, dbUser.id),
			),
		});

		if (memberRecord?.permission !== "administrator") {
			return NextResponse.json(
				{
					success: false,
					error: "Only team administrators can delete this team.",
				},
				{ status: 403 },
			);
		}

		await db
			.update(teams)
			.set({ deletedAt: new Date() })
			.where(eq(teams.id, teamId));

		revalidatePath("/team");
		return NextResponse.json({ success: true });
	} catch (err: unknown) {
		console.error("DELETE /api/team/[teamId] Error:", err);
		return NextResponse.json(
			{
				success: false,
				error: err instanceof Error ? err.message : "Failed to delete team.",
			},
			{ status: 500 },
		);
	}
}

export async function PATCH(
	req: Request,
	{ params }: { params: Promise<{ teamId: string }> },
) {
	try {
		const { teamId } = await params;
		const data = await req.json();
		const dbUser = await getAuthenticatedDbUser();

		const memberRecord = await db.query.teamMembers.findFirst({
			where: and(
				eq(teamMembers.teamId, teamId),
				eq(teamMembers.userId, dbUser.id),
			),
		});

		if (memberRecord?.permission !== "administrator") {
			return NextResponse.json(
				{
					success: false,
					error: "Only team administrators can edit this team.",
				},
				{ status: 403 },
			);
		}

		await db
			.update(teams)
			.set({
				name: data.name,
				icon: data.icon,
				coverUrl: data.coverUrl || null,
			})
			.where(eq(teams.id, teamId));

		revalidatePath(`/team/team/${teamId}`);
		revalidatePath("/team");

		await notifyTeamMembers(
			teamId,
			"team-updated",
			{
				teamId,
				teamName: data.name,
				editorName: dbUser.name || "Someone",
			},
			dbUser.clerkId,
		);

		return NextResponse.json({ success: true });
	} catch (err: unknown) {
		console.error("PATCH /api/team/[teamId] Error:", err);
		return NextResponse.json(
			{
				success: false,
				error: err instanceof Error ? err.message : "Failed to update team.",
			},
			{ status: 500 },
		);
	}
}
