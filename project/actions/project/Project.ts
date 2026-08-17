"use server";

import { eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthenticatedDbUser } from "@/lib/auth/get-user";
import { db } from "@/lib/db";
import { projects, projectMembers, teams, lists } from "@/lib/db/schema";

export async function createProjectAction(data: {
	name: string;
	description?: string;
	teamId: string;
	dueDate: string;
	views: string[];
	statuses: any;
}) {
	try {
		const dbUser = await getAuthenticatedDbUser();

		// Check if a project with the same name already exists
		const existingProject = await db.query.projects.findFirst({
			where: eq(projects.name, data.name),
		});

		if (existingProject) {
			return { success: false, error: "A project with this name already exists." };
		}

		const newProject = await db
			.insert(projects)
			.values({
				name: data.name,
				description: data.description,
				ownerId: dbUser.id,
				teamId: data.teamId,
				dueDate: new Date(data.dueDate),
				views: data.views,
			})
			.returning();

		// Add owner as a member
		await db.insert(projectMembers).values({
			projectId: newProject[0].id,
			userId: dbUser.id,
			role: "Owner",
			permission: "administrator",
		});

		// Add Kanban lists from statuses
		const customStatuses = data.statuses || {
			notStarted: ["To Do"],
			active: ["In Progress"],
			done: ["Done"],
			closed: ["Closed"],
		};

		const allStatuses = [
			...(customStatuses.notStarted || []),
			...(customStatuses.active || []),
			...(customStatuses.done || []),
			...(customStatuses.closed || []),
		];

		const listsToInsert = allStatuses.map((name, index) => ({
			name,
			projectId: newProject[0].id,
			position: index,
		}));

		if (listsToInsert.length > 0) {
			await db.insert(lists).values(listsToInsert);
		}

		revalidatePath("/projects");
		return { success: true, data: newProject[0] };
	} catch (err: any) {
		console.error("createProjectAction Error:", err);
		return {
			success: false,
			error: err?.message || "Failed to create project.",
		};
	}
}

export async function getProjectsAction() {
	try {
		await getAuthenticatedDbUser();

		const allProjects = await db
			.select({
				id: projects.id,
				name: projects.name,
				description: projects.description,
				dueDate: projects.dueDate,
				createdAt: projects.createdAt,
				views: projects.views,
				teamName: teams.name,
			})
			.from(projects)
			.leftJoin(teams, eq(projects.teamId, teams.id));

		return { success: true, data: allProjects };
	} catch (err: any) {
		console.error("getProjectsAction Error:", err);
		return {
			success: false,
			error: err?.message || "Failed to fetch projects.",
		};
	}
}

export async function getProjectDetailAction(id: string) {
	try {
		await getAuthenticatedDbUser();

		const projectDetails = await db.query.projects.findFirst({
			where: eq(projects.id, id),
			with: {
				lists: {
					orderBy: (lists, { asc }) => [asc(lists.position)],
					with: {
						tasks: true,
					},
				},
			},
		});

		if (!projectDetails) {
			return { success: false, error: "Project not found" };
		}

		return { success: true, data: projectDetails };
	} catch (err: any) {
		console.error("getProjectDetailAction Error:", err);
		return {
			success: false,
			error: err?.message || "Failed to fetch project details.",
		};
	}
}

export async function checkProjectNameUniqueAction(name: string) {
	try {
		await getAuthenticatedDbUser();
		if (!name || name.trim() === "") {
			return { success: true, isUnique: true };
		}

		const existingProject = await db.query.projects.findFirst({
			where: eq(projects.name, name.trim()),
		});

		return { success: true, isUnique: !existingProject };
	} catch (err: any) {
		console.error("checkProjectNameUniqueAction Error:", err);
		return {
			success: false,
			error: err?.message || "Failed to check project name uniqueness.",
		};
	}
}

export async function getProjectSettingsAction(id: string) {
	try {
		await getAuthenticatedDbUser();

		// Fetch project with team (and team's members) and project members
		const projectData = await db.query.projects.findFirst({
			where: eq(projects.id, id),
			with: {
				team: {
					with: {
						members: {
							with: {
								user: true,
							},
						},
					},
				},
				members: {
					with: {
						user: true,
					},
				},
				lists: {
					orderBy: (lists, { asc }) => [asc(lists.position)],
				},
			},
		});

		if (!projectData) {
			return { success: false, error: "Project not found." };
		}

		// Combine team members and project members, deduplicating by user ID
		const memberMap = new Map();

		// First, add team members
		if (projectData.team?.members) {
			projectData.team.members.forEach((tm) => {
				if (tm.user) {
					memberMap.set(tm.user.id, {
						id: tm.id,
						name: tm.user.name ?? "Unknown",
						email: tm.user.email ?? "",
						role: tm.role ?? "Member",
						access: tm.permission as "administrator" | "member" | "viewer",
					});
				}
			});
		}

		// Then, add or override with explicit project members
		if (projectData.members) {
			projectData.members.forEach((pm) => {
				if (pm.user) {
					memberMap.set(pm.user.id, {
						id: pm.id,
						name: pm.user.name ?? "Unknown",
						email: pm.user.email ?? "",
						role: pm.role ?? "Member",
						access: pm.permission as "administrator" | "member" | "viewer",
					});
				}
			});
		}

		const members = Array.from(memberMap.values());

		// Map lists to statuses (lists are the Kanban columns / statuses)
		const statuses = projectData.lists.map((list) => ({
			name: list.name,
			description: "",
			color:
				"bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-950 dark:text-blue-300 dark:border-blue-800",
		}));

		return {
			success: true,
			data: {
				id: projectData.id,
				name: projectData.name,
				description: projectData.description ?? "",
				teamName: projectData.team?.name ?? "",
				teamId: projectData.teamId ?? "",
				dueDate: projectData.dueDate?.toISOString() ?? "",
				views: (projectData.views as string[]) ?? [],
				members,
				statuses,
			},
		};
	} catch (err: any) {
		console.error("getProjectSettingsAction Error:", err);
		return {
			success: false,
			error: err?.message || "Failed to fetch project settings.",
		};
	}
}
