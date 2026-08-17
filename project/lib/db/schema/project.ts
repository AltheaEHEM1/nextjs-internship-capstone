import { relations } from "drizzle-orm";
import {
	index,
	integer,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
	jsonb,
} from "drizzle-orm/pg-core";
import { priorityEnum, roleEnum } from "./enums";
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
			.default(["List", "Board", "Gantt Chart"])
			.notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => ({
		ownerIdx: index("projects_owner_id_idx").on(table.ownerId),
		teamIdx: index("projects_team_id_idx").on(table.teamId),
	}),
);

export const projectMembers = pgTable(
	"project_members",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		projectId: uuid("project_id")
			.references(() => projects.id, { onDelete: "cascade" })
			.notNull(),
		userId: uuid("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		role: text("role").default("Member"),
		permission: roleEnum("permission").default("member").notNull(),
		joinedAt: timestamp("joined_at").defaultNow().notNull(),
	},
	(table) => ({
		projectIdx: index("project_members_project_id_idx").on(table.projectId),
		userIdx: index("project_members_user_id_idx").on(table.userId),
		projectUserUnique: uniqueIndex("project_members_project_user_unique").on(
			table.projectId,
			table.userId,
		),
	}),
);

export const lists = pgTable(
	"lists",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		name: text("name").notNull(),
		projectId: uuid("project_id")
			.references(() => projects.id, { onDelete: "cascade" })
			.notNull(),
		position: integer("position").default(0).notNull(),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => ({
		projectIdx: index("lists_project_id_idx").on(table.projectId),
	}),
);

export const tasks = pgTable(
	"tasks",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		title: text("title").notNull(),
		description: text("description"),
		listId: uuid("list_id")
			.references(() => lists.id, { onDelete: "cascade" })
			.notNull(),
		assigneeId: uuid("assignee_id").references(() => users.id, {
			onDelete: "set null",
		}),
		priority: priorityEnum("priority").default("medium").notNull(),
		position: integer("position").default(0).notNull(),
		dueDate: timestamp("due_date"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => ({
		listIdx: index("tasks_list_id_idx").on(table.listId),
		assigneeIdx: index("tasks_assignee_id_idx").on(table.assigneeId),
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
	},
	(table) => ({
		taskIdx: index("comments_task_id_idx").on(table.taskId),
	}),
);

export const projectsRelations = relations(projects, ({ one, many }) => ({
	owner: one(users, { fields: [projects.ownerId], references: [users.id] }),
	team: one(teams, { fields: [projects.teamId], references: [teams.id] }),
	lists: many(lists),
	members: many(projectMembers),
}));

export const projectMembersRelations = relations(projectMembers, ({ one }) => ({
	project: one(projects, {
		fields: [projectMembers.projectId],
		references: [projects.id],
	}),
	user: one(users, {
		fields: [projectMembers.userId],
		references: [users.id],
	}),
}));

export const listsRelations = relations(lists, ({ one, many }) => ({
	project: one(projects, {
		fields: [lists.projectId],
		references: [projects.id],
	}),
	tasks: many(tasks),
}));

export const tasksRelations = relations(tasks, ({ one, many }) => ({
	list: one(lists, { fields: [tasks.listId], references: [lists.id] }),
	assignee: one(users, { fields: [tasks.assigneeId], references: [users.id] }),
	comments: many(comments),
}));

export const commentsRelations = relations(comments, ({ one }) => ({
	task: one(tasks, { fields: [comments.taskId], references: [tasks.id] }),
	author: one(users, { fields: [comments.authorId], references: [users.id] }),
}));
