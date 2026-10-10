ALTER TYPE "render_role" ADD VALUE 'bullet';--> statement-breakpoint
ALTER TABLE "sections" ADD COLUMN "is_header" boolean;--> statement-breakpoint
ALTER TABLE "field_groups" DROP COLUMN "separator";--> statement-breakpoint
DROP TYPE "separator_style";