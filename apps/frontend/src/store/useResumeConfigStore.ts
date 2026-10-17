import type { ConfigObject, SectionConfig, TemplateConfig } from "#/types/template-config";
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

	resetConfig: () => void;
}

export const DEFAULT_RESUME_CONFIG_STORE_PERSIST_NAME =
	"template-config-default";

export const useResumeConfigStore = create<ResumeConfigStoreState>()(
	devtools(
		persist(
			immer((set) => ({
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
						//  Always create default config
						state.defaultConfig.template = defaultConfig;
						state.defaultConfig.sections = Object.fromEntries(
							incomingSectionsConfig.map(({ id, config }) => [id, config])
						);

						// Only initalize config if it doesn't exist.
						if (!state.config.templateName) {
							state.config = {
								templateName,
								templateConfig: defaultConfig,
								sectionConfigs: Object.fromEntries(
									incomingSectionsConfig.map(({ id, config }) => [id, config])
								),
							};
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

				resetConfig: () =>
					set((state) => {
						state.config.templateConfig = state.defaultConfig.template;
						state.config.sectionConfigs = state.defaultConfig.sections;
					}),
			})),
			{
				name: DEFAULT_RESUME_CONFIG_STORE_PERSIST_NAME,
				partialize: (state) => ({ config: state.config }),
				storage: debouncedStorage(
					createJSONStorage(() => localStorage),
					1500,
				),
			},
		),
	),
);
