import { pgEnum } from "drizzle-orm/pg-core";

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
    "expired",
]);