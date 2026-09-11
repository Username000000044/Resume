export type ConfigValue = string | number | boolean | null | ConfigObject;
export type ConfigObject = {
	[key: string]: ConfigValue;
};
