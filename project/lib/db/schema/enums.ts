import { pgEnum } from "drizzle-orm/pg-core";

export const roleEnum = pgEnum("role", ["administrator", "member", "viewer"]);

export const invitationStatusEnum = pgEnum("invitation_status", [
	"pending",
	"accepted",
	"expired",
]);

export const sizeEnum = pgEnum("size", ["XS", "S", "M", "L", "XL"]);

export const priorityEnum = pgEnum("priority", [
	"low",
	"medium",
	"high",
	"urgent",
]);

export const projectStatusEnum = pgEnum("project_status", [
	"in_progress",
	"finished",
	"archived",
]);
