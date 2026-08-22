import { z } from "zod";

export const projectSchema = z.object({
	name: z
		.string()
		.min(1, "Project name is required")
		.max(50, "Project name is too long"),
	description: z.string().max(500, "Description is too long").optional(),
	teamId: z.string().min(1, "Team ID is required"),
	dueDate: z.string().refine((val) => !Number.isNaN(Date.parse(val)), {
		message: "Invalid due date",
	}),
	views: z
		.array(z.string())
		.default([
			"Dashboard",
			"List",
			"Board",
			"Calendar",
			"Whiteboard",
			"Gantt Chart",
			"Timeline",
		]),
	statuses: z
		.object({
			notStarted: z.array(z.string()).optional(),
			active: z.array(z.string()).optional(),
			done: z.array(z.string()).optional(),
			closed: z.array(z.string()).optional(),
		})
		.optional(),
});

export const labelSchema = z.object({
	name: z
		.string()
		.min(1, "Label name is required")
		.max(20, "Label name is too long"),
	color: z.string().optional(),
});

export const projectSettingsSchema = z.object({
	name: z
		.string()
		.min(1, "Project name is required")
		.max(50, "Project name is too long"),
	description: z
		.string()
		.max(500, "Description is too long")
		.optional()
		.default(""),
	teamId: z.string().min(1, "Team ID is required"),
	labels: z.array(labelSchema).optional(),
	statuses: z
		.array(
			z.object({
				id: z.string().optional(),
				name: z
					.string()
					.min(1, "Status name is required")
					.max(20, "Status name is too long"),
				description: z.string().default(""),
				color: z.string().default(""),
			}),
		)
		.optional(),
});

export const taskSchema = z.object({
	title: z
		.string()
		.min(1, "Task title is required")
		.max(200, "Title is too long"),
	description: z.string().max(5000, "Description is too long").optional(),
	priority: z
		.enum(["low", "medium", "high", "urgent"])
		.optional()
		.default("low"),
	dueDate: z.string().optional().nullable(),
	assigneeId: z.string().optional().nullable(),
	projectId: z.string().min(1, "Project ID is required"),
	statusId: z.string().min(1, "Status ID is required"),
});

export const userSchema = z.object({
	name: z.string().min(1, "Name is required").max(100, "Name is too long"),
	email: z.string().email("Invalid email address"),
	bio: z.string().max(500, "Bio is too long").optional(),
});

export const listSchema = z.object({
	name: z
		.string()
		.min(1, "List name is required")
		.max(100, "List name is too long"),
	projectId: z.string().min(1, "Project ID is required"),
});

export const commentSchema = z.object({
	text: z
		.string()
		.min(1, "Comment text is required")
		.max(2000, "Comment is too long"),
	taskId: z.string().min(1, "Task ID is required"),
});

export const invitationSchema = z.object({
	email: z.string().email("Invalid email address"),
	notes: z
		.string()
		.refine((val) => !/\s{2,}/.test(val), {
			message: "Note cannot contain 2 consecutive white spaces.",
		})
		.optional(),
});

export const teamSchema = z.object({
	name: z
		.string()
		.min(1, "Team name is required")
		.max(50, "Team name is too long"),
	icon: z.string().optional(),
});

export const createTeamSchema = z.object({
	name: z
		.string()
		.min(1, "Team name is required")
		.max(100, "Team name is too long"),
	icon: z.string().optional(),
	coverUrl: z.string().optional(),
	members: z
		.array(
			z.object({
				userId: z.string(),
				role: z.string(),
				permission: z.enum(["administrator", "member", "viewer"]),
			}),
		)
		.optional()
		.default([]),
});

export const teamMemberSchema = z.object({
	teamId: z.string().min(1, "Team ID is required"),
	userId: z.string().optional(),
	email: z.string().email("Invalid email address").optional(),
	role: z.string().optional(),
	permission: z.enum(["administrator", "member", "viewer"]).optional(),
});
