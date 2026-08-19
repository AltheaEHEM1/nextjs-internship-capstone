"use server";

import { and, eq, inArray, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthenticatedDbUser } from "@/lib/auth/get-user";
import { db } from "@/lib/db";
import {
	labels,
	priorityEnum,
	projectStatuses,
	projects,
} from "@/lib/db/schema";

export async function createProjectAction(data: {
	name: string;
	description?: string;
	teamId: string;
	dueDate: string;
	views: string[];
	statuses?: {
		notStarted?: string[];
		active?: string[];
		done?: string[];
		closed?: string[];
	};
}) {
	try {
		const dbUser = await getAuthenticatedDbUser();

		// Check if a project with the same name already exists
		const existingProject = await db.query.projects.findFirst({
			where: eq(projects.name, data.name),
		});

		if (existingProject) {
			return {
				success: false,
				error: "A project with this name already exists.",
			};
		}

		const newProject = await db
			.insert(projects)
			.values({
				name: data.name,
				description: data.description,
				ownerId: dbUser.id,
				teamId: data.teamId,
				dueDate: new Date(data.dueDate),
				views: [
					"Dashboard",
					"List",
					"Board",
					"Calendar",
					"Whiteboard",
					"Gantt Chart",
					"Timeline",
				],
			})
			.returning();

		// Map User-Provided Statuses
		const userStatuses = data.statuses || {
			notStarted: ["To Do"],
			active: ["In Progress"],
			done: ["Done"],
			closed: [],
		};

		const finalStatuses: Array<{
			name: string;
			description: string;
			color: string;
		}> = [];

		userStatuses.notStarted?.forEach((name: string) => {
			finalStatuses.push({
				name,
				description: "Task is not started",
				color:
					"bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800",
			});
		});
		userStatuses.active?.forEach((name: string) => {
			finalStatuses.push({
				name,
				description: "Task is in progress",
				color:
					"bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800",
			});
		});
		userStatuses.done?.forEach((name: string) => {
			finalStatuses.push({
				name,
				description: "Task is completed",
				color:
					"bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-800",
			});
		});
		userStatuses.closed?.forEach((name: string) => {
			finalStatuses.push({
				name,
				description: "Task is closed",
				color:
					"bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900 dark:text-rose-300 dark:border-rose-800",
			});
		});

		const statusesToInsert = finalStatuses.map((s, index) => ({
			name: s.name,
			description: s.description,
			color: s.color,
			projectId: newProject[0].id,
			position: index,
		}));

		if (statusesToInsert.length > 0) {
			await db.insert(projectStatuses).values(statusesToInsert);
		}

		// Default Labels
		const defaultLabels = [
			{
				name: "Bug",
				color:
					"bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
			},
			{
				name: "Frontend",
				color:
					"bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
			},
			{
				name: "Testing",
				color:
					"bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
			},
			{
				name: "Backend",
				color:
					"bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
			},
			{
				name: "Documentation",
				color:
					"bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
			},
			{
				name: "Feature",
				color:
					"bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
			},
		];

		const labelsToInsert = defaultLabels.map((l) => ({
			...l,
			projectId: newProject[0].id,
		}));

		await db.insert(labels).values(labelsToInsert);

		revalidatePath("/projects");
		return { success: true, data: newProject[0] };
	} catch (err: unknown) {
		console.error("createProjectAction Error:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to create project.",
		};
	}
}

export async function getProjectsAction() {
	try {
		await getAuthenticatedDbUser();

		const allProjects = await db.query.projects.findMany({
			where: isNull(projects.deletedAt),
			with: {
				team: {
					with: { members: true },
				},
			},
			orderBy: (projects, { desc }) => [desc(projects.createdAt)],
		});

		const formattedProjects = allProjects.map((p) => {
			const memberCount = p.team?.members?.length ?? 0;

			return {
				id: p.id,
				name: p.name,
				description: p.description,
				dueDate: p.dueDate,
				createdAt: p.createdAt,
				views: p.views,
				teamName: p.team?.name || null,
				memberCount,
			};
		});

		return { success: true, data: formattedProjects };
	} catch (err: unknown) {
		console.error("getProjectsAction Error:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to fetch projects.",
		};
	}
}

export async function getProjectDetailAction(id: string) {
	try {
		await getAuthenticatedDbUser();

		const projectDetails = await db.query.projects.findFirst({
			where: and(eq(projects.id, id), isNull(projects.deletedAt)),
			with: {
				statuses: {
					orderBy: (statuses, { asc }) => [asc(statuses.position)],
					with: {
						tasks: {
							orderBy: (tasks, { asc }) => [asc(tasks.position)],
							with: {
								reporter: true,
								assignee: true,
							},
						},
					},
				},
			},
		});

		if (!projectDetails) {
			return { success: false, error: "Project not found" };
		}

		return { success: true, data: projectDetails };
	} catch (err: unknown) {
		console.error("getProjectDetailAction Error:", err);
		return {
			success: false,
			error:
				err instanceof Error ? err.message : "Failed to fetch project details.",
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
			where: and(eq(projects.name, name.trim()), isNull(projects.deletedAt)),
		});

		return { success: true, isUnique: !existingProject };
	} catch (err: unknown) {
		console.error("checkProjectNameUniqueAction Error:", err);
		return {
			success: false,
			error:
				err instanceof Error
					? err.message
					: "Failed to check project name uniqueness.",
		};
	}
}

