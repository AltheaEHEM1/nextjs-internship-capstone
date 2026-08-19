import { relations } from "drizzle-orm";
import { index, pgTable, text, timestamp, uuid } from "drizzle-orm/pg-core";
import {
	comments,
	projects,
	tasks,
	teamMembers,
} from "./index";

export const users = pgTable(
	"users",
	{
		id: uuid("id").defaultRandom().primaryKey(),
		clerkId: text("clerk_id").notNull().unique(),
		email: text("email").notNull(),
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

export const usersRelations = relations(users, ({ many }) => ({
	projects: many(projects),
	assignedTasks: many(tasks),
	comments: many(comments),
	teamMemberships: many(teamMembers),
}));
