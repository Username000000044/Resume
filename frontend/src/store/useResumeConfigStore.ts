import type { SectionConfig, TemplateConfig } from "#/types/Template";
import type { ConfigObject } from "#/types/TemplateConfig";
import { create } from "zustand";
import { devtools, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface UserConfigData {
	templateName: string;
	templateConfig: TemplateConfig;
	sectionConfigs: Record<string, SectionConfig>; // uuid : config
}

interface SectionConfigInitialization {
	id: string;
	config: SectionConfig;
}

export type LiveMode = "view" | "config";
export type ValueType = string | number | boolean;
interface ResumeConfigStoreState {
	liveMode: LiveMode;
	setLiveMode: (mode: LiveMode) => void;

	defaultTemplateConfig: TemplateConfig;
	defaultSectionConfig: Record<string, SectionConfig>; // section uuid : config

	persistantConfig: UserConfigData;
	liveConfig: UserConfigData;

	syncLiveSections: () => void;

	initializeConfig: (
		templateName: string,
		defaultConfig: TemplateConfig,
		sectionsConfig: SectionConfigInitialization[],
	) => void;

	updateLiveProperty: (path: string[], value: ValueType) => void;
	updateProperty: (path: string[], value: ValueType) => void;

	// resetLiveConfig: () => void;
}

export const DEFAULT_RESUME_CONFIG_STORE_PERSIST_NAME =
	"template-config-default";

export const useResumeConfigStore = create<ResumeConfigStoreState>()(
	devtools(
		persist(
			immer((set) => ({
				liveMode: "view",
				setLiveMode: (mode) =>
					set((state) => {
						state.liveMode = mode;
					}),

				defaultTemplateConfig: {} as TemplateConfig,
				defaultSectionConfig: {},

				persistantConfig: {
					templateName: "",
					templateConfig: {},
					sectionConfigs: {},
				} as UserConfigData,
				liveConfig: {
					templateName: "",
					templateConfig: {},
					sectionConfigs: {},
				} as UserConfigData,

				syncLiveSections: () =>
					set((state) => {
						state.liveConfig = JSON.parse(
							JSON.stringify(state.persistantConfig),
						);
					}),

				initializeConfig: (
					templateName,
					defaultConfig,
					incomingSectionsConfig,
				) =>
					set((state) => {
						// No persistant config? Create it.
						if (
							!state.persistantConfig.templateName ||
							!state.persistantConfig.templateConfig ||
							!state.persistantConfig.sectionConfigs
						) {
							state.defaultTemplateConfig = defaultConfig;
							state.persistantConfig = {
								templateName: templateName,
								templateConfig: defaultConfig,
								sectionConfigs: Object.fromEntries(
									incomingSectionsConfig.map(({ id, config }) => [id, config]),
								),
							};
						}
						// No default config? Create it.
						if (
							Object.values(state.defaultTemplateConfig).length === 0 ||
							Object.values(state.defaultSectionConfig).length === 0
						) {
							if (Object.values(state.defaultTemplateConfig).length === 0) {
								state.defaultTemplateConfig = defaultConfig;
							} else {
								state.defaultSectionConfig = Object.fromEntries(
									incomingSectionsConfig.map(({ id, config }) => [id, config]),
								);
							}
						}

						// Sync live state with the initial payload on load
						state.liveConfig = JSON.parse(
							JSON.stringify(state.persistantConfig),
						);
					}),

				updateLiveProperty: (path, value) =>
					set((state) => {
						let target: ConfigObject = state.liveConfig;

						for (let i = 0; i < path.length - 1; i++) {
							target = target[path[i]] as ConfigObject;
						}

						target[path[path.length - 1]] = value;
					}),

				updateProperty: (path, value) =>
					set((state) => {
						let target: ConfigObject = state.persistantConfig;

						for (let i = 0; i < path.length - 1; i++) {
							target = target[path[i]] as ConfigObject;
						}

						target[path[path.length - 1]] = value;
					}),
			})),
			{
				name: DEFAULT_RESUME_CONFIG_STORE_PERSIST_NAME,
				partialize: (state) => ({
					persistantConfig: state.persistantConfig,
				}),
			},
		),
	),
);
