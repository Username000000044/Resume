import type { SectionConfig, TemplateConfig } from "#/types/Template";
import { create } from "zustand";
import { persist, subscribeWithSelector } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface ConfigData {
	templateName: string;
	templateConfig: TemplateConfig;
	sectionConfigs: Record<string, SectionConfig>; // uuid : config
}

interface SectionConfigInitialization {
	id: string;
	config: SectionConfig;
}

type LiveMode = "view" | "config";
interface ResumeConfigStoreState {
	liveMode: LiveMode;
	setLiveMode: (mode: LiveMode) => void;

	persistantConfig: ConfigData;
	liveConfig: ConfigData;

	syncLiveSections: () => void;

	initializeConfig: (
		templateName: string,
		defaultConfig: TemplateConfig,
		sectionsConfig: SectionConfigInitialization[],
	) => void;

	// resetLiveConfig: () => void;
}

export const DEFAULT_RESUME_CONFIG_STORE_PERSIST_NAME =
	"template-config-default";

export const useResumeConfigStore = create<ResumeConfigStoreState>()(
	persist(
		immer((set) => ({
			liveMode: "view",
			setLiveMode: (mode) =>
				set((state) => {
					state.liveMode = mode;
				}),

			persistantConfig: {
				templateName: "",
				templateConfig: {},
				sectionConfigs: {},
			} as ConfigData,
			liveConfig: {
				templateName: "",
				templateConfig: {},
				sectionConfigs: {},
			} as ConfigData,

			syncLiveSections: () =>
				set((state) => {
					state.liveConfig = JSON.parse(JSON.stringify(state.persistantConfig));
				}),

			initializeConfig: (templateName, defaultConfig, incomingSectionsConfig) =>
				set((state) => {
					// If persistant config doesn't exist or doesn't have content, create it
					if (
						!state.persistantConfig.templateName ||
						!state.persistantConfig.templateConfig ||
						!state.persistantConfig.sectionConfigs
					)
						state.persistantConfig = {
							templateName: templateName,
							templateConfig: defaultConfig,
							sectionConfigs: Object.fromEntries(
								incomingSectionsConfig.map(({ id, config }) => [id, config]),
							),
						};

					// Sync live state with the initial payload on load
					state.liveConfig = JSON.parse(JSON.stringify(state.persistantConfig));
				}),
		})),
		{
			name: DEFAULT_RESUME_CONFIG_STORE_PERSIST_NAME,
			partialize: (state) => ({
				persistantConfig: state.persistantConfig,
			}),
		},
	),
);
