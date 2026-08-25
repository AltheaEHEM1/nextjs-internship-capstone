import { and, eq, gte, lte } from "drizzle-orm";
import { NextResponse } from "next/server";
import { db } from "@/lib/db/index";
import { projects } from "@/lib/db/schema/index";
import { notifyProjectMembers } from "@/lib/notifications/NotifyProject";

// GET /api/cron/project-expiry
export async function GET(req: Request) {
	try {
		// Verify authorization for cron job (e.g. check a cron secret if Vercel)
		const authHeader = req.headers.get("authorization");
		if (
			process.env.CRON_SECRET &&
			authHeader !== `Bearer ${process.env.CRON_SECRET}`
		) {
			return new Response("Unauthorized", { status: 401 });
		}

		const now = new Date();
		const threeDaysFromNow = new Date(now.getTime() + 3 * 24 * 60 * 60 * 1000);
		const twoDaysFromNow = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);

		// 1. Mark past projects as finished
		const expiredProjects = await db.query.projects.findMany({
			where: and(
				lte(projects.dueDate, now),
				eq(projects.status, "in_progress"),
			),
		});

		for (const project of expiredProjects) {
			await db
				.update(projects)
				.set({ status: "finished" })
				.where(eq(projects.id, project.id));
			await notifyProjectMembers(
				project.id,
				"project-finished",
				{ projectName: project.name },
				"system",
			);
		}

		// 2. Notify for projects ending in 3 days
		// We use a window to prevent sending it multiple times if cron runs daily
		const endingProjects = await db.query.projects.findMany({
			where: and(
				gte(projects.dueDate, twoDaysFromNow),
				lte(projects.dueDate, threeDaysFromNow),
				eq(projects.status, "in_progress"),
			),
		});

		for (const project of endingProjects) {
			await notifyProjectMembers(
				project.id,
				"project-ending-soon",
				{ projectName: project.name },
				"system",
			);
		}

		return NextResponse.json({
			success: true,
			expired: expiredProjects.length,
			endingSoon: endingProjects.length,
		});
	} catch (error) {
		console.error("Cron Error:", error);
		return NextResponse.json(
			{ success: false, error: "Internal Server Error" },
			{ status: 500 },
		);
	}
}
