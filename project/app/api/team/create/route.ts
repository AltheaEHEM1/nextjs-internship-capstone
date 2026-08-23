import { and, eq, inArray, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth/GetUser";
import { db } from "@/lib/db/index";
import { teamMembers, teams, users } from "@/lib/db/schema/index";
import { notifyUser } from "@/lib/notifications/NotifyTeam";
import { createTeamSchema } from "@/lib/validation/Validations";
import type { CreateTeamRequest } from "@/types/api/team";

export async function POST(req: Request) {
	try {
		const data: CreateTeamRequest = await req.json();

		const validationResult = createTeamSchema.safeParse(data);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					success: false,
					error:
						validationResult.error.issues[0]?.message || "Invalid team data",
				},
				{ status: 400 },
			);
		}

		const dbUser = await getAuthenticatedDbUser();

		// Check if user already has a team with this name
		const existingTeam = await db
			.select()
			.from(teams)
			.innerJoin(teamMembers, eq(teams.id, teamMembers.teamId))
			.where(
				and(
					eq(teams.name, data.name.trim()),
					eq(teamMembers.userId, dbUser.id),
					isNull(teams.deletedAt),
				),
			)
			.limit(1);

		if (existingTeam.length > 0) {
			return NextResponse.json(
				{ success: false, error: "You already have a team with this name." },
				{ status: 409 },
			);
		}

		const result = await db.transaction(async (tx) => {
			const [newTeam] = await tx
				.insert(teams)
				.values({
					name: data.name,
					icon: data.icon || "🚀",
					coverUrl: data.coverUrl || null,
				})
				.returning();

			await tx.insert(teamMembers).values({
				teamId: newTeam.id,
				userId: dbUser.id,
				role: "Owner",
				permission: "administrator",
			});

			const additionalMembers = (data.members || []).filter(
				(m) => m.userId !== dbUser.id,
			);

			if (additionalMembers.length > 0) {
				await tx.insert(teamMembers).values(
					additionalMembers.map((m) => ({
						teamId: newTeam.id,
						userId: m.userId,
						role: m.role || "Member",
						permission: m.permission || "member",
					})),
				);

				const userIds = additionalMembers.map((m) => m.userId);
				const addedUsers = await tx
					.select()
					.from(users)
					.where(inArray(users.id, userIds));

				for (const u of addedUsers) {
					if (u.clerkId) {
						await notifyUser(u.clerkId, "you-were-added", {
							teamName: newTeam.name,
						});
					}
				}
			}

			return newTeam;
		});

		revalidatePath("/team");
		return NextResponse.json({ success: true, teamId: result.id });
	} catch (err: unknown) {
		console.error("POST /api/team/create Error:", err);
		return NextResponse.json(
			{
				success: false,
				error: err instanceof Error ? err.message : "Failed to create team.",
			},
			{ status: 500 },
		);
	}
}
