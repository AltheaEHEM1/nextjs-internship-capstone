"use server";

import { and, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getAuthenticatedDbUser } from "@/lib/auth/get-user";
import { db } from "@/lib/db";
import { projectLabels, taskLabels, tasks } from "@/lib/db/schema";

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
			const label = await db.query.projectLabels.findFirst({
				where: and(
					eq(projectLabels.projectId, data.projectId),
					eq(projectLabels.name, data.labelName),
				),
			});

			if (label) {
				await db.insert(taskLabels).values({
					taskId,
					labelId: label.id,
				});
			}
		}

		revalidatePath(`/projects/${data.projectId}`);
		return { success: true, data: newTask[0] };
	} catch (err: unknown) {
		console.error("createTaskAction Error:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to create task",
		};
	}
}
