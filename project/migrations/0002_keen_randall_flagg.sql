ALTER TABLE "projects" ALTER COLUMN "views" SET DEFAULT '["List","Board","Gantt Chart"]'::jsonb;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "labels" jsonb DEFAULT '[]'::jsonb NOT NULL;