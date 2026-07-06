import {
	pgTable,
	varchar,
	text,
	timestamp,
	pgEnum,
	uuid,
	jsonb,
	integer,
} from "drizzle-orm/pg-core";

type Alignment = "center" | "left" | "right";

interface TemplateConfig {
	alignment: {
		header: Alignment;
		titles: Alignment;
		body: Alignment;
	};
	decorations: {
		section_divider: boolean;
		date_style: Alignment;
	};
	theme: {
		typography: {
			font_family: string;
			font_size_base: string; //11pt
		};
		colors: {
			primary: string;
			secondary: string;
			accent: string;
		};
	};
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
