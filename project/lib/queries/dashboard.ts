import { and, eq, isNull, sql } from "drizzle-orm";
import { getAuthenticatedDbUser } from "@/lib/auth/GetUser";
import { db } from "@/lib/db/index";
import {
	projectStatuses,
	projects,
	tasks,
	teamMembers,
	teams,
} from "@/lib/db/schema/index";

export interface DashboardMetricData {
	totalProjects: number;
	pendingProjects: number;
	endedProjects: number;
	completionRate: number;
	topTeams: {
		id: string;
		name: string;
		icon: string | null;
		coverUrl: string | null;
		projectCount: number;
		memberCount: number;
	}[];
	topMembers: {
		id: string;
		name: string;
		email: string;
		avatar: string | null;
		projectCount: number;
		role: string;
	}[];
	recentProjects: {
		id: string;
		name: string;
		description: string | null;
		status: "in_progress" | "finished" | "archived";
		dueDate: Date;
		createdAt: Date;
		teamName: string | null;
		memberCount: number;
		totalTasks: number;
		completedTasks: number;
		progressPercent: number;
	}[];
	statusDistribution: {
		name: string;
		key: string;
		count: number;
		percentage: number;
		color: string;
	}[];
	priorityDistribution: {
		priority: string;
		count: number;
		color: string;
	}[];
	monthlyTrends: {
		month: string;
		createdProjects: number;
		completedProjects: number;
		tasksDone: number;
	}[];
}

