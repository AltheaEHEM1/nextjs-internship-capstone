import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth/GetUser";
import { db } from "@/lib/db/index";
import {
	labels,
	projects,
	taskHistory,
	taskLabels,
	tasks,
	teamMembers,
	users,
} from "@/lib/db/schema/index";
import { notifyProjectMembers } from "@/lib/notifications/NotifyProject";
import { pusherServer } from "@/lib/real-time-board/PusherServer";
import { taskSchema } from "@/lib/validation/Validations";
import type { DeleteTaskRequest, UpdateTaskRequest } from "@/types/api/task";

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

// PATCH /api/task/[id]
export async function PATCH(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const data: UpdateTaskRequest = await req.json();

		const validationResult = taskSchema.partial().safeParse(data);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					success: false,
					error:
						validationResult.error.issues[0]?.message ||
						"Invalid task update data",
				},
				{ status: 400 },
			);
		}

		const dbUser = await getAuthenticatedDbUser();

		if (!id) {
			return NextResponse.json(
				{ success: false, error: "Missing task ID" },
				{ status: 400 },
			);
		}

		const oldTask = await db.query.tasks.findFirst({
			where: eq(tasks.id, id),
		});
		if (!oldTask) {
			return NextResponse.json(
				{ success: false, error: "Task not found" },
				{ status: 404 },
			);
		}

		const projectData = await db.query.projects.findFirst({
			where: eq(projects.id, data.projectId),
			with: {
				team: {
					with: {
						members: {
							where: eq(teamMembers.userId, dbUser.id),
						},
					},
				},
			},
		});

		if (!projectData) {
			return NextResponse.json(
				{ success: false, error: "Project not found" },
				{ status: 404 },
			);
		}

		let permission = "viewer";
		if (projectData.ownerId === dbUser.id) {
			permission = "administrator";
		} else {
			permission = projectData.team?.members?.[0]?.permission || "viewer";
		}

		const isOnlyStatusUpdate =
			data.statusId !== undefined &&
			data.title === undefined &&
			data.description === undefined &&
			data.assigneeId === undefined &&
			data.priority === undefined &&
			data.startDate === undefined &&
			data.dueDate === undefined &&
			data.label === undefined;

		if (permission !== "administrator" && !isOnlyStatusUpdate) {
			return NextResponse.json(
				{
					success: false,
					error: "Only administrators can edit task details.",
				},
				{ status: 403 },
			);
		}

		if (data.startDate || data.dueDate) {
			const pStart = projectData.createdAt.getTime();
			const pEnd = projectData.dueDate.getTime();
			const finalStartDate = data.startDate
				? new Date(data.startDate).getTime()
				: oldTask.startDate
					? oldTask.startDate.getTime()
					: null;
			const finalDueDate = data.dueDate
				? new Date(data.dueDate).getTime()
				: oldTask.dueDate
					? oldTask.dueDate.getTime()
					: null;

			if (finalStartDate) {
				if (finalStartDate < pStart || finalStartDate > pEnd) {
					return NextResponse.json(
						{
							success: false,
							error: "Task start date must fall within project lifetime.",
						},
						{ status: 400 },
					);
				}
			}
			if (finalDueDate) {
				if (finalDueDate < pStart || finalDueDate > pEnd) {
					return NextResponse.json(
						{
							success: false,
							error: "Task due date must fall within project lifetime.",
						},
						{ status: 400 },
					);
				}
			}
			if (finalStartDate && finalDueDate) {
				if (finalStartDate > finalDueDate) {
					return NextResponse.json(
						{ success: false, error: "Start date must be before due date." },
						{ status: 400 },
					);
				}
			}
		}

		const updateData = {
			...(data.title !== undefined && { title: data.title }),
			...(data.description !== undefined && { description: data.description }),
			...(data.statusId !== undefined && { statusId: data.statusId }),
			...(data.assigneeId !== undefined && {
				assigneeId: data.assigneeId === "" ? null : data.assigneeId,
			}),
			...(data.priority !== undefined && { priority: data.priority }),
			...(data.startDate !== undefined && {
				startDate: data.startDate ? new Date(data.startDate) : null,
			}),
			...(data.dueDate !== undefined && {
				dueDate: data.dueDate ? new Date(data.dueDate) : null,
			}),
		};

		if (Object.keys(updateData).length > 0) {
			await db.update(tasks).set(updateData).where(eq(tasks.id, id));
		}

		if (data.label !== undefined) {
			await db.delete(taskLabels).where(eq(taskLabels.taskId, id));
			if (data.label) {
				const labelObj = await db.query.labels.findFirst({
					where: and(
						eq(labels.projectId, data.projectId),
						eq(labels.name, data.label),
					),
				});
				if (labelObj) {
					await db
						.insert(taskLabels)
						.values({ taskId: id, labelId: labelObj.id });
				}
			}
		}

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
								projectId: data.projectId,
								taskId: id,
							},
						);
					}
				}
			}

			await notifyProjectMembers(
				data.projectId,
				"task-edited",
				{
					taskTitle: data.title || oldTask?.title || "A task",
					editorName: dbUser.name || "Someone",
					projectId: data.projectId,
					taskId: id,
				},
				dbUser.clerkId,
			);
		}

		return NextResponse.json({ success: true, data: updatedTask });
	} catch (err: unknown) {
		console.error("PATCH /api/task/[id] Error:", err);
		return NextResponse.json(
			{
				success: false,
				error: err instanceof Error ? err.message : "Failed to update task",
			},
			{ status: 500 },
		);
	}
}

// DELETE /api/task/[id]
export async function DELETE(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const { projectId }: DeleteTaskRequest = await req.json();
		const dbUser = await getAuthenticatedDbUser();

		if (!id) {
			return NextResponse.json(
				{ success: false, error: "Missing task ID" },
				{ status: 400 },
			);
		}

		const permission = await checkUserProjectPermission(dbUser.id, projectId);
		if (permission !== "administrator") {
			return NextResponse.json(
				{ success: false, error: "Only administrators can delete tasks." },
				{ status: 403 },
			);
		}

		const taskToDelete = await db.query.tasks.findFirst({
			where: eq(tasks.id, id),
		});

		if (!taskToDelete) {
			return NextResponse.json(
				{ success: false, error: "Task not found" },
				{ status: 404 },
			);
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
					projectId,
				},
				dbUser.clerkId,
			);
		}

		return NextResponse.json({ success: true });
	} catch (err: unknown) {
		console.error("DELETE /api/task/[id] Error:", err);
		return NextResponse.json(
			{
				success: false,
				error: err instanceof Error ? err.message : "Failed to delete task",
			},
			{ status: 500 },
		);
	}
}
