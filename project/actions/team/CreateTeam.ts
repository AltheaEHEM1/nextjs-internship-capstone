"use server";

import { auth } from "@clerk/nextjs/server";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { syncUser } from "@/lib/auth/sync-user";
import { db } from "@/lib/db";
import { teamMembers, teams, users } from "@/lib/db/schema";

async function getAuthenticatedDbUser() {
	const { userId } = await auth();
	if (!userId) throw new Error("Unauthorized");

	let dbUser = await db.query.users.findFirst({
		where: eq(users.clerkId, userId),
	});

	if (!dbUser) {
		dbUser = (await syncUser()) ?? undefined;
	}

	if (!dbUser) throw new Error("User sync failed");
	return dbUser;
}

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
			}

			revalidatePath("/team");
			return { success: true as const, teamId: newTeam.id };
		});
	} catch (err: any) {
		console.error("createTeamWithMembersAction Error:", err);
		return {
			success: false as const,
			error: err?.message || "Failed to create team.",
		};
	}
}