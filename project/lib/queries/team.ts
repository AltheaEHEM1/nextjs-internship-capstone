import { and, eq, isNull, sql } from "drizzle-orm";
import { getAuthenticatedDbUser } from "@/lib/auth/GetUser";
import { db } from "@/lib/db/index";
import {
	invitations,
	projects,
	teamMembers,
	teams,
	users,
} from "@/lib/db/schema/index";

/**
 * Server-side read-only query helpers for teams and people.
 * Used directly by Server Components (no HTTP round-trip needed).
 */

export async function getUserTeamsQuery(
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
		console.error("getUserTeamsQuery Error:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to fetch user teams.",
		};
	}
}

export async function getTeamDetailQuery(teamId: string) {
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
		console.error("getTeamDetailQuery Error:", err);
		return {
			success: false,
			error:
				err instanceof Error ? err.message : "Failed to fetch team details.",
		};
	}
}

export async function checkTeamNameUniqueQuery(name: string) {
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
		console.error("checkTeamNameUniqueQuery Error:", err);
		return {
			success: false,
			error:
				err instanceof Error
					? err.message
					: "Failed to check team name uniqueness.",
		};
	}
}

export async function getAcceptedInvitesQuery() {
	try {
		const dbUser = await getAuthenticatedDbUser();

		const acceptedList = await db
			.select({
				id: users.id,
				name: users.name,
				email: users.email,
				avatar: users.avatar,
			})
			.from(invitations)
			.innerJoin(
				users,
				sql`LOWER(${users.email}) = LOWER(${invitations.email})`,
			)
			.where(
				and(
					eq(invitations.invitedById, dbUser.id),
					eq(invitations.status, "accepted"),
				),
			);

		return { success: true, data: acceptedList };
	} catch (err: unknown) {
		console.error("getAcceptedInvitesQuery Error:", err);
		return {
			success: false,
			error:
				err instanceof Error
					? err.message
					: "Failed to fetch accepted invites.",
		};
	}
}

export async function getPersonDetailQuery(personId: string) {
	try {
		await getAuthenticatedDbUser();

		let person = await db.query.users.findFirst({
			where: eq(users.id, personId),
		});

		if (!person) {
			person = await db.query.users.findFirst({
				where: eq(users.clerkId, personId),
			});
		}

		if (!person) {
			return { success: false, error: "Person not found" };
		}

		const userTeams = await db
			.select({
				id: teams.id,
				name: teams.name,
				icon: teams.icon,
				coverUrl: teams.coverUrl,
				role: teamMembers.role,
			})
			.from(teamMembers)
			.innerJoin(teams, eq(teamMembers.teamId, teams.id))
			.where(eq(teamMembers.userId, person.id));

		const userTeamIds = userTeams.map((t) => t.id);

		const ownedProjects = await db
			.select({ id: projects.id, name: projects.name })
			.from(projects)
			.where(and(eq(projects.ownerId, person.id), isNull(projects.deletedAt)));

		const teamProjects =
			userTeamIds.length > 0
				? await db
						.select({ id: projects.id, name: projects.name })
						.from(projects)
						.where(
							and(
								sql`${projects.teamId} = ANY(${userTeamIds})`,
								isNull(projects.deletedAt),
							),
						)
				: [];

		const projectMap = new Map<
			string,
			{ id: string; name: string; role: string; status: string }
		>();

		for (const p of ownedProjects) {
			projectMap.set(p.id, {
				id: p.id,
				name: p.name,
				role: "Owner",
				status: "Active",
			});
		}

		for (const p of teamProjects) {
			if (!projectMap.has(p.id)) {
				projectMap.set(p.id, {
					id: p.id,
					name: p.name,
					role: "Team Member",
					status: "Active",
				});
			}
		}

		const personProjects = Array.from(projectMap.values());

		const teamMemberRole = await db.query.teamMembers.findFirst({
			where: eq(teamMembers.userId, person.id),
		});

		const avatarChar = person.name ? person.name.charAt(0).toUpperCase() : "U";

		return {
			success: true,
			data: {
				id: person.id,
				name: person.name,
				email: person.email,
				avatar: person.avatar || avatarChar,
				role: teamMemberRole?.role || "Member",
				teams: userTeams.map((t) => ({
					id: t.id,
					name: t.name,
					icon: t.icon || "💻",
					coverUrl: t.coverUrl,
					role: t.role || "Member",
				})),
				projects: personProjects,
			},
		};
	} catch (err: unknown) {
		console.error("getPersonDetailQuery Error:", err);
		return {
			success: false,
			error:
				err instanceof Error ? err.message : "Failed to fetch person detail.",
		};
	}
}
