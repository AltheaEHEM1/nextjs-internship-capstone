"use server";

import { and, eq, inArray, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthenticatedDbUser } from "@/lib/auth/GetUser";
import { db } from "@/lib/db/index";
import { teamMembers, teams, users } from "@/lib/db/schema/index";
import { notifyUser } from "@/lib/notifications/NotifyTeam";
import { createTeamSchema } from "@/lib/validation/Validations";

export async function createTeamWithMembersAction(data: {
	name: string;
	icon?: string;
	coverUrl?: string;
	members: Array<{
		userId: string;
		role: string;
		permission: "administrator" | "member" | "viewer";
	}>;
}) {
	try {
		const validationResult = createTeamSchema.safeParse(data);
		if (!validationResult.success) {
			return {
				success: false,
				error: validationResult.error.issues[0]?.message || "Invalid team data",
			};
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
			return {
				success: false,
				error: "You already have a team with this name.",
			};
		}

		return await db.transaction(async (tx) => {
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

			revalidatePath("/team");
			return { success: true as const, teamId: newTeam.id };
		});
	} catch (err: unknown) {
		console.error("createTeamWithMembersAction Error:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to create team.",
		};
	}
}

export async function checkTeamNameUniqueAction(name: string) {
	try {
		const dbUser = await getAuthenticatedDbUser();
		if (!name || name.trim() === "") {
			return { success: true, isUnique: true };
		}

		const existingTeam = await db
			.select()
			.from(teams)
			.innerJoin(teamMembers, eq(teams.id, teamMembers.teamId))
			.where(
				and(
					eq(teams.name, name.trim()),
					eq(teamMembers.userId, dbUser.id),
					isNull(teams.deletedAt),
				),
			)
			.limit(1);

		return { success: true, isUnique: existingTeam.length === 0 };
	} catch (err: unknown) {
		console.error("checkTeamNameUniqueAction Error:", err);
		return {
			success: false,
			error:
				err instanceof Error
					? err.message
					: "Failed to check team name uniqueness.",
		};
	}
}
