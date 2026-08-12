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

interface SpacingConfig {
	page_margin: number; // (in)
	section_gap: number; // sapce between sections (pt)
	content_gap: number; // space between fields/bullets (pt)
	line_height: number; // individual character height (pt)
}

interface TypographyConfig {
	font_family: string;
	font_url: string;
	font_size_base: number; // 11pt (stored as num) so it can be multiplied by scale curve.
	scale_curve: "editorial" | "balanced" | "minimal";
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
	alignment: {
		header: "center" | "left" | "right";
		titles: "center" | "left" | "right";
		body: "center" | "left" | "right";
	};
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
}

export const templateTypeEnum = pgEnum("template_type", ["ats", "standard"]);
export const inputTypeEnum = pgEnum("input_type", [
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

export const templatesTable = pgTable("templates", {
	id: uuid().defaultRandom().primaryKey(),
	name: varchar({ length: 50 }).notNull(),
	type: templateTypeEnum().notNull(),
	thumbnail: text().notNull(),
	ownerId: uuid("owner_id"), // Null means template is a global, built-in.
	keywords: text().array().notNull(),
	default_config: jsonb("default_config").$type<TemplateConfig>().notNull(),
	created_at: timestamp("created_at").notNull().defaultNow(),
});

export const sectionsTable = pgTable("sections", {
	id: uuid().defaultRandom().primaryKey(),
	templateId: uuid("template_id")
		.references(() => templatesTable.id, {
			onDelete: "cascade",
		})
		.notNull(),
	title: varchar({ length: 100 }).notNull(),
	order: integer().notNull(),
	manyInstances: boolean("many_instances").notNull(), // False: Ensures only one instance of sectionsTable in UI
});

export const fieldsTable = pgTable("fields", {
	id: uuid().defaultRandom().primaryKey(),
	sectionsId: uuid("sections_id")
		.references(() => sectionsTable.id, {
			onDelete: "cascade",
		})
		.notNull(),
	name: varchar({ length: 50 }).notNull(),
	label: varchar({ length: 50 }).notNull(),
	type: inputTypeEnum().notNull(),
	placeholder: text(),
	required: varchar({ length: 5 }).notNull().default("false"),
	order: integer().notNull(),
});
