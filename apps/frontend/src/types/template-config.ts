import type { TemplateType } from "./template";

export type TemplateConfig = TemplateType["default_config"];
export type SectionConfig = TemplateType["sections"][number]["default_config"];

export type ConfigValue = string | number | boolean | null | ConfigObject;
export type ConfigObject = {
	[key: string]: ConfigValue;
};
