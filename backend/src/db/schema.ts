import { pgTable, varchar, text, timestamp, pgEnum, uuid, jsonb } from "drizzle-orm/pg-core";


type triAlign = "center" | "left" | "right";
export interface TemplateConfig {
    alignment: {
        header: triAlign;
        titles: triAlign;
        body: triAlign;
    };
    decorations: {
        section_divider: boolean;
        date_style: triAlign;
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

export const typeEnum = pgEnum('template_type', ["ats", "standard"])

export const templatesTable = pgTable("templates", {
  id: uuid().defaultRandom().primaryKey(),
  name: varchar({ length: 50 }).notNull(),
  type: typeEnum().notNull(),
  keywords: text().array().notNull(),
  thumbnail: text(),
  default_section_order: text().array().notNull() ,
  default_config: jsonb("default_config").$type<TemplateConfig>().notNull(),
  created_at: timestamp('created_at').notNull().defaultNow(),
});