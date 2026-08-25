import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth/GetUser";
import { db } from "@/lib/db/index";
import { projects, teamMembers } from "@/lib/db/schema/index";
import { notifyProjectMembers } from "@/lib/notifications/NotifyProject";

// DELETE /api/project/[id]
export async function DELETE(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const dbUser = await getAuthenticatedDbUser();

		const projectToDelete = await db.query.projects.findFirst({
			where: eq(projects.id, id),
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

		if (!projectToDelete) {
			return NextResponse.json(
				{ success: false, error: "Project not found" },
				{ status: 404 },
			);
		}

		const isOwner = projectToDelete.ownerId === dbUser.id;
		const teamPermission = projectToDelete.team?.members?.[0]?.permission;

		if (!isOwner && teamPermission !== "administrator") {
			return NextResponse.json(
				{
					success: false,
					error:
						"Only project owners and team administrators can delete this project.",
				},
				{ status: 403 },
			);
		}

		await db
			.update(projects)
			.set({ deletedAt: new Date() })
			.where(eq(projects.id, id));

		revalidatePath("/projects");

		await notifyProjectMembers(
			id,
			"project-deleted",
			{
				projectName: projectToDelete.name,
				deleterName: dbUser.name || "Someone",
			},
			dbUser.clerkId,
		);

		return NextResponse.json({ success: true });
	} catch (err: unknown) {
		console.error("DELETE /api/project/[id] Error:", err);
		return NextResponse.json(
			{
				success: false,
				error: err instanceof Error ? err.message : "Failed to delete project.",
			},
			{ status: 500 },
		);
	}
}

// GET /api/project/[id]
export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const { getProjectDetailQuery } = await import("@/lib/queries/project");
		const result = await getProjectDetailQuery(id);
		return NextResponse.json(result);
	} catch (err: unknown) {
		console.error("GET /api/project/[id] Error:", err);
		return NextResponse.json(
			{
				success: false,
				error:
					err instanceof Error
						? err.message
						: "Failed to fetch project detail.",
			},
			{ status: 500 },
		);
	}
}
