"use server";

import { and, eq, isNull, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthenticatedDbUser } from "@/lib/auth/get-user";
import { db } from "@/lib/db";
import { teamMembers, teams, users } from "@/lib/db/schema";

export async function getUserTeamsAction(
	permissionFilter?: "administrator" | "member" | "viewer",
) {
	try {
		const dbUser = await getAuthenticatedDbUser();

		let conditions = and(
			eq(teamMembers.userId, dbUser.id),
			isNull(teams.deletedAt),
		);

		if (permissionFilter) {
			conditions = and(
				conditions,
				eq(teamMembers.permission, permissionFilter),
			);
		}

		const userTeams = await db
			.select({
				id: teams.id,
				name: teams.name,
				icon: teams.icon,
				coverUrl: teams.coverUrl,
				permission: teamMembers.permission,
			})
			.from(teamMembers)
			.innerJoin(teams, eq(teamMembers.teamId, teams.id))
			.where(conditions);

		const teamsWithCount = await Promise.all(
			userTeams.map(async (team) => {
				const [{ count }] = await db
					.select({ count: sql<number>`count(*)::int` })
					.from(teamMembers)
					.where(eq(teamMembers.teamId, team.id));

				return { ...team, membersCount: count };
			}),
		);

		return { success: true, data: teamsWithCount };
	} catch (err: unknown) {
		console.error("getUserTeamsAction Error:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to fetch user teams.",
		};
	}
}

export async function getTeamDetailAction(teamId: string) {
	try {
		const dbUser = await getAuthenticatedDbUser();

		const targetTeam = await db.query.teams.findFirst({
			where: and(eq(teams.id, teamId), isNull(teams.deletedAt)),
		});

		if (!targetTeam) return { success: false, error: "Team not found" };

		const members = await db
			.select({
				id: teamMembers.id,
				userId: teamMembers.userId,
				role: teamMembers.role,
				permission: teamMembers.permission,
				name: users.name,
				email: users.email,
				avatar: users.avatar,
			})
			.from(teamMembers)
			.innerJoin(users, eq(teamMembers.userId, users.id))
			.where(eq(teamMembers.teamId, teamId));

		const currentUserMember = members.find((m) => m.userId === dbUser.id);
		const currentUserPermission = currentUserMember?.permission ?? "viewer";

		return {
			success: true,
			data: { ...targetTeam, members, currentUserPermission },
		};
	} catch (err: unknown) {
		console.error("getTeamDetailAction Error:", err);
		return {
			success: false,
			error:
				err instanceof Error ? err.message : "Failed to fetch team details.",
		};
	}
}

export async function deleteTeamAction(teamId: string) {
	try {
		const dbUser = await getAuthenticatedDbUser();

		const memberRecord = await db.query.teamMembers.findFirst({
			where: and(
				eq(teamMembers.teamId, teamId),
				eq(teamMembers.userId, dbUser.id),
			),
		});

		if (memberRecord?.permission !== "administrator") {
			return {
				success: false,
				error: "Only team administrators can delete this team.",
			};
		}

		await db
			.update(teams)
			.set({ deletedAt: new Date() })
			.where(eq(teams.id, teamId));
		revalidatePath("/team");

		return { success: true };
	} catch (err: unknown) {
		console.error("deleteTeamAction Error:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to delete team.",
		};
	}
}

export async function updateTeamAction(
	teamId: string,
	data: { name: string; icon: string; coverUrl?: string },
) {
	try {
		const dbUser = await getAuthenticatedDbUser();

		// Check permission
		const memberRecord = await db.query.teamMembers.findFirst({
			where: and(
				eq(teamMembers.teamId, teamId),
				eq(teamMembers.userId, dbUser.id),
			),
		});

		if (memberRecord?.permission !== "administrator") {
			return {
				success: false,
				error: "Only team administrators can edit this team.",
			};
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

		return { success: true };
	} catch (err: unknown) {
		console.error("updateTeamAction Error:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to update team.",
		};
	}
}
