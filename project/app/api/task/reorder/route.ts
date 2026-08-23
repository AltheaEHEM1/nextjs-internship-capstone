import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth/GetUser";
import { db } from "@/lib/db/index";
import { projectStatuses, taskHistory, tasks } from "@/lib/db/schema/index";
import { pusherServer } from "@/lib/real-time-board/PusherServer";
import type { ReorderTasksRequest } from "@/types/api/task";

// PATCH /api/task/reorder
export async function PATCH(req: Request) {
	try {
		const { tasks: tasksToUpdate, projectId }: ReorderTasksRequest =
			await req.json();

		const dbUser = await getAuthenticatedDbUser();

		for (const t of tasksToUpdate) {
			const oldTask = await db.query.tasks.findFirst({
				where: eq(tasks.id, t.id),
			});

			await db
				.update(tasks)
				.set({ statusId: t.statusId, position: t.position })
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

		return NextResponse.json({ success: true });
	} catch (err: unknown) {
		console.error("PATCH /api/task/reorder Error:", err);
		return NextResponse.json(
			{
				success: false,
				error: err instanceof Error ? err.message : "Failed to reorder tasks",
			},
			{ status: 500 },
		);
	}
}
