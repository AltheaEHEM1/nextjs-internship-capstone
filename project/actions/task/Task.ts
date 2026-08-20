"use server";

import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthenticatedDbUser } from "@/lib/auth/get-user";
import { db } from "@/lib/db";
import {
	comments,
	labels,
	projectStatuses,
	projects,
	taskHistory,
	taskLabels,
	tasks,
	teamMembers,
	users,
} from "@/lib/db/schema";
import { notifyProjectMembers } from "@/lib/notifications/notify-project";
import { pusherServer } from "@/lib/pusher-server";

async function checkUserProjectPermission(userId: string, projectId: string) {
	const projectData = await db.query.projects.findFirst({
		where: eq(projects.id, projectId),
		with: {
			team: {
				with: {
					members: {
						where: eq(teamMembers.userId, userId),
					},
				},
			},
		},
	});

	if (!projectData) return "viewer";

	if (projectData.ownerId === userId) return "administrator";
	return projectData.team?.members?.[0]?.permission || "viewer";
}

export async function createTaskAction(data: {
	title: string;
	description?: string;
	statusId: string;
	assigneeId?: string;
	priority?: "low" | "medium" | "high" | "urgent";
	dueDate?: string;
	projectId: string;
	labelName?: string;
}) {
	try {
		const dbUser = await getAuthenticatedDbUser();

		if (!data.title || !data.statusId || !data.projectId) {
			return { success: false, error: "Missing required fields" };
		}

		const permission = await checkUserProjectPermission(
			dbUser.id,
			data.projectId,
		);
		if (permission !== "administrator") {
			return { success: false, error: "Only administrators can create tasks." };
		}

		// Check if task name already exists for this user
		const existingTask = await db.query.tasks.findFirst({
			where: and(
				eq(tasks.title, data.title.trim()),
				eq(tasks.reporterId, dbUser.id),
				isNull(tasks.deletedAt),
			),
		});

		if (existingTask) {
			return { success: false, error: "A task with this name already exists." };
		}

		// Insert the task
		const newTask = await db
			.insert(tasks)
			.values({
				title: data.title,
				description: data.description || null,
				statusId: data.statusId,
				assigneeId: data.assigneeId || null,
				reporterId: dbUser.id,
				priority: data.priority || "medium",
				dueDate: data.dueDate ? new Date(data.dueDate) : null,
			})
			.returning();

		const taskId = newTask[0].id;

		// If a label is provided, find its ID and insert into taskLabels
		if (data.labelName) {
			const label = await db.query.labels.findFirst({
				where: and(
					eq(labels.projectId, data.projectId),
					eq(labels.name, data.labelName),
				),
			});

			if (label) {
				await db.insert(taskLabels).values({
					taskId,
					labelId: label.id,
				});
			}
		}

		await db.insert(taskHistory).values({
			taskId,
			action: "created the task",
			authorId: dbUser.id,
		});

		revalidatePath(`/projects/${data.projectId}`);

		if (pusherServer) {
			await pusherServer.trigger(
				`project-${data.projectId}`,
				"task-updated",
				{},
			);

			if (data.assigneeId && data.assigneeId !== dbUser.id) {
				const assignee = await db.query.users.findFirst({
					where: eq(users.id, data.assigneeId),
				});
				if (assignee?.clerkId) {
					await pusherServer.trigger(
						`user-${assignee.clerkId}`,
						"task-assigned",
						{ taskTitle: data.title, assignerName: dbUser.name || "Someone" },
					);
				}
			}

			// Notify project members about the new task
			await notifyProjectMembers(
				data.projectId,
				"task-added",
				{
					taskTitle: data.title,
					creatorName: dbUser.name || "Someone",
				},
				dbUser.clerkId,
			);
		}

		return { success: true, data: newTask[0] };
	} catch (err: unknown) {
		console.error("createTaskAction Error:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to create task",
		};
	}
}

