import type { SectionConfig, TemplateConfig } from "#/types/Template";
import { create } from "zustand";
import { persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

interface ConfigData {
  template_config: TemplateConfig;
  section_configs: Record<string, SectionConfig>; // uuid : config
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

  initializeConfig: (
    default_config: TemplateConfig,
    sctions_config: SectionConfigInitialization[],
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

      persistantConfig: {
        template_config: {},
        section_configs: {},
      } as ConfigData,
      liveConfig: { template_config: {}, section_configs: {} } as ConfigData,

      initializeConfig: (default_config, incomingSectionsConfig) =>
        set((state) => {
          if (
            state.persistantConfig &&
            Object.keys(state.persistantConfig).length > 0
          ) {
            return;
          }

          state.persistantConfig = {
            template_config: default_config,
            section_configs: Object.fromEntries(
              incomingSectionsConfig.map(({ id, config }) => [id, config]),
            ),
          };
          // Sync live state with the initial payload on load
          state.liveConfig = JSON.parse(JSON.stringify(state.persistantConfig));
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
