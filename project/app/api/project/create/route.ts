import { and, eq, isNull } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { NextResponse } from "next/server";
import { getAuthenticatedDbUser } from "@/lib/auth/GetUser";
import { db } from "@/lib/db/index";
import { labels, projectStatuses, projects } from "@/lib/db/schema/index";
import { notifyProjectMembers } from "@/lib/notifications/NotifyProject";
import { projectSchema } from "@/lib/validation/Validations";

export async function POST(req: Request) {
	try {
		const data = await req.json();

		const validationResult = projectSchema.safeParse(data);
		if (!validationResult.success) {
			return NextResponse.json(
				{
					success: false,
					error:
						validationResult.error.issues[0]?.message || "Invalid project data",
				},
				{ status: 400 },
			);
		}

		const dbUser = await getAuthenticatedDbUser();

		const existingProject = await db.query.projects.findFirst({
			where: and(
				eq(projects.name, data.name),
				eq(projects.ownerId, dbUser.id),
				isNull(projects.deletedAt),
			),
		});

		if (existingProject) {
			return NextResponse.json(
				{ success: false, error: "A project with this name already exists." },
				{ status: 409 },
			);
		}

		const newProject = await db
			.insert(projects)
			.values({
				name: data.name,
				description: data.description,
				ownerId: dbUser.id,
				teamId: data.teamId,
				dueDate: new Date(data.dueDate),
				views: [
					"Dashboard",
					"List",
					"Board",
					"Calendar",
					"Whiteboard",
					"Gantt Chart",
					"Timeline",
					"Burndown Chart",
				],
			})
			.returning();

		const userStatuses = data.statuses || {
			notStarted: ["To Do"],
			active: ["In Progress"],
			done: ["Done"],
			closed: [],
		};

		const finalStatuses: Array<{
			name: string;
			description: string;
			color: string;
		}> = [];

		userStatuses.notStarted?.forEach((name: string) => {
			finalStatuses.push({
				name,
				description: "Task is not started",
				color:
					"bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800",
			});
		});
		userStatuses.active?.forEach((name: string) => {
			finalStatuses.push({
				name,
				description: "Task is in progress",
				color:
					"bg-blue-100 text-blue-700 border-blue-200 dark:bg-blue-900 dark:text-blue-300 dark:border-blue-800",
			});
		});
		userStatuses.done?.forEach((name: string) => {
			finalStatuses.push({
				name,
				description: "Task is completed",
				color:
					"bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900 dark:text-emerald-300 dark:border-emerald-800",
			});
		});
		userStatuses.closed?.forEach((name: string) => {
			finalStatuses.push({
				name,
				description: "Task is closed",
				color:
					"bg-rose-100 text-rose-700 border-rose-200 dark:bg-rose-900 dark:text-rose-300 dark:border-rose-800",
			});
		});

		if (finalStatuses.length > 0) {
			await db.insert(projectStatuses).values(
				finalStatuses.map((s, index) => ({
					...s,
					projectId: newProject[0].id,
					position: index,
				})),
			);
		}

		const defaultLabels = [
			{
				name: "Bug",
				color:
					"bg-rose-500/15 text-rose-600 dark:text-rose-400 border-rose-500/30",
			},
			{
				name: "Frontend",
				color:
					"bg-blue-500/15 text-blue-600 dark:text-blue-400 border-blue-500/30",
			},
			{
				name: "Testing",
				color:
					"bg-amber-500/15 text-amber-600 dark:text-amber-400 border-amber-500/30",
			},
			{
				name: "Backend",
				color:
					"bg-purple-500/15 text-purple-600 dark:text-purple-400 border-purple-500/30",
			},
			{
				name: "Documentation",
				color:
					"bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border-emerald-500/30",
			},
			{
				name: "Feature",
				color:
					"bg-cyan-500/15 text-cyan-600 dark:text-cyan-400 border-cyan-500/30",
			},
		];

		await db
			.insert(labels)
			.values(
				defaultLabels.map((l) => ({ ...l, projectId: newProject[0].id })),
			);

		if (newProject[0]) {
			await notifyProjectMembers(
				newProject[0].id,
				"project-added",
				{
					projectName: data.name,
					creatorName: dbUser.name || "Someone",
					projectId: newProject[0].id,
				},
				dbUser.clerkId,
			);
		}

		revalidatePath("/projects");
		return NextResponse.json({ success: true, data: newProject[0] });
	} catch (err: unknown) {
		console.error("POST /api/project/create Error:", err);
		return NextResponse.json(
			{
				success: false,
				error: err instanceof Error ? err.message : "Failed to create project.",
			},
			{ status: 500 },
		);
	}
}
