import type { ConfigObject, SectionConfig, TemplateConfig } from "#/types/trpc";
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
	template: TemplateConfig & {
		pagination: boolean;
	}
	sections: Record<string, SectionConfig>; // uuid : config
}

interface SectionConfigInitialization {
	id: string;
	config: SectionConfig;
}

export type Mode = "preview" | "editor";
export type ValueType = string | number | boolean;
interface ResumeConfigStoreState {
	mode: Mode;
	setMode: (mode: Mode) => void;

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
				mode: "preview",
				setMode: (mode) => set({ mode: mode }),

				defaultConfig: { template: {}, sections: {} } as DefaultConfig,
				config: {
					templateName: "",
					template: {},
					sections: {},
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
								template: {
									...defaultConfig,
									pagination: true,
								},
								sections: Object.fromEntries(
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
						state.config.template = { ...state.defaultConfig.template, pagination: true };
						state.config.sections = state.defaultConfig.sections;
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
