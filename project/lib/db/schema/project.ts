import { relations } from "drizzle-orm";
import {
	index,
	integer,
	jsonb,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { priorityEnum, sizeEnum } from "./enums";
import { teams, users } from "./index";

export const projects = pgTable(
	"projects",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		name: text("name").notNull().unique(),
		description: text("description"),
		ownerId: uuid("owner_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		teamId: uuid("team_id")
			.references(() => teams.id, { onDelete: "cascade" })
			.notNull(),
		dueDate: timestamp("due_date").notNull(),
		views: jsonb("views")
			.default([
				"Dashboard",
				"List",
				"Board",
				"Calendar",
				"Whiteboard",
				"Gantt Chart",
				"Timeline",
				"Burndown Chart",
			])
			.notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
		deletedAt: timestamp("deleted_at"),
	},
	(table) => ({
		ownerIdx: index("projects_owner_id_idx").on(table.ownerId),
		teamIdx: index("projects_team_id_idx").on(table.teamId),
	}),
);

export const projectStatuses = pgTable(
	"project_statuses",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		name: text("name").notNull(),
		description: text("description").default(""),
		color: text("color").default(
			"bg-slate-100 text-slate-700 border-slate-200 dark:bg-slate-900 dark:text-slate-300 dark:border-slate-800",
		),
		projectId: uuid("project_id")
			.references(() => projects.id, { onDelete: "cascade" })
			.notNull(),
		position: integer("position").default(0).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
		deletedAt: timestamp("deleted_at"),
	},
	(table) => ({
		projectIdx: index("project_statuses_project_id_idx").on(table.projectId),
	}),
);

export const labels = pgTable(
	"labels",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		name: text("name").notNull(),
		color: text("color").notNull(),
		projectId: uuid("project_id")
			.references(() => projects.id, { onDelete: "cascade" })
			.notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
		deletedAt: timestamp("deleted_at"),
	},
	(table) => ({
		projectIdx: index("labels_project_id_idx").on(table.projectId),
	}),
);

export const tasks = pgTable(
	"tasks",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		title: text("title").notNull(),
		description: text("description"),
		statusId: uuid("status_id")
			.references(() => projectStatuses.id, { onDelete: "cascade" })
			.notNull(),
		assigneeId: uuid("assignee_id").references(() => users.id, {
			onDelete: "set null",
		}),
		priority: priorityEnum("priority").default("medium").notNull(),
		size: sizeEnum("size").default("M").notNull(),
		position: integer("position").default(0).notNull(),
		dueDate: timestamp("due_date"),
		reporterId: uuid("reporter_id").references(() => users.id, {
			onDelete: "set null",
		}),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
		deletedAt: timestamp("deleted_at"),
	},
	(table) => ({
		statusIdx: index("tasks_status_id_idx").on(table.statusId),
		assigneeIdx: index("tasks_assignee_id_idx").on(table.assigneeId),
	}),
);

export const taskLabels = pgTable(
	"task_labels",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		taskId: uuid("task_id")
			.references(() => tasks.id, { onDelete: "cascade" })
			.notNull(),
		labelId: uuid("label_id")
			.references(() => labels.id, { onDelete: "cascade" })
			.notNull(),
	},
	(table) => ({
		taskIdx: index("task_labels_task_id_idx").on(table.taskId),
		labelIdx: index("task_labels_label_id_idx").on(table.labelId),
		taskLabelUnique: uniqueIndex("task_labels_task_label_unique").on(
			table.taskId,
			table.labelId,
		),
	}),
);

export const comments = pgTable(
	"comments",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		content: text("content").notNull(),
		taskId: uuid("task_id")
			.references(() => tasks.id, { onDelete: "cascade" })
			.notNull(),
		authorId: uuid("author_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
		deletedAt: timestamp("deleted_at"),
	},
	(table) => ({
		taskIdx: index("comments_task_id_idx").on(table.taskId),
	}),
);

export const taskHistory = pgTable(
	"task_history",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		action: text("action").notNull(),
		taskId: uuid("task_id")
			.references(() => tasks.id, { onDelete: "cascade" })
			.notNull(),
		authorId: uuid("author_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
	},
	(table) => ({
		taskIdx: index("task_history_task_id_idx").on(table.taskId),
	}),
);

// ─── Relations ────────────────────────────────────────────────────────────────

export const projectsRelations = relations(projects, ({ one, many }) => ({
	owner: one(users, { fields: [projects.ownerId], references: [users.id] }),
	team: one(teams, { fields: [projects.teamId], references: [teams.id] }),
	statuses: many(projectStatuses),
	labels: many(labels),
}));

export const projectStatusesRelations = relations(
	projectStatuses,
	({ one, many }) => ({
		project: one(projects, {
			fields: [projectStatuses.projectId],
			references: [projects.id],
		}),
		tasks: many(tasks),
	}),
);

export const labelsRelations = relations(labels, ({ one, many }) => ({
	project: one(projects, {
		fields: [labels.projectId],
		references: [projects.id],
	}),
	taskLabels: many(taskLabels),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
	status: one(projectStatuses, {
		fields: [tasks.statusId],
		references: [projectStatuses.id],
	}),
	assignee: one(users, { fields: [tasks.assigneeId], references: [users.id] }),
	reporter: one(users, { fields: [tasks.reporterId], references: [users.id] }),
	comments: many(comments),
	taskLabels: many(taskLabels),
	activities: many(taskHistory),
}));

export const taskLabelsRelations = relations(taskLabels, ({ one }) => ({
	task: one(tasks, { fields: [taskLabels.taskId], references: [tasks.id] }),
	label: one(labels, {
		fields: [taskLabels.labelId],
		references: [labels.id],
	}),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
	task: one(tasks, { fields: [comments.taskId], references: [tasks.id] }),
	author: one(users, { fields: [comments.authorId], references: [users.id] }),
}));

export const taskHistoryRelations = relations(taskHistory, ({ one }) => ({
	task: one(tasks, {
		fields: [taskHistory.taskId],
		references: [tasks.id],
	}),
	author: one(users, {
		fields: [taskHistory.authorId],
		references: [users.id],
	}),
}));