export async function getProjectSettingsAction(id: string) {
	try {
		await getAuthenticatedDbUser();

		// Fetch project with team (and team's members)
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

		// Build members list from team members (single source of truth)
		const members: {
			id: string;
			userId: string;
			name: string;
			email: string;
			role: string;
			access: "administrator" | "member" | "viewer";
		}[] = [];

		if (projectData.team?.members) {
			projectData.team.members.forEach((tm) => {
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

		// Map collections
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
				dueDate: projectData.dueDate?.toISOString() ?? "",
				views: (projectData.views as string[]) ?? [],
				members,
				statuses,
				labels: projectLabels,
				priorities: priorityEnum.enumValues,
			},
		};
	} catch (err: unknown) {
		console.error("getProjectSettingsAction Error:", err);
		return {
			success: false,
			error:
				err instanceof Error
					? err.message
					: "Failed to fetch project settings.",
		};
	}
}

export async function updateProjectSettingsAction(
	id: string,
	data: {
		name: string;
		description: string;
		teamId: string;
		statuses?: {
			id?: string;
			name: string;
			description: string;
			color: string;
		}[];
	},
) {
	try {
		await getAuthenticatedDbUser();

		await db
			.update(projects)
			.set({
				name: data.name,
				description: data.description,
				teamId: data.teamId,
			})
			.where(and(eq(projects.id, id), isNull(projects.deletedAt)));

		// Sync statuses
		if (data.statuses) {
			const existingStatuses = await db.query.projectStatuses.findMany({
				where: eq(projectStatuses.projectId, id),
			});
			const existingIds = new Set(existingStatuses.map((s) => s.id));
			const incomingIds = new Set(
				data.statuses.map((s) => s.id).filter(Boolean),
			);

			// Delete ones not in incoming
			const toDelete = [...existingIds].filter((eid) => !incomingIds.has(eid));
			if (toDelete.length > 0) {
				await db
					.delete(projectStatuses)
					.where(inArray(projectStatuses.id, toDelete));
			}

			// Upsert incoming
			for (let i = 0; i < data.statuses.length; i++) {
				const s = data.statuses[i];
				if (s.id && existingIds.has(s.id)) {
					// update
					await db
						.update(projectStatuses)
						.set({
							name: s.name,
							description: s.description,
							color: s.color,
							position: i,
						})
						.where(eq(projectStatuses.id, s.id));
				} else {
					// insert
					await db.insert(projectStatuses).values({
						projectId: id,
						name: s.name,
						description: s.description,
						color: s.color,
						position: i,
					});
				}
			}
		}

		revalidatePath("/projects");
		revalidatePath(`/projects/${id}`);
		revalidatePath(`/projects/${id}/project-settings`);

		return { success: true };
	} catch (err: unknown) {
		console.error("updateProjectSettingsAction Error:", err);
		return {
			success: false,
			error:
				err instanceof Error
					? err.message
					: "Failed to update project settings.",
		};
	}
}

export async function getProjectMembersAction(projectId: string) {
	try {
		await getAuthenticatedDbUser();

		const project = await db.query.projects.findFirst({
			where: and(eq(projects.id, projectId), isNull(projects.deletedAt)),
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
			},
		});

		if (!project) return { success: false, error: "Project not found" };

		// Use team members as the single source of truth
		const members =
			project.team?.members?.filter((tm) => tm.user).map((tm) => tm.user) ?? [];

		return { success: true, data: members };
	} catch (err: unknown) {
		console.error("getProjectMembersAction Error:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to fetch members",
		};
	}
}

export async function deleteProjectAction(id: string) {
	try {
		await getAuthenticatedDbUser();

		await db
			.update(projects)
			.set({ deletedAt: new Date() })
			.where(eq(projects.id, id));

		revalidatePath("/projects");

		return { success: true };
	} catch (err: unknown) {
		console.error("deleteProjectAction Error:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to delete project.",
		};
	}
}

export async function reorderStatusesAction(
	statusesToUpdate: { id: string; position: number }[],
	projectId: string,
) {
	try {
		await getAuthenticatedDbUser();

		for (const s of statusesToUpdate) {
			await db
				.update(projectStatuses)
				.set({
					position: s.position,
				})
				.where(eq(projectStatuses.id, s.id));
		}

		if (projectId) {
			revalidatePath(`/projects/${projectId}`);
		}

		return { success: true };
	} catch (err: unknown) {
		console.error("reorderStatusesAction Error:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to reorder statuses",
		};
	}
}
