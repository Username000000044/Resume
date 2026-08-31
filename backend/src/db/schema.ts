import {
	pgTable,
	varchar,
	text,
	timestamp,
	pgEnum,
	uuid,
	jsonb,
	integer,
	boolean,
} from "drizzle-orm/pg-core";

// ENUMS
export const templateTypeEnum = pgEnum("template_type", ["ats", "standard"]);
export const inputTypeEnum = pgEnum("field_type", [
	"button",
	"checkbox",
	"color",
	"date",
	"email",
	"file",
	"image",
	"month",
	"number",
	"radio",
	"range",
	"search",
	"tel",
	"text",
	"time",
	"url",
	"week",
	"textarea",
]);
export const fieldPositionEnum = pgEnum("field_position", [
	"left",
	"center",
	"right",
]);
export const fieldRenderRoleEnum = pgEnum("render_role", [
	"heading",
	"secondary_heading",
	"section_title",
	"entity_title",
	"role_title",
	"metadata",
	"body",
]);

// TEMPLATE
interface SpacingConfig {
	page_margin: number; // (in)
	section_gap: number; // space between sections
	instance_gap: number; // sapce between section instances (pt) (eg. job1, job2)
	divider_gap: number; // space on the top + bottom of dividers (pt)
	bullet_indentation: number; // space before bullet (pt)
	line_height: number; // individual character height (pt) multiplied by scale curve.
}

interface TypographyConfig {
	primary_font_family: string;
	primary_font_url: string;

	secondary_font_family: string;
	secondary_font_url: string;

	font_size_base: number; // 11pt (stored as num) so it can be multiplied by scale curve.
	scale_curve: "editorial" | "balanced" | "minimal";
	font_weight: Record<(typeof fieldRenderRoleEnum.enumValues)[number], number>;
}

interface TemplateConfig {
	// decorations, typography/fontsizes, colors
	decorations: {
		header_divider: boolean;
		section_divider: boolean;
		divider_style: "solid" | "dashed" | "thick";
		bullet_style: "disc" | "circle" | "square" | "none";
		sub_bullet_style: "disc" | "circle" | "square" | "none";
	};
	theme: {
		typography: TypographyConfig;
		colors: Record<
			(typeof fieldRenderRoleEnum.enumValues)[number] | "divider",
			string
		>; // fieldRole : color hex;
	};
	spacing: SpacingConfig;
	elements: Record<
		(typeof fieldRenderRoleEnum.enumValues)[number],
		"h1" | "h2" | "h3" | "h4" | "p" | "span"
	>;
}

export const templatesTable = pgTable("templates", {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 50 }).notNull(),
	type: templateTypeEnum("template_type").notNull(),
	thumbnail: text().notNull(),
	ownerId: uuid("owner_id"), // Null means template is a global, built-in.
	keywords: text().array().notNull(),
	default_config: jsonb("default_config").$type<TemplateConfig>().notNull(),
	created_at: timestamp("created_at").notNull().defaultNow(),
});

// SECTIONS
interface SectionConfig {
	alignment: {
		title: "left" | "center" | "right";
	};
	spacing: {
		instance_gap: boolean;
	};
}

export const sectionsTable = pgTable("sections", {
	id: uuid().defaultRandom().primaryKey(),
	templateId: uuid("template_id")
		.references(() => templatesTable.id, {
			onDelete: "cascade",
		})
		.notNull(),
	title: varchar({ length: 100 }).notNull(),
	order: integer().notNull().unique(),
	default_config: jsonb("default_config").$type<SectionConfig>().notNull(),
	manyInstances: boolean("many_instances").notNull(), // False: Ensures only one instance of sectionsTable in UI
});

// FIELDS
export const fieldsTable = pgTable("fields", {
	id: uuid().defaultRandom().primaryKey(),
	sectionsId: uuid("section_id")
		.references(() => sectionsTable.id, {
			onDelete: "cascade",
		})
		.notNull(),
	name: varchar({ length: 50 }).notNull(),
	label: varchar({ length: 50 }).notNull(),
	renderRole: fieldRenderRoleEnum("render_role").notNull(),
	type: inputTypeEnum().notNull(),
	placeholder: text(),
});

export const fieldAlignmentsTable = pgTable("field_alignments", {
	id: uuid().defaultRandom().primaryKey(),
	fieldId: uuid("field_id")
		.references(() => fieldsTable.id, { onDelete: "cascade" })
		.notNull()
		.unique(),
	position: fieldPositionEnum("field_position").notNull(),
	rowIndex: integer("row_index").notNull(),
	itemOrder: integer("item_order").notNull(),
});
