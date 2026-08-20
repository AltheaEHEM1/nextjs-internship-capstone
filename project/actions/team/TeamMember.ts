"use server";

import { and, eq, inArray, isNull, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthenticatedDbUser } from "@/lib/auth/get-user";
import { db } from "@/lib/db";
import {
	invitations,
	projects,
	teamMembers,
	teams,
	users,
} from "@/lib/db/schema";
import { notifyTeamMembers, notifyUser } from "@/lib/notifications/notify-team";
import { sendUserInvitationAction } from "./Invitation";

export async function getAcceptedInvitesAction() {
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
		console.error("getAcceptedInvitesAction Error:", err);
		return {
			success: false,
			error:
				err instanceof Error
					? err.message
					: "Failed to fetch accepted invites.",
		};
	}
}

export async function getPersonDetailAction(personId: string) {
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

		// Fetch teams the person is part of
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

		// Derive projects from team membership and ownership
		const userTeamIds = userTeams.map((t) => t.id);

		const ownedProjects = await db
			.select({
				id: projects.id,
				name: projects.name,
			})
			.from(projects)
			.where(and(eq(projects.ownerId, person.id), isNull(projects.deletedAt)));

		const teamProjects =
			userTeamIds.length > 0
				? await db
						.select({
							id: projects.id,
							name: projects.name,
						})
						.from(projects)
						.where(
							and(
								inArray(projects.teamId, userTeamIds),
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
		console.error("getPersonDetailAction Error:", err);
		return {
			success: false,
			error:
				err instanceof Error ? err.message : "Failed to fetch person detail.",
		};
	}
}

export async function removePersonAction(personId: string) {
	try {
		const dbUser = await getAuthenticatedDbUser();

		const personUser = await db.query.users.findFirst({
			where: eq(users.id, personId),
		});

		if (personUser) {
			await db
				.delete(invitations)
				.where(
					and(
						eq(invitations.invitedById, dbUser.id),
						sql`LOWER(${invitations.email}) = LOWER(${personUser.email})`,
					),
				);
		}

		await db.delete(teamMembers).where(eq(teamMembers.userId, personId));

		return { success: true };
	} catch (err: unknown) {
		console.error("removePersonAction Error:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to remove person.",
		};
	}
}

export async function addMemberToTeamAction(data: {
	teamId: string;
	userId?: string;
	email?: string;
	role?: string;
	permission?: "administrator" | "member" | "viewer";
}): Promise<{ success: boolean; error?: string }> {
	try {
		const dbUser = await getAuthenticatedDbUser();

		// Check if the current user is an administrator of the team
		const currentUserMember = await db.query.teamMembers.findFirst({
			where: and(
				eq(teamMembers.teamId, data.teamId),
				eq(teamMembers.userId, dbUser.id),
			),
		});

		if (currentUserMember?.permission !== "administrator") {
			return {
				success: false,
				error: "Only team administrators can add new members.",
			};
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
			where: eq(teams.id, data.teamId),
		});

		if (!targetUserId) {
			if (data.email) {
				const inviteRes = await sendUserInvitationAction(data.email, undefined);
				if (inviteRes.success) {
					await notifyTeamMembers(data.teamId, "team-member-invited", {
						teamId: data.teamId,
						teamName: team?.name,
						email: data.email,
					});
				}
				return {
					success: inviteRes.success,
					error: inviteRes.error,
				};
			}
			return { success: false, error: "User not found." };
		}

		const existingMember = await db.query.teamMembers.findFirst({
			where: and(
				eq(teamMembers.teamId, data.teamId),
				eq(teamMembers.userId, targetUserId),
			),
		});

		if (existingMember) {
			return { success: false, error: "This person is already in the team." };
		}

		await db.insert(teamMembers).values({
			teamId: data.teamId,
			userId: targetUserId,
			role: data.role || "Member",
			permission: data.permission || "member",
		});

		revalidatePath(`/team/team/${data.teamId}`);
		revalidatePath("/team");

		const addedUser = await db.query.users.findFirst({
			where: eq(users.id, targetUserId),
		});

		const notificationPayload = {
			teamId: data.teamId,
			teamName: team?.name,
			targetName: addedUser?.name || addedUser?.email,
		};

		if (addedUser?.clerkId) {
			await notifyUser(addedUser.clerkId, "you-were-added", {
				teamName: team?.name,
			});

			// Notify other team members, excluding the added user
			await notifyTeamMembers(
				data.teamId,
				"team-member-added",
				notificationPayload,
				addedUser.clerkId,
			);
		} else {
			await notifyTeamMembers(
				data.teamId,
				"team-member-added",
				notificationPayload,
			);
		}

		return { success: true };
	} catch (err: unknown) {
		console.error("addMemberToTeamAction Error:", err);
		return {
			success: false,
			error:
				err instanceof Error ? err.message : "Failed to add member to team.",
		};
	}
}

export async function updateTeamMemberAction(data: {
	teamId: string;
	userId: string;
	role?: string;
	permission?: "administrator" | "member" | "viewer";
}): Promise<{ success: boolean; error?: string }> {
	try {
		const dbUser = await getAuthenticatedDbUser();

		// Check if the current user is an administrator of the team
		const currentUserMember = await db.query.teamMembers.findFirst({
			where: and(
				eq(teamMembers.teamId, data.teamId),
				eq(teamMembers.userId, dbUser.id),
			),
		});

		if (currentUserMember?.permission !== "administrator") {
			return {
				success: false,
				error: "Only team administrators can update members.",
			};
		}

		// Check if the target member exists
		const targetMember = await db.query.teamMembers.findFirst({
			where: and(
				eq(teamMembers.teamId, data.teamId),
				eq(teamMembers.userId, data.userId),
			),
		});

		if (!targetMember) {
			return { success: false, error: "Team member not found." };
		}

		const updateData: Record<string, unknown> = {};
		if (data.role !== undefined) updateData.role = data.role;
		if (data.permission !== undefined) updateData.permission = data.permission;

		if (Object.keys(updateData).length > 0) {
			await db
				.update(teamMembers)
				.set(updateData)
				.where(
					and(
						eq(teamMembers.teamId, data.teamId),
						eq(teamMembers.userId, data.userId),
					),
				);

			revalidatePath(`/team/team/${data.teamId}`);
			revalidatePath("/team");

			await notifyTeamMembers(
				data.teamId,
				"team-member-updated",
				{ teamId: data.teamId },
				dbUser.clerkId,
			);
		}

		return { success: true };
	} catch (err: unknown) {
		console.error("updateTeamMemberAction Error:", err);
		return {
			success: false,
			error:
				err instanceof Error ? err.message : "Failed to update team member.",
		};
	}
}

export async function removeTeamMemberAction(
	teamId: string,
	userId: string,
): Promise<{ success: boolean; error?: string }> {
	try {
		const dbUser = await getAuthenticatedDbUser();

		// Check if the current user is an administrator of the team
		const currentUserMember = await db.query.teamMembers.findFirst({
			where: and(
				eq(teamMembers.teamId, teamId),
				eq(teamMembers.userId, dbUser.id),
			),
		});

		if (currentUserMember?.permission !== "administrator") {
			return {
				success: false,
				error: "Only team administrators can remove members.",
			};
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

		return { success: true };
	} catch (err: unknown) {
		console.error("removeTeamMemberAction Error:", err);
		return {
			success: false,
			error:
				err instanceof Error ? err.message : "Failed to remove team member.",
		};
	}
}
