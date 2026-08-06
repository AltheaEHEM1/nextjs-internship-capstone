import { relations } from "drizzle-orm";
import {
	index,
	integer,
	pgEnum,
	pgTable,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";

// ----------------------------------------------------
// 1. Enums
// ----------------------------------------------------
export const priorityEnum = pgEnum("priority", [
	"low",
	"medium",
	"high",
	"urgent",
]);
export const roleEnum = pgEnum("role", ["administrator", "member", "viewer"]);
export const invitationStatusEnum = pgEnum("invitation_status", [
	"pending",
	"accepted",
	"rejected",
	"expired",
]);

// ----------------------------------------------------
// 2. Tables
// ----------------------------------------------------

// Users Table
export const users = pgTable(
	"users",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		clerkId: text("clerk_id").notNull().unique(),
		email: text("email").notNull().unique(),
		name: text("name").notNull(),
		avatar: text("avatar"),
		createdAt: timestamp("created_at").defaultNow().notNull(),
		updatedAt: timestamp("updated_at")
			.defaultNow()
			.$onUpdate(() => new Date())
			.notNull(),
	},
	(table) => ({
		clerkIdx: index("users_clerk_id_idx").on(table.clerkId),
	}),
);

// Teams Table
export const teams = pgTable("teams", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	icon: text("icon").default("🚀"),
	coverUrl: text("cover_url"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

// Team Members Table
export const teamMembers = pgTable(
	"team_members",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		teamId: uuid("team_id")
			.references(() => teams.id, { onDelete: "cascade" })
			.notNull(),
		userId: uuid("user_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		role: text("role").default("Member"),
		permission: roleEnum("permission").default("member").notNull(),
		joinedAt: timestamp("joined_at").defaultNow().notNull(),
	},
	(table) => ({
		teamIdx: index("team_members_team_id_idx").on(table.teamId),
		userIdx: index("team_members_user_id_idx").on(table.userId),
	}),
);

// Invitations Table
export const invitations = pgTable("invitations", {
	id: uuid("id").defaultRandom().primaryKey(),
	email: text("email").notNull(),
	teamId: uuid("team_id").references(() => teams.id, { onDelete: "cascade" }), // Optional now
	invitedById: uuid("invited_by_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	token: text("token").notNull().unique(),
	role: text("role").default("Member"),
	permission: roleEnum("permission").default("member").notNull(),
	status: invitationStatusEnum("status").default("pending").notNull(),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("default_now").defaultNow().notNull(),
});

// Projects Table
export const projects = pgTable(
	"projects",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		name: text("name").notNull(),
		description: text("description"),
		ownerId: uuid("owner_id")
			.references(() => users.id, { onDelete: "cascade" })
			.notNull(),
		teamId: uuid("team_id").references(() => teams.id, { onDelete: "cascade" }),
		dueDate: timestamp("due_date"),
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

// Lists Table
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

// Tasks Table
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

// Comments Table
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

// ----------------------------------------------------
// 3. Relations (Declared AFTER tables)
// ----------------------------------------------------

export const usersRelations = relations(users, ({ many }) => ({
	projects: many(projects),
	assignedTasks: many(tasks),
	comments: many(comments),
	teamMemberships: many(teamMembers),
}));

export const teamsRelations = relations(teams, ({ many }) => ({
	members: many(teamMembers),
	invitations: many(invitations),
	projects: many(projects),
}));

export const teamMembersRelations = relations(teamMembers, ({ one }) => ({
	team: one(teams, {
		fields: [teamMembers.teamId],
		references: [teams.id],
	}),
	user: one(users, {
		fields: [teamMembers.userId],
		references: [users.id],
	}),
}));

export const invitationsRelations = relations(invitations, ({ one }) => ({
	team: one(teams, {
		fields: [invitations.teamId],
		references: [teams.id],
	}),
	invitedBy: one(users, {
		fields: [invitations.invitedById],
		references: [users.id],
	}),
}));

export const projectsRelations = relations(projects, ({ one, many }) => ({
	owner: one(users, { fields: [projects.ownerId], references: [users.id] }),
	team: one(teams, { fields: [projects.teamId], references: [teams.id] }),
	lists: many(lists),
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
