import type { TemplateConfig } from "@resume/backend/src/db/schema.js";
import { move } from "@dnd-kit/helpers";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { useResumeStore } from "./useResumeStore";
import type { DragEndEvent } from "@dnd-kit/react";
import type { SectionType, TemplateType } from "#/types/Template";

interface ConfigData {
	config: TemplateConfig;
	sectionOrder: Record<string, number>; // uuid : 0
}
type LiveMode = "view" | "config";

interface SectionInitialization {
	id: string;
	order: number;
}

interface ResumeConfigStoreState {
	liveMode: LiveMode;
	setLiveMode: (mode: LiveMode) => void;
	persistantConfig: ConfigData;
	liveConfig: ConfigData;
	initializeConfig: (
		config: TemplateConfig,
		sections: SectionInitialization[],
	) => void;

	// resetLiveConfig: () => void;
}

export const useResumeConfigStore = create<ResumeConfigStoreState>()(
	persist(
		immer((set) => ({
			liveMode: "view",
			setLiveMode: (mode) =>
				set((state) => {
					state.liveMode = mode;
				}),

			persistantConfig: { config: {} as TemplateConfig, sectionOrder: {} },
			liveConfig: { config: {} as TemplateConfig, sectionOrder: {} },

			initializeConfig: (config, sections) =>
				set((state) => {
					// Create config object if doesn't exist
					if (
						!state.persistantConfig ||
						Object.keys(state.persistantConfig).length === 0
					) {
						state.persistantConfig.config = config;
					}

					// Pre-populate section order
					sections.forEach((section) => {
						if (state.persistantConfig.sectionOrder[section.id] === undefined) {
							state.persistantConfig.sectionOrder[section.id] = section.order;
						}
					});

					// Sync live state with the initial payload on load
					state.liveConfig = {
						config: state.persistantConfig.config,
						sectionOrder: { ...state.persistantConfig.sectionOrder },
					};
				}),
		})),
		{
			name: "template-config-default",
			partialize: (state) => ({
				persistantConfig: state.persistantConfig,
			}),
		},
	),
);
