"use server";

import { inArray } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthenticatedDbUser } from "@/lib/auth/get-user";
import { db } from "@/lib/db";
import { teamMembers, teams, users } from "@/lib/db/schema";
import { notifyUser } from "@/lib/notifications/notify-team";

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
		const dbUser = await getAuthenticatedDbUser();
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
