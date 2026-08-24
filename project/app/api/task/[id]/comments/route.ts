import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth/GetUser";
import { db } from "@/lib/db/index";
import { comments, tasks } from "@/lib/db/schema/index";
import { notifyProjectMembers } from "@/lib/notifications/NotifyProject";
import { getTaskCommentsQuery } from "@/lib/queries/task";
import { pusherServer } from "@/lib/real-time-board/PusherServer";
import { commentSchema } from "@/lib/validation/Validations";
import type { CreateCommentRequest } from "@/types/api/task";

// GET /api/task/[id]/comments
export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const result = await getTaskCommentsQuery(id);
		return NextResponse.json(result);
	} catch (err: unknown) {
		console.error("GET /api/task/[id]/comments Error:", err);
		return NextResponse.json(
			{
				success: false,
				error: err instanceof Error ? err.message : "Failed to fetch comments",
			},
			{ status: 500 },
		);
	}
}

// POST /api/task/[id]/comments
export async function POST(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id: taskId } = await params;
		const { content, projectId }: CreateCommentRequest = await req.json();

		const validationResult = commentSchema.safeParse({ text: content, taskId });
		if (!validationResult.success) {
			return NextResponse.json(
				{
					success: false,
					error:
						validationResult.error.issues[0]?.message || "Invalid comment data",
				},
				{ status: 400 },
			);
		}

		const dbUser = await getAuthenticatedDbUser();

		const newComment = await db
			.insert(comments)
			.values({ taskId, content, authorId: dbUser.id })
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
					projectId,
					taskId,
				},
				dbUser.clerkId,
			);
		}

		return NextResponse.json({ success: true, data: newComment[0] });
	} catch (err: unknown) {
		console.error("POST /api/task/[id]/comments Error:", err);
		return NextResponse.json(
			{
				success: false,
				error: err instanceof Error ? err.message : "Failed to create comment",
			},
			{ status: 500 },
		);
	}
}
