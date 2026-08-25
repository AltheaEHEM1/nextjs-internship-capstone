import { and, eq, isNull } from "drizzle-orm";
import { getAuthenticatedDbUser } from "@/lib/auth/GetUser";
import { db } from "@/lib/db/index";
import { priorityEnum, projects, teamMembers } from "@/lib/db/schema/index";

/**
 * Server-side read-only query helpers for projects.
 * Used directly by Server Components (no HTTP round-trip needed).
 */

export async function getProjectsQuery() {
	try {
		const dbUser = await getAuthenticatedDbUser();

		const allProjects = await db.query.projects.findMany({
			where: isNull(projects.deletedAt),
			with: {
				team: {
					with: { members: true },
				},
			},
			orderBy: (projects, { desc }) => [desc(projects.createdAt)],
		});

		const userProjects = allProjects.filter((p) => {
			return (
				p.ownerId === dbUser.id ||
				p.team?.members?.some((m) => m.userId === dbUser.id)
			);
		});

		const formattedProjects = userProjects.map((p) => {
			const memberCount = p.team?.members?.length ?? 0;

			let currentUserPermission = "viewer";
			const isOwner = p.ownerId === dbUser.id;
			if (isOwner) {
				currentUserPermission = "administrator";
			} else if (p.team?.members) {
				const memberRec = p.team.members.find((m) => m.userId === dbUser.id);
				if (memberRec) {
					currentUserPermission = memberRec.permission;
				}
			}

			if (
				(p.status === "finished" || p.status === "archived") &&
				currentUserPermission === "member"
			) {
				currentUserPermission = "viewer";
			}

			return {
				id: p.id,
				name: p.name,
				description: p.description,
				dueDate: p.dueDate,
				status: p.status,
				createdAt: p.createdAt,
				views: p.views,
				teamName: p.team?.name || null,
				memberCount,
				currentUserPermission,
			};
		});

		return { success: true, data: formattedProjects };
	} catch (err: unknown) {
		console.error("getProjectsQuery Error:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to fetch projects.",
		};
	}
}

export async function getProjectDetailQuery(id: string) {
	try {
		const dbUser = await getAuthenticatedDbUser();

		const projectDetails = await db.query.projects.findFirst({
			where: and(eq(projects.id, id), isNull(projects.deletedAt)),
			with: {
				team: {
					with: {
						members: {
							where: eq(teamMembers.userId, dbUser.id),
						},
					},
				},
				statuses: {
					orderBy: (statuses, { asc }) => [asc(statuses.position)],
					with: {
						tasks: {
							orderBy: (tasks, { asc }) => [asc(tasks.position)],
							with: {
								reporter: true,
								assignee: true,
								taskLabels: {
									with: {
										label: true,
									},
								},
							},
						},
					},
				},
			},
		});

		if (!projectDetails) {
			return { success: false, error: "Project not found" };
		}

		const isOwner = projectDetails.ownerId === dbUser.id;
		let currentUserPermission = "viewer";

		if (isOwner) {
			currentUserPermission = "administrator";
		} else if (projectDetails.team?.members?.length) {
			currentUserPermission = projectDetails.team.members[0].permission;
		}

		if (
			(projectDetails.status === "finished" ||
				projectDetails.status === "archived") &&
			currentUserPermission === "member"
		) {
			currentUserPermission = "viewer";
		}

		return {
			success: true,
			data: { ...projectDetails, currentUserPermission },
		};
	} catch (err: unknown) {
		console.error("getProjectDetailQuery Error:", err);
		return {
			success: false,
			error:
				err instanceof Error ? err.message : "Failed to fetch project details.",
		};
	}
}

export async function checkProjectNameUniqueQuery(name: string) {
	try {
		const dbUser = await getAuthenticatedDbUser();
		if (!name || name.trim() === "") {
			return { success: true, isUnique: true };
		}

		const existingProject = await db.query.projects.findFirst({
			where: and(
				eq(projects.name, name.trim()),
				eq(projects.ownerId, dbUser.id),
				isNull(projects.deletedAt),
			),
		});

		return { success: true, isUnique: !existingProject };
	} catch (err: unknown) {
		console.error("checkProjectNameUniqueQuery Error:", err);
		return {
			success: false,
			error:
				err instanceof Error
					? err.message
					: "Failed to check project name uniqueness.",
		};
	}
}

export async function getProjectSettingsQuery(id: string) {
	try {
		const dbUser = await getAuthenticatedDbUser();

		const projectData = await db.query.projects.findFirst({
			where: and(eq(projects.id, id), isNull(projects.deletedAt)),
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
				statuses: {
					orderBy: (statuses, { asc }) => [asc(statuses.position)],
				},
				labels: true,
			},
		});

		if (!projectData) {
			return { success: false, error: "Project not found." };
		}

		const members: {
			id: string;
			userId: string;
			name: string;
			email: string;
			role: string;
			access: "administrator" | "member" | "viewer";
		}[] = [];

		let currentUserPermission = "viewer";
		const isOwner = projectData.ownerId === dbUser.id;

		if (isOwner) {
			currentUserPermission = "administrator";
		}

		if (projectData.team?.members) {
			projectData.team.members.forEach((tm) => {
				if (tm.userId === dbUser.id && !isOwner) {
					currentUserPermission = tm.permission;
				}
				if (tm.user) {
					members.push({
						id: tm.id,
						userId: tm.user.id,
						name: tm.user.name ?? "Unknown",
						email: tm.user.email ?? "",
						role: tm.role ?? "Member",
						access: tm.permission as "administrator" | "member" | "viewer",
					});
				}
			});
		}

		if (
			(projectData.status === "finished" ||
				projectData.status === "archived") &&
			currentUserPermission === "member"
		) {
			currentUserPermission = "viewer";
		}

		const statuses =
			projectData.statuses?.map((s) => ({
				id: s.id,
				name: s.name,
				description: s.description ?? "",
				color: s.color ?? "",
			})) ?? [];

		const projectLabels =
			projectData.labels?.map((l) => ({
				name: l.name,
				color: l.color,
			})) ?? [];

		return {
			success: true,
			data: {
				id: projectData.id,
				name: projectData.name,
				description: projectData.description ?? "",
				teamName: projectData.team?.name ?? "",
				teamId: projectData.teamId ?? "",
				dueDate: projectData.dueDate?.toISOString().split("T")[0] ?? "",
				createdAt: projectData.createdAt?.toISOString().split("T")[0] ?? "",
				status: projectData.status,
				views: (projectData.views as string[]) ?? [],
				members,
				statuses,
				labels: projectLabels,
				priorities: priorityEnum.enumValues,
				currentUserPermission,
			},
		};
	} catch (err: unknown) {
		console.error("getProjectSettingsQuery Error:", err);
		return {
			success: false,
			error:
				err instanceof Error
					? err.message
					: "Failed to fetch project settings.",
		};
	}
}
