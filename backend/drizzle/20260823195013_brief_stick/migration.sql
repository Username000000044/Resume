CREATE TYPE "field_position" AS ENUM('left', 'center', 'right');--> statement-breakpoint
CREATE TYPE "render_role" AS ENUM('header', 'secondary_header', 'section_title', 'entity_title', 'role_title', 'metadata', 'body');--> statement-breakpoint
CREATE TYPE "field_type" AS ENUM('button', 'checkbox', 'color', 'date', 'email', 'file', 'image', 'month', 'number', 'radio', 'range', 'search', 'tel', 'text', 'time', 'url', 'week');--> statement-breakpoint
CREATE TYPE "template_type" AS ENUM('ats', 'standard');--> statement-breakpoint
CREATE TABLE "field_alignments" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"field_id" uuid NOT NULL UNIQUE,
	"field_position" "field_position" NOT NULL,
	"row_index" integer NOT NULL,
	"item_order" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE "fields" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"sections_id" uuid NOT NULL,
	"name" varchar(50) NOT NULL,
	"label" varchar(50) NOT NULL,
	"render_role" "render_role" NOT NULL,
	"type" "field_type" NOT NULL,
	"placeholder" text
);
--> statement-breakpoint
CREATE TABLE "sections" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"template_id" uuid NOT NULL,
	"title" varchar(100) NOT NULL,
	"order" integer NOT NULL UNIQUE,
	"default_config" jsonb NOT NULL,
	"many_instances" boolean NOT NULL
);
--> statement-breakpoint
CREATE TABLE "templates" (
	"id" uuid PRIMARY KEY DEFAULT gen_random_uuid(),
	"name" varchar(50) NOT NULL,
	"template_type" "template_type" NOT NULL,
	"thumbnail" text NOT NULL,
	"owner_id" uuid,
	"keywords" text[] NOT NULL,
	"default_config" jsonb NOT NULL,
	"created_at" timestamp DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "field_alignments" ADD CONSTRAINT "field_alignments_field_id_fields_id_fkey" FOREIGN KEY ("field_id") REFERENCES "fields"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "fields" ADD CONSTRAINT "fields_sections_id_sections_id_fkey" FOREIGN KEY ("sections_id") REFERENCES "sections"("id") ON DELETE CASCADE;--> statement-breakpoint
ALTER TABLE "sections" ADD CONSTRAINT "sections_template_id_templates_id_fkey" FOREIGN KEY ("template_id") REFERENCES "templates"("id") ON DELETE CASCADE;