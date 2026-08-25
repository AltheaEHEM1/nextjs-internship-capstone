-- Migration: Rename task_activities to task_history

-- Step 1: Rename table
ALTER TABLE "task_activities" RENAME TO "task_history";--> statement-breakpoint

-- Rename the index
DROP INDEX IF EXISTS "task_activities_task_id_idx";--> statement-breakpoint
CREATE INDEX "task_history_task_id_idx" ON "task_history" USING btree ("task_id");--> statement-breakpoint

-- Rename constraints
ALTER TABLE "task_history" DROP CONSTRAINT IF EXISTS "task_activities_task_id_tasks_id_fk";--> statement-breakpoint
ALTER TABLE "task_history" ADD CONSTRAINT "task_history_task_id_tasks_id_fk" FOREIGN KEY ("task_id") REFERENCES "public"."tasks"("id") ON DELETE cascade ON UPDATE no action;--> statement-breakpoint

ALTER TABLE "task_history" DROP CONSTRAINT IF EXISTS "task_activities_author_id_users_id_fk";--> statement-breakpoint
ALTER TABLE "task_history" ADD CONSTRAINT "task_history_author_id_users_id_fk" FOREIGN KEY ("author_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE no action;