export async function updateTaskAction(
	id: string,
	data: {
		title?: string;
		description?: string;
		statusId?: string;
		assigneeId?: string;
		priority?: "low" | "medium" | "high" | "urgent";
		dueDate?: string;
		label?: string; // name of the label
		projectId: string; // Needed for pusher
	},
) {
	try {
		const dbUser = await getAuthenticatedDbUser();

		if (!id) {
			return { success: false, error: "Missing task ID" };
		}

		const oldTask = await db.query.tasks.findFirst({
			where: eq(tasks.id, id),
		});
		if (!oldTask) {
			return { success: false, error: "Task not found" };
		}

		const permission = await checkUserProjectPermission(
			dbUser.id,
			data.projectId,
		);

		// If member, only allow statusId changes
		const isOnlyStatusUpdate =
			data.statusId !== undefined &&
			data.title === undefined &&
			data.description === undefined &&
			data.assigneeId === undefined &&
			data.priority === undefined &&
			data.dueDate === undefined &&
			data.label === undefined;

		if (permission !== "administrator" && !isOnlyStatusUpdate) {
			return {
				success: false,
				error: "Only administrators can edit task details.",
			};
		}

		const updateData = {
			...(data.title !== undefined && { title: data.title }),
			...(data.description !== undefined && {
				description: data.description,
			}),
			...(data.statusId !== undefined && { statusId: data.statusId }),
			...(data.assigneeId !== undefined && {
				assigneeId: data.assigneeId === "" ? null : data.assigneeId,
			}),
			...(data.priority !== undefined && { priority: data.priority }),
			...(data.dueDate !== undefined && {
				dueDate: data.dueDate ? new Date(data.dueDate) : null,
			}),
		};

		if (Object.keys(updateData).length > 0) {
			await db.update(tasks).set(updateData).where(eq(tasks.id, id));
		}

		// Handle label update
		if (data.label !== undefined) {
			// First, remove existing labels
			await db.delete(taskLabels).where(eq(taskLabels.taskId, id));

			if (data.label) {
				const labelObj = await db.query.labels.findFirst({
					where: and(
						eq(labels.projectId, data.projectId),
						eq(labels.name, data.label),
					),
				});
				if (labelObj) {
					await db.insert(taskLabels).values({
						taskId: id,
						labelId: labelObj.id,
					});
				}
			}
		}

		// Re-fetch to return full object
		const updatedTask = await db.query.tasks.findFirst({
			where: eq(tasks.id, id),
		});

		if (data.title !== undefined) {
			await db.insert(taskHistory).values({
				taskId: id,
				action: `updated the title to "${data.title}"`,
				authorId: dbUser.id,
			});
		}
		if (data.description !== undefined) {
			await db.insert(taskHistory).values({
				taskId: id,
				action: "updated the description",
				authorId: dbUser.id,
			});
		}
		if (data.priority !== undefined) {
			await db.insert(taskHistory).values({
				taskId: id,
				action: `changed priority to ${data.priority}`,
				authorId: dbUser.id,
			});
		}

		if (data.projectId) {
			revalidatePath(`/projects/${data.projectId}`);
			if (pusherServer) {
				await pusherServer.trigger(
					`project-${data.projectId}`,
					"task-updated",
					{},
				);

				await pusherServer.trigger(
					`project-${data.projectId}`,
					"task-updated",
					{},
				);

				if (
					data.assigneeId &&
					oldTask &&
					oldTask.assigneeId !== data.assigneeId &&
					data.assigneeId !== dbUser.id
				) {
					const assignee = await db.query.users.findFirst({
						where: eq(users.id, data.assigneeId),
					});
					if (assignee?.clerkId) {
						await pusherServer.trigger(
							`user-${assignee.clerkId}`,
							"task-assigned",
							{
								taskTitle: data.title || oldTask.title,
								assignerName: dbUser.name || "Someone",
							},
						);
					}
				}
			}

			// Notify project members about the task edit
			await notifyProjectMembers(
				data.projectId,
				"task-edited",
				{
					taskTitle: data.title || oldTask?.title || "A task",
					editorName: dbUser.name || "Someone",
				},
				dbUser.clerkId,
			);
		}

		return { success: true, data: updatedTask };
	} catch (err: unknown) {
		console.error("updateTaskAction Error:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to update task",
		};
	}
}

