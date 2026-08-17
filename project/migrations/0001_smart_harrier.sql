ALTER TABLE "invitations" DROP CONSTRAINT "invitations_team_id_teams_id_fk";
--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "team_id" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ALTER COLUMN "due_date" SET NOT NULL;--> statement-breakpoint
ALTER TABLE "projects" ADD COLUMN "views" jsonb DEFAULT '["List","Board"]'::jsonb NOT NULL;--> statement-breakpoint
ALTER TABLE "invitations" DROP COLUMN "team_id";--> statement-breakpoint
ALTER TABLE "projects" ADD CONSTRAINT "projects_name_unique" UNIQUE("name");