import type { AppRouter } from "@resume/backend/src/routers/trpcRouter.js";
import type { scalePresetMap } from "@resume/renderer/constants";
import type { inferRouterOutputs } from "@trpc/server";

type RouterOutputs = inferRouterOutputs<AppRouter>;

export type TemplateListType = RouterOutputs["templatesList"];
export type TemplateType = RouterOutputs["templateById"];

// Sections
export type SectionType = TemplateType["sections"][number];
export type FieldType = TemplateType["sections"][number]["fields"][number];
export type GroupType = TemplateType["sections"][number]["groups"][number];

// Fields
export type FieldRole = FieldType["renderRole"];
export type FieldColor = TemplateType["default_config"]["theme"]["colors"][keyof TemplateType["default_config"]["theme"]["colors"]];
export type FontWeight = TemplateType["default_config"]["theme"]["typography"]["font_weight"][keyof TemplateType["default_config"]["theme"]["typography"]["font_weight"]];
export type FieldSize = number;
export type FieldHeight = (typeof scalePresetMap)[TemplateType["default_config"]["theme"]["typography"]["preset"]]["line_height"][keyof (typeof scalePresetMap)[TemplateType["default_config"]["theme"]["typography"]["preset"]]["line_height"]];
export type FontVariant = TemplateType["default_config"]["theme"]["typography"]["font_family"][keyof TemplateType["default_config"]["theme"]["typography"]["font_family"]];
export type FieldElement = TemplateType["default_config"]["elements"][keyof TemplateType["default_config"]["elements"]];

// Config
export type TemplateConfig = TemplateType["default_config"];
export type SectionConfig = TemplateType["sections"][number]["default_config"];

export type ConfigValue = string | number | boolean | null | ConfigObject;
export type ConfigObject = {
    [key: string]: ConfigValue;
};

