import type { SectionConfig, TemplateConfig } from "#/types/Template";
import type { ConfigObject, ConfigValue } from "#/types/TemplateConfig";
import { debouncedStorage } from "#/utils/debouncedStorage";
import { create } from "zustand";
import { createJSONStorage, devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface DefaultConfig {
	template: TemplateConfig;
	sections: Record<string, SectionConfig>; // uuid : config
}

export interface ConfigData {
	templateName: string;
	templateConfig: TemplateConfig;
	sectionConfigs: Record<string, SectionConfig>; // uuid : config
}

interface SectionConfigInitialization {
	id: string;
	config: SectionConfig;
}

type LiveMode = "view" | "config";
export type ValueType = string | number | boolean;
interface ResumeConfigStoreState {
	liveMode: LiveMode;
	setLiveMode: (mode: LiveMode) => void;

	defaultConfig: DefaultConfig;
	config: ConfigData;

	initializeConfig: (
		templateName: string,
		defaultConfig: TemplateConfig,
		sectionsConfig: SectionConfigInitialization[],
	) => void;

	updateProperty: (path: string[], value: ValueType) => void;
	getProperty: <T = ConfigValue>(path: string[]) => T | undefined;

	resetConfig: () => void;
}

export const DEFAULT_RESUME_CONFIG_STORE_PERSIST_NAME =
	"template-config-default";

export const useResumeConfigStore = create<ResumeConfigStoreState>()(
	devtools(
		persist(
			immer((set, get) => ({
				liveMode: "view",
				setLiveMode: (mode) => set({ liveMode: mode }),

				defaultConfig: { template: {}, sections: {} } as DefaultConfig,
				config: {
					templateName: "",
					templateConfig: {},
					sectionConfigs: {},
				} as ConfigData,

				initializeConfig: (
					templateName,
					defaultConfig,
					incomingSectionsConfig,
				) =>
					set((state) => {
						// No localsorage config? Create it.
						if (
							!state.config.templateName ||
							!state.config.templateConfig ||
							!state.config.sectionConfigs
						) {
							state.defaultConfig.template = defaultConfig;
							state.config = {
								templateName: templateName,
								templateConfig: defaultConfig,
								sectionConfigs: Object.fromEntries(
									incomingSectionsConfig.map(({ id, config }) => [id, config]),
								),
							};
						}

						// No default config? Create it.
						const emptyDefaultTemplateConfig =
							Object.values(state.defaultConfig.template).length === 0;
						const emptyDefaultSectionsConfig =
							Object.values(state.defaultConfig.sections).length === 0;

						if (emptyDefaultTemplateConfig || emptyDefaultSectionsConfig) {
							if (emptyDefaultTemplateConfig) {
								state.defaultConfig.template = defaultConfig;
							} else {
								state.defaultConfig.sections = Object.fromEntries(
									incomingSectionsConfig.map(({ id, config }) => [id, config]),
								);
							}
						}
					}),

				updateProperty: (path, value) =>
					set((state) => {
						let target: ConfigObject = state.config;

						for (let i = 0; i < path.length - 1; i++) {
							target = target[path[i]] as ConfigObject;
						}

						target[path[path.length - 1]] = value;
					}),

				getProperty: <T = ConfigData>(path: string[]): T | undefined => {
					let target = get().config as unknown as ConfigObject;

					for (let i = 0; i < path.length; i++) {
						if (target == null || target === undefined) return undefined;
						target = target[path[i]] as unknown as ConfigObject;
					}

					return target as unknown as T;
				},

				resetConfig: () =>
					set((state) => {
						state.config.templateConfig = state.defaultConfig.template;
						state.config.sectionConfigs = state.defaultConfig.sections;
					}),
			})),
			{
				name: DEFAULT_RESUME_CONFIG_STORE_PERSIST_NAME,
				storage: debouncedStorage(
					createJSONStorage(() => localStorage),
					1500,
				),
				partialize: (state) => ({ config: state.config }),
			},
		),
	),
);
