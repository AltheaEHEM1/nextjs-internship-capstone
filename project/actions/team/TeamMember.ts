"use server";

import { and, eq, sql } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthenticatedDbUser } from "@/lib/auth/get-user";
import { db } from "@/lib/db";
import {
	invitations,
	projectMembers,
	projects,
	teamMembers,
	teams,
	users,
} from "@/lib/db/schema";
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
	} catch (err: any) {
		console.error("getAcceptedInvitesAction Error:", err);
		return {
			success: false,
			error: err?.message || "Failed to fetch accepted invites.",
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

		// Fetch projects the person is part of or owns
		const userProjectsFromMembers = await db
			.select({
				id: projects.id,
				name: projects.name,
				role: projectMembers.role,
			})
			.from(projectMembers)
			.innerJoin(projects, eq(projectMembers.projectId, projects.id))
			.where(eq(projectMembers.userId, person.id));

		const ownedProjects = await db
			.select({
				id: projects.id,
				name: projects.name,
			})
			.from(projects)
			.where(eq(projects.ownerId, person.id));

		const projectMap = new Map<
			string,
			{ id: string; name: string; role: string; status: string }
		>();

		for (const p of userProjectsFromMembers) {
			projectMap.set(p.id, {
				id: p.id,
				name: p.name,
				role: p.role || "Member",
				status: "Active",
			});
		}

		for (const p of ownedProjects) {
			if (!projectMap.has(p.id)) {
				projectMap.set(p.id, {
					id: p.id,
					name: p.name,
					role: "Owner",
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
	} catch (err: any) {
		console.error("getPersonDetailAction Error:", err);
		return {
			success: false,
			error: err?.message || "Failed to fetch person detail.",
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
	} catch (err: any) {
		console.error("removePersonAction Error:", err);
		return {
			success: false,
			error: err?.message || "Failed to remove person.",
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
		await getAuthenticatedDbUser();

		let targetUserId = data.userId;

		if (!targetUserId && data.email) {
			const user = await db.query.users.findFirst({
				where: sql`LOWER(${users.email}) = LOWER(${data.email})`,
			});
			if (user) {
				targetUserId = user.id;
			}
		}

		if (!targetUserId) {
			if (data.email) {
				const inviteRes = await sendUserInvitationAction(
					data.email,
					undefined,
				);
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

		return { success: true };
	} catch (err: any) {
		console.error("addMemberToTeamAction Error:", err);
		return {
			success: false,
			error: err?.message || "Failed to add member to team.",
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

		if (
			!currentUserMember ||
			currentUserMember?.permission !== "administrator"
		) {
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

		const updateData: any = {};
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
		}

		return { success: true };
	} catch (err: any) {
		console.error("updateTeamMemberAction Error:", err);
		return {
			success: false,
			error: err?.message || "Failed to update team member.",
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

		if (
			!currentUserMember ||
			currentUserMember?.permission !== "administrator"
		) {
			return {
				success: false,
				error: "Only team administrators can remove members.",
			};
		}

		await db
			.delete(teamMembers)
			.where(
				and(eq(teamMembers.teamId, teamId), eq(teamMembers.userId, userId)),
			);

		revalidatePath(`/team/team/${teamId}`);
		revalidatePath("/team");

		return { success: true };
	} catch (err: any) {
		console.error("removeTeamMemberAction Error:", err);
		return {
			success: false,
			error: err?.message || "Failed to remove team member.",
		};
	}
}
