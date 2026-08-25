import { and, eq, isNull } from "drizzle-orm";
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

async function _checkUserProjectPermission(userId: string, projectId: string) {
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

export async function POST(req: Request) {
	try {
		const data = await req.json();

		const validationResult = taskSchema.safeParse(data);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					success: false,
					error:
						validationResult.error.issues[0]?.message || "Invalid task data",
				},
				{ status: 400 },
			);
		}

		const dbUser = await getAuthenticatedDbUser();

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

		if (permission !== "administrator") {
			return NextResponse.json(
				{ success: false, error: "Only administrators can create tasks." },
				{ status: 403 },
			);
		}

		if (data.startDate || data.dueDate) {
			// use a loose start of day for createdAt, but strict for project.dueDate (which is end of day)
			const pStart = projectData.createdAt.getTime();
			const pEnd = projectData.dueDate.getTime();

			if (data.startDate) {
				const sDate = new Date(data.startDate).getTime();
				if (sDate < pStart || sDate > pEnd) {
					return NextResponse.json(
						{
							success: false,
							error: "Task start date must fall within project lifetime.",
						},
						{ status: 400 },
					);
				}
			}
			if (data.dueDate) {
				const dDate = new Date(data.dueDate).getTime();
				if (dDate < pStart || dDate > pEnd) {
					return NextResponse.json(
						{
							success: false,
							error: "Task due date must fall within project lifetime.",
						},
						{ status: 400 },
					);
				}
			}
			if (data.startDate && data.dueDate) {
				if (
					new Date(data.startDate).getTime() > new Date(data.dueDate).getTime()
				) {
					return NextResponse.json(
						{ success: false, error: "Start date must be before due date." },
						{ status: 400 },
					);
				}
			}
		}

		const existingTask = await db.query.tasks.findFirst({
			where: and(
				eq(tasks.title, data.title.trim()),
				eq(tasks.reporterId, dbUser.id),
				isNull(tasks.deletedAt),
			),
		});

		if (existingTask) {
			return NextResponse.json(
				{ success: false, error: "A task with this name already exists." },
				{ status: 409 },
			);
		}

		const newTask = await db
			.insert(tasks)
			.values({
				title: data.title,
				description: data.description || null,
				statusId: data.statusId,
				assigneeId: data.assigneeId || null,
				reporterId: dbUser.id,
				priority: data.priority || "medium",
				startDate: data.startDate ? new Date(data.startDate) : null,
				dueDate: data.dueDate ? new Date(data.dueDate) : null,
			})
			.returning();

		const taskId = newTask[0].id;

		if (data.labelName) {
			const label = await db.query.labels.findFirst({
				where: and(
					eq(labels.projectId, data.projectId),
					eq(labels.name, data.labelName),
				),
			});
			if (label) {
				await db.insert(taskLabels).values({ taskId, labelId: label.id });
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
						{
							taskTitle: data.title,
							assignerName: dbUser.name || "Someone",
							projectId: data.projectId,
							taskId,
						},
					);
				}
			}

			await notifyProjectMembers(
				data.projectId,
				"task-added",
				{
					taskTitle: data.title,
					creatorName: dbUser.name || "Someone",
					projectId: data.projectId,
					taskId,
				},
				dbUser.clerkId,
			);
		}

		return NextResponse.json({ success: true, data: newTask[0] });
	} catch (err: unknown) {
		console.error("POST /api/task/create Error:", err);
		return NextResponse.json(
			{
				success: false,
				error: err instanceof Error ? err.message : "Failed to create task",
			},
			{ status: 500 },
		);
	}
}
