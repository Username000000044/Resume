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

// TEMPLATES
export const templateTypeEnum = pgEnum("template_type", ["ats", "standard"]);

interface SpacingConfig {
	page_margin: number; // (in)
	section_gap: number; // space between sections
	instance_gap: number; // sapce between section instances (pt) (eg. job1, job2)
	divider_gap: number; // space on the top + bottom of dividers (pt)
	line_height: number; // individual character height (pt) multiplied by scale curve.
}

interface TypographyConfig {
	font_family: string;
	font_url: string;
	font_size_base: number; // 11pt (stored as num) so it can be multiplied by scale curve.
	scale_curve: "editorial" | "balanced" | "minimal";
	font_weight: Record<(typeof fieldRenderRoleEnum.enumValues)[number], number>;
}

interface ColorPalette {
	primary: string;
	secondary: string;
	accent: string;
	text_main: string;
	text_muted: string;
	divider: string;
}

interface TemplateConfig {
	// decorations, typography/fontsizes, colors
	decorations: {
		section_divider: boolean;
		divider_style: "solid" | "dashed" | "thick";
		bullet_style: "disc" | "circle" | "square" | "none";
		sub_bullet_style: "disc" | "circle" | "square" | "none";
	};
	theme: {
		typography: TypographyConfig;
		colors: ColorPalette;
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
]);

export const fieldPositionEnum = pgEnum("field_position", [
	"left",
	"center",
	"right",
]);

export const fieldRenderRoleEnum = pgEnum("render_role", [
	"header",
	"secondary_header",
	"section_title",
	"entity_title",
	"role_title",
	"metadata",
	"body",
]);

export const fieldsTable = pgTable("fields", {
	id: uuid().defaultRandom().primaryKey(),
	sectionsId: uuid("sections_id")
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