export async function getDashboardDataQuery(): Promise<{
	success: boolean;
	data?: DashboardMetricData;
	error?: string;
}> {
	try {
		const dbUser = await getAuthenticatedDbUser();

		// 1. Fetch all non-deleted projects with teams, statuses, tasks, and members
		const allProjects = await db.query.projects.findMany({
			where: isNull(projects.deletedAt),
			with: {
				team: {
					with: {
						members: {
							with: {
								user: true,
							},
						},
					},
				},
				owner: true,
				statuses: {
					where: isNull(projectStatuses.deletedAt),
					with: {
						tasks: {
							where: isNull(tasks.deletedAt),
							with: {
								assignee: true,
							},
						},
					},
				},
			},
			orderBy: (projects, { desc }) => [desc(projects.createdAt)],
		});

		// 2. Filter projects accessible to current user (owner or team member)
		const userProjects = allProjects.filter((p) => {
			return (
				p.ownerId === dbUser.id ||
				p.team?.members?.some((m) => m.userId === dbUser.id)
			);
		});

		const totalProjects = userProjects.length;
		const pendingProjects = userProjects.filter(
			(p) => p.status === "in_progress",
		).length;
		const endedProjects = userProjects.filter(
			(p) => p.status === "finished" || p.status === "archived",
		).length;
		const completionRate =
			totalProjects > 0 ? Math.round((endedProjects / totalProjects) * 100) : 0;

		// 3. Status Distribution
		const inProgressCount = pendingProjects;
		const finishedCount = userProjects.filter(
			(p) => p.status === "finished",
		).length;
		const archivedCount = userProjects.filter(
			(p) => p.status === "archived",
		).length;

		const statusDistribution = [
			{
				name: "In Progress",
				key: "in_progress",
				count: inProgressCount,
				percentage:
					totalProjects > 0
						? Math.round((inProgressCount / totalProjects) * 100)
						: 0,
				color: "#0ea5e9", // Sky / Blue Munsell
			},
			{
				name: "Finished",
				key: "finished",
				count: finishedCount,
				percentage:
					totalProjects > 0
						? Math.round((finishedCount / totalProjects) * 100)
						: 0,
				color: "#10b981", // Emerald
			},
			{
				name: "Archived",
				key: "archived",
				count: archivedCount,
				percentage:
					totalProjects > 0
						? Math.round((archivedCount / totalProjects) * 100)
						: 0,
				color: "#6b7280", // Slate / Gray
			},
		];

		// 4. Top 3 Teams by Project Count
		const teamMap = new Map<
			string,
			{
				id: string;
				name: string;
				icon: string | null;
				coverUrl: string | null;
				projectCount: number;
				memberCount: number;
			}
		>();

		for (const p of userProjects) {
			if (p.team) {
				const existing = teamMap.get(p.team.id);
				if (existing) {
					existing.projectCount += 1;
				} else {
					teamMap.set(p.team.id, {
						id: p.team.id,
						name: p.team.name,
						icon: p.team.icon,
						coverUrl: p.team.coverUrl,
						projectCount: 1,
						memberCount: p.team.members?.length ?? 0,
					});
				}
			}
		}

		// Also check if user has other teams with 0 projects to ensure accuracy
		const userTeams = await db
			.select({
				id: teams.id,
				name: teams.name,
				icon: teams.icon,
				coverUrl: teams.coverUrl,
			})
			.from(teamMembers)
			.innerJoin(teams, eq(teamMembers.teamId, teams.id))
			.where(and(eq(teamMembers.userId, dbUser.id), isNull(teams.deletedAt)));

		for (const t of userTeams) {
			if (!teamMap.has(t.id)) {
				const [{ count }] = await db
					.select({ count: sql<number>`count(*)::int` })
					.from(teamMembers)
					.where(eq(teamMembers.teamId, t.id));

				teamMap.set(t.id, {
					id: t.id,
					name: t.name,
					icon: t.icon,
					coverUrl: t.coverUrl,
					projectCount: 0,
					memberCount: count,
				});
			}
		}

		const topTeams = Array.from(teamMap.values())
			.sort(
				(a, b) =>
					b.projectCount - a.projectCount || b.memberCount - a.memberCount,
			)
			.slice(0, 5);

		// 5. Top 5 Members by Project Count
		const memberMap = new Map<
			string,
			{
				id: string;
				name: string;
				email: string;
				avatar: string | null;
				projectIds: Set<string>;
				role: string;
			}
		>();

		for (const p of userProjects) {
			// Add owner
			if (p.owner) {
				const existing = memberMap.get(p.owner.id);
				if (existing) {
					existing.projectIds.add(p.id);
				} else {
					memberMap.set(p.owner.id, {
						id: p.owner.id,
						name: p.owner.name,
						email: p.owner.email,
						avatar: p.owner.avatar,
						projectIds: new Set([p.id]),
						role: "Owner",
					});
				}
			}

			// Add team members
			if (p.team?.members) {
				for (const tm of p.team.members) {
					if (tm.user) {
						const existing = memberMap.get(tm.user.id);
						if (existing) {
							existing.projectIds.add(p.id);
						} else {
							memberMap.set(tm.user.id, {
								id: tm.user.id,
								name: tm.user.name,
								email: tm.user.email,
								avatar: tm.user.avatar,
								projectIds: new Set([p.id]),
								role: tm.role || "Member",
							});
						}
					}
				}
			}
		}

		const topMembers = Array.from(memberMap.values())
			.map((m) => ({
				id: m.id,
				name: m.name,
				email: m.email,
				avatar: m.avatar,
				projectCount: m.projectIds.size,
				role: m.role,
			}))
			.sort((a, b) => b.projectCount - a.projectCount)
			.slice(0, 5);

		// 6. 5 Recent Projects with calculated progress
		const recentProjects = userProjects.slice(0, 5).map((p) => {
			const allTasks = (p.statuses || []).flatMap((s) => s.tasks || []);
			const totalTasks = allTasks.length;
			const completedTasks = (p.statuses || []).reduce((acc, status) => {
				const isDoneStatus =
					status.name.trim().toLowerCase() === "done" ||
					status.name.trim().toLowerCase() === "closed" ||
					status.name.trim().toLowerCase() === "finished" ||
					status.name.trim().toLowerCase() === "completed";

				if (isDoneStatus) {
					return acc + (status.tasks?.length || 0);
				}
				return acc;
			}, 0);

			let progressPercent = 0;
			if (p.status === "finished") {
				progressPercent = 100;
			} else if (totalTasks > 0) {
				progressPercent = Math.round((completedTasks / totalTasks) * 100);
			}

			return {
				id: p.id,
				name: p.name,
				description: p.description,
				status: p.status,
				dueDate: p.dueDate,
				createdAt: p.createdAt,
				teamName: p.team?.name || null,
				memberCount: p.team?.members?.length ?? 1,
				totalTasks,
				completedTasks,
				progressPercent,
			};
		});

		// 7. Priority Distribution & Task Aggregations
		const priorityCounts: Record<string, number> = {
			urgent: 0,
			high: 0,
			medium: 0,
			low: 0,
		};

		userProjects.forEach((p) => {
			(p.statuses || []).forEach((s) => {
				(s.tasks || []).forEach((t) => {
					if (t.priority && priorityCounts[t.priority] !== undefined) {
						priorityCounts[t.priority]++;
					}
				});
			});
		});

		const priorityDistribution = [
			{ priority: "Urgent", count: priorityCounts.urgent, color: "#ef4444" },
			{ priority: "High", count: priorityCounts.high, color: "#f97316" },
			{ priority: "Medium", count: priorityCounts.medium, color: "#eab308" },
			{ priority: "Low", count: priorityCounts.low, color: "#3b82f6" },
		];

		// 8. 6-Month Timeline Trends
		const now = new Date();
		const monthlyTrends: {
			month: string;
			createdProjects: number;
			completedProjects: number;
			tasksDone: number;
		}[] = [];

		for (let i = 5; i >= 0; i--) {
			const d = new Date(now.getFullYear(), now.getMonth() - i, 1);
			const monthLabel = d.toLocaleString("en-US", { month: "short" });
			const monthStart = new Date(d.getFullYear(), d.getMonth(), 1);
			const monthEnd = new Date(
				d.getFullYear(),
				d.getMonth() + 1,
				0,
				23,
				59,
				59,
			);

			let createdProjectsMonth = 0;
			let completedProjectsMonth = 0;
			let tasksDoneMonth = 0;

			for (const p of userProjects) {
				const created = new Date(p.createdAt);
				const updated = new Date(p.updatedAt);

				if (created >= monthStart && created <= monthEnd) {
					createdProjectsMonth++;
				}
				if (
					p.status === "finished" &&
					updated >= monthStart &&
					updated <= monthEnd
				) {
					completedProjectsMonth++;
				}

				for (const s of p.statuses || []) {
					const isDone =
						s.name.trim().toLowerCase() === "done" ||
						s.name.trim().toLowerCase() === "closed" ||
						s.name.trim().toLowerCase() === "finished" ||
						s.name.trim().toLowerCase() === "completed";

					if (isDone) {
						for (const t of s.tasks || []) {
							const taskUpdated = new Date(t.updatedAt);
							if (taskUpdated >= monthStart && taskUpdated <= monthEnd) {
								tasksDoneMonth++;
							}
						}
					}
				}
			}

			monthlyTrends.push({
				month: monthLabel,
				createdProjects: createdProjectsMonth,
				completedProjects: completedProjectsMonth,
				tasksDone: tasksDoneMonth,
			});
		}

		return {
			success: true,
			data: {
				totalProjects,
				pendingProjects,
				endedProjects,
				completionRate,
				topTeams,
				topMembers,
				recentProjects,
				statusDistribution,
				priorityDistribution,
				monthlyTrends,
			},
		};
	} catch (err: unknown) {
		console.error("getDashboardDataQuery Error:", err);
		return {
			success: false,
			error:
				err instanceof Error
					? err.message
					: "Failed to fetch dashboard metrics.",
		};
	}
}
