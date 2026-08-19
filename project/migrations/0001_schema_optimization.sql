-- Migration: Schema Optimization
-- - Rename project_labels → labels
-- - Drop project_members table (redundant with team_members)
-- - Replace projects.is_deleted (boolean) → projects.deleted_at (timestamp)
-- - Add deleted_at to: project_statuses, comments, tasks, team_members
-- - Add deleted_at to: labels (renamed from project_labels)

-- Step 1: Rename project_labels → labels
ALTER TABLE "project_labels" RENAME TO "labels";--> statement-breakpoint

-- Update the foreign key on task_labels to reference the renamed table
ALTER TABLE "task_labels" DROP CONSTRAINT "task_labels_label_id_project_labels_id_fk";--> statement-breakpoint
ALTER TABLE "task_labels" ADD CONSTRAINT "task_labels_label_id_labels_id_fk" FOREIGN KEY ("label_id") REFERENCES "public"."labels"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint

-- Rename the index
DROP INDEX "project_labels_project_id_idx";--> statement-breakpoint
CREATE INDEX "labels_project_id_idx" ON "labels" USING btree ("project_id");--> statement-breakpoint

-- Rename the FK constraint on labels
ALTER TABLE "labels" DROP CONSTRAINT "project_labels_project_id_projects_id_fk";--> statement-breakpoint
ALTER TABLE "labels" ADD CONSTRAINT "labels_project_id_projects_id_fk" FOREIGN KEY ("project_id") REFERENCES "public"."projects"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint

-- Step 2: Drop project_members table
DROP INDEX "project_members_project_id_idx";--> statement-breakpoint
DROP INDEX "project_members_user_id_idx";--> statement-breakpoint
DROP INDEX "project_members_project_user_unique";--> statement-breakpoint
DROP TABLE "project_members";--> statement-breakpoint

-- Step 3: Replace projects.is_deleted with projects.deleted_at
ALTER TABLE "projects" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
UPDATE "projects" SET "deleted_at" = NOW() WHERE "is_deleted" = true;--> statement-breakpoint
ALTER TABLE "projects" DROP COLUMN "is_deleted";--> statement-breakpoint

-- Step 4: Add deleted_at to tables missing soft delete
ALTER TABLE "labels" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "project_statuses" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "tasks" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "comments" ADD COLUMN "deleted_at" timestamp;--> statement-breakpoint
ALTER TABLE "team_members" ADD COLUMN "deleted_at" timestamp;
