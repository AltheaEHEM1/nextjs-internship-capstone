import { and, eq, isNull } from "drizzle-orm";
import { getAuthenticatedDbUser } from "@/lib/auth/GetUser";
import { db } from "@/lib/db/index";
import { comments, taskHistory, tasks } from "@/lib/db/schema/index";

/**
 * Server-side read-only query helpers for tasks.
 * Used directly by Server Components (no HTTP round-trip needed).
 */

export async function checkTaskTitleUniqueQuery(title: string) {
	try {
		const dbUser = await getAuthenticatedDbUser();
		const existingTask = await db.query.tasks.findFirst({
			where: and(
				eq(tasks.title, title.trim()),
				eq(tasks.reporterId, dbUser.id),
				isNull(tasks.deletedAt),
			),
		});
		return { success: true, isUnique: !existingTask };
	} catch (err: unknown) {
		console.error("checkTaskTitleUniqueQuery Error:", err);
		return { success: false, error: "Failed to check task title" };
	}
}

export async function getTaskCommentsQuery(taskId: string) {
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
		console.error("getTaskCommentsQuery Error:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to fetch comments",
		};
	}
}

export async function getTaskHistoryQuery(taskId: string) {
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
		console.error("getTaskHistoryQuery Error:", err);
		return {
			success: false,
			error: err instanceof Error ? err.message : "Failed to fetch history",
		};
	}
}
