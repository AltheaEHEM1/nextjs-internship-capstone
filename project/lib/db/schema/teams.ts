import { relations } from "drizzle-orm";
import {
	index,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import { roleEnum } from "./Enums";
import { projects, users } from "./index";

export const teams = pgTable("teams", {
	id: uuid("id").defaultRandom().primaryKey(),
	name: text("name").notNull(),
	icon: text("icon").default("🚀"),
	coverUrl: text("cover_url"),
	deletedAt: timestamp("deleted_at"),
	createdAt: timestamp("created_at").defaultNow().notNull(),
	updatedAt: timestamp("updated_at")
		.defaultNow()
		.$onUpdate(() => new Date())
		.notNull(),
});

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
		deletedAt: timestamp("deleted_at"),
	},
	(table) => ({
		teamIdx: index("team_members_team_id_idx").on(table.teamId),
		userIdx: index("team_members_user_id_idx").on(table.userId),
		teamUserUnique: uniqueIndex("team_members_team_user_unique").on(
			table.teamId,
			table.userId,
		),
	}),
);

export const invitations = pgTable("invitations", {
	id: uuid("id").defaultRandom().primaryKey(),
	email: text("email").notNull(),
	notes: text("notes"),
	invitedById: uuid("invited_by_id")
		.references(() => users.id, { onDelete: "cascade" })
		.notNull(),
	token: text("token").notNull().unique(),
	status: text("status", {
		enum: ["pending", "accepted", "expired", "declined"],
	})
		.notNull()
		.default("pending"),
	expiresAt: timestamp("expires_at").notNull(),
	createdAt: timestamp("created_at").defaultNow().notNull(),
});

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
	invitedBy: one(users, {
		fields: [invitations.invitedById],
		references: [users.id],
	}),
}));
