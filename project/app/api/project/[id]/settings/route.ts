import { and, eq, inArray, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth/GetUser";
import { db } from "@/lib/db/index";
import {
	labels,
	projectStatuses,
	projects,
	teamMembers,
} from "@/lib/db/schema/index";
import { notifyProjectMembers } from "@/lib/notifications/NotifyProject";
import { projectSettingsSchema } from "@/lib/validation/Validations";

// PATCH /api/project/[id]/settings
export async function PATCH(
	req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const data = await req.json();

		const validationResult = projectSettingsSchema.safeParse(data);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					success: false,
					error:
						validationResult.error.issues[0]?.message ||
						"Invalid project settings data",
				},
				{ status: 400 },
			);
		}

		const dbUser = await getAuthenticatedDbUser();

		const projectData = await db.query.projects.findFirst({
			where: and(eq(projects.id, id), isNull(projects.deletedAt)),
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

		const isOwner = projectData.ownerId === dbUser.id;
		const teamPermission = projectData.team?.members?.[0]?.permission;

		if (!isOwner && teamPermission !== "administrator") {
			return NextResponse.json(
				{
					success: false,
					error:
						"Only project owners and team administrators can update settings.",
				},
				{ status: 403 },
			);
		}

		// Only administrator can archive
		if (
			data.status === "archived" &&
			!isOwner &&
			teamPermission !== "administrator"
		) {
			return NextResponse.json(
				{
					success: false,
					error:
						"Only project owners and team administrators can archive a project.",
				},
				{ status: 403 },
			);
		}

		await db
			.update(projects)
			.set({
				name: data.name,
				description: data.description,
				teamId: data.teamId,
				...(data.status !== undefined && { status: data.status }),
				...(data.dueDate !== undefined && { dueDate: new Date(data.dueDate) }),
			})
			.where(and(eq(projects.id, id), isNull(projects.deletedAt)));

		// Sync statuses
		if (data.statuses) {
			const existingStatuses = await db.query.projectStatuses.findMany({
				where: eq(projectStatuses.projectId, id),
			});
			const existingIds = new Set(existingStatuses.map((s) => s.id));
			const incomingIds = new Set(
				data.statuses.map((s: { id?: string }) => s.id).filter(Boolean),
			);

			const toDelete = [...existingIds].filter((eid) => !incomingIds.has(eid));
			if (toDelete.length > 0) {
				await db
					.delete(projectStatuses)
					.where(inArray(projectStatuses.id, toDelete));
			}

			for (let i = 0; i < data.statuses.length; i++) {
				const s = data.statuses[i];
				if (s.id && existingIds.has(s.id)) {
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

		// Sync labels
		if (data.labels) {
			const existingLabels = await db.query.labels.findMany({
				where: eq(labels.projectId, id),
			});
			const incomingNames = new Set(
				data.labels.map((l: { name: string }) => l.name).filter(Boolean),
			);

			const toDelete = existingLabels
				.filter((l) => !incomingNames.has(l.name))
				.map((l) => l.id);
			if (toDelete.length > 0) {
				await db.delete(labels).where(inArray(labels.id, toDelete));
			}

			for (const l of data.labels) {
				const existing = existingLabels.find((el) => el.name === l.name);
				if (existing) {
					if (existing.color !== l.color) {
						await db
							.update(labels)
							.set({ color: l.color })
							.where(eq(labels.id, existing.id));
					}
				} else {
					await db.insert(labels).values({
						projectId: id,
						name: l.name,
						color: l.color,
					});
				}
			}
		}

		// Determine if this is an archive or restore action for a better notification message
		const oldStatus = projectData.status;
		const newStatus = data.status;
		let eventName = "project-edited";
		if (newStatus === "archived" && oldStatus !== "archived") {
			eventName = "project-archived";
		} else if (
			oldStatus === "archived" &&
			newStatus &&
			newStatus !== "archived"
		) {
			eventName = "project-restored";
		}

		await notifyProjectMembers(
			id,
			eventName,
			{
				projectName: data.name,
				editorName: dbUser.name || "Someone",
				projectId: id,
			},
			dbUser.clerkId,
		);

		revalidatePath("/projects");
		revalidatePath(`/projects/${id}`);
		revalidatePath(`/projects/${id}/project-settings`);

		return NextResponse.json({ success: true });
	} catch (err: unknown) {
		console.error("PATCH /api/project/[id]/settings Error:", err);
		return NextResponse.json(
			{
				success: false,
				error:
					err instanceof Error
						? err.message
						: "Failed to update project settings.",
			},
			{ status: 500 },
		);
	}
}

// GET /api/project/[id]/settings
export async function GET(
	_req: Request,
	{ params }: { params: Promise<{ id: string }> },
) {
	try {
		const { id } = await params;
		const { getProjectSettingsQuery } = await import("@/lib/queries/project");
		const result = await getProjectSettingsQuery(id);
		return NextResponse.json(result);
	} catch (err: unknown) {
		console.error("GET /api/project/[id]/settings Error:", err);
		return NextResponse.json(
			{
				success: false,
				error:
					err instanceof Error
						? err.message
						: "Failed to fetch project settings.",
			},
			{ status: 500 },
		);
	}
}