export async function deleteTaskAction(id: string, projectId: string) {
	try {
		const dbUser = await getAuthenticatedDbUser();

		if (!id) {
			return { success: false, error: "Missing task ID" };
		}

		const permission = await checkUserProjectPermission(dbUser.id, projectId);
		if (permission !== "administrator") {
			return { success: false, error: "Only administrators can delete tasks." };
		}

		const taskToDelete = await db.query.tasks.findFirst({
			where: eq(tasks.id, id),
		});

		if (!taskToDelete) {
			return { success: false, error: "Task not found" };
		}

		await db
			.update(tasks)
			.set({ deletedAt: new Date() })
			.where(eq(tasks.id, id));

		if (projectId) {
			revalidatePath(`/projects/${projectId}`);
			if (pusherServer) {
				await pusherServer.trigger(`project-${projectId}`, "task-updated", {});
			}

			await notifyProjectMembers(
				projectId,
				"task-deleted",
				{
					taskTitle: taskToDelete.title,
					deleterName: dbUser.name || "Someone",
				},
				dbUser.clerkId,
			);
		}

		return { success: true };
	} catch (err: unknown) {
		console.error("deleteTaskAction Error:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to delete task",
		};
	}
}

export async function reorderTasksAction(
	tasksToUpdate: { id: string; statusId: string; position: number }[],
	projectId: string,
) {
	try {
		const dbUser = await getAuthenticatedDbUser();

		// Update each task sequentially (in a real app, you might want to use a transaction or batch update)
		for (const t of tasksToUpdate) {
			const oldTask = await db.query.tasks.findFirst({
				where: eq(tasks.id, t.id),
			});

			await db
				.update(tasks)
				.set({
					statusId: t.statusId,
					position: t.position,
				})
				.where(eq(tasks.id, t.id));

			if (oldTask && oldTask.statusId !== t.statusId) {
				const newStatus = await db.query.projectStatuses.findFirst({
					where: eq(projectStatuses.id, t.statusId),
				});
				if (newStatus) {
					await db.insert(taskHistory).values({
						taskId: t.id,
						action: `moved task to ${newStatus.name}`,
						authorId: dbUser.id,
					});
				}
			}
		}

		if (projectId) {
			revalidatePath(`/projects/${projectId}`);
			if (pusherServer) {
				await pusherServer.trigger(`project-${projectId}`, "task-updated", {});
			}
		}

		return { success: true };
	} catch (err: unknown) {
		console.error("reorderTasksAction Error:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to reorder tasks",
		};
	}
}

export async function getTaskCommentsAction(taskId: string) {
	try {
		await getAuthenticatedDbUser();

		const taskComments = await db.query.comments.findMany({
			where: eq(comments.taskId, taskId),
			with: {
				author: {
					columns: {
						name: true,
						avatar: true,
					},
				},
			},
			orderBy: (comments, { asc }) => [asc(comments.createdAt)],
		});

		return { success: true, data: taskComments };
	} catch (err: unknown) {
		console.error("getTaskCommentsAction Error:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to fetch comments",
		};
	}
}

export async function createTaskCommentAction(
	taskId: string,
	content: string,
	projectId: string,
) {
	try {
		const dbUser = await getAuthenticatedDbUser();

		if (!taskId || !content) {
			return { success: false, error: "Missing required fields" };
		}

		const newComment = await db
			.insert(comments)
			.values({
				taskId,
				content,
				authorId: dbUser.id,
			})
			.returning();

		if (projectId) {
			revalidatePath(`/projects/${projectId}`);
			if (pusherServer) {
				await pusherServer.trigger(`project-${projectId}`, "task-updated", {});
			}

			const task = await db.query.tasks.findFirst({
				where: eq(tasks.id, taskId),
			});

			await notifyProjectMembers(
				projectId,
				"task-commented",
				{
					taskTitle: task?.title || "A task",
					commenterName: dbUser.name || "Someone",
				},
				dbUser.clerkId,
			);
		}

		return { success: true, data: newComment[0] };
	} catch (err: unknown) {
		console.error("createTaskCommentAction Error:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to create comment",
		};
	}
}

export async function getTaskHistoryAction(taskId: string) {
	try {
		await getAuthenticatedDbUser();

		const history = await db.query.taskHistory.findMany({
			where: eq(taskHistory.taskId, taskId),
			with: {
				author: {
					columns: {
						name: true,
						avatar: true,
					},
				},
			},
			orderBy: (taskHistory, { asc }) => [asc(taskHistory.createdAt)],
		});

		return { success: true, data: history };
	} catch (err: unknown) {
		console.error("getTaskHistoryAction Error:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to fetch history",
		};
	}
}
