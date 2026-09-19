import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { queryClient, trpc } from "#/utils/trpc";
import {
  DEFAULT_RESUME_STORE_PERSIST_NAME,
  useResumeStore,
} from "#/store/useResumeStore";
import { useEffect, useMemo, useState } from "react";
import { EditorTabs } from "#/components/editor/data_form/EditorTabs";

import { PreviewHeader } from "#/components/editor/live_preview/PreviewHeader";
import { LivePreview } from "#/components/editor/live_preview/LivePreview";
import {
  DEFAULT_RESUME_CONFIG_STORE_PERSIST_NAME,
  useResumeConfigStore,
} from "#/store/useResumeConfigStore";
import { useShallow } from "zustand/react/shallow";
import { ConfigItems } from "#/components/editor/config_form/ConfigItems";
import { LivePaper } from "#/components/Paper";
import {
  useDynamicFontStack,
  type FontVariantConfig,
} from "#/hooks/useDynamicFontStack";
import { FONT_REGISTRY } from "#/utils/fontRegistery";
import { GlobalFontLoader } from "#/components/GlobalFontLoader";

export const Route = createFileRoute("/create/$templateId")({
  loader: async ({ params }) => {
    const template = await queryClient.query(
      trpc.templateById.queryOptions(params.templateId, { retry: false }),
    );
    return { template };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        // loaderData?.template?.name,
        title: "Untitled Resume",
      },
    ],
  }),
  component: RouteComponent,
  notFoundComponent: () => <div>Template Not Found</div>,
});

function RouteComponent() {
  const { template } = Route.useLoaderData();

  const initializeSections = useResumeStore(
    (state) => state.initializeSections,
  );
  const { config, defaultConfig, liveMode, initializeConfig } =
    useResumeConfigStore(
      useShallow((state) => ({
        config: state.config,
        defaultConfig: state.defaultConfig,
        liveMode: state.liveMode,
        initializeConfig: state.initializeConfig,
      })),
    );

  const [isSectionsPayloadReady, setIsSectionsPayloadReady] = useState(false);
  const [isConfigPayloadReady, setIsConfigPayloadReady] = useState(false);

  useEffect(() => {
    if (!template) return;

    // template-{id}-{name}
    // config-{id}-{name}
    // {name} = (Captial One Buisness -> captial_one_buisness) or template name

    const formatStorageName = (name: string) => {
      const formattedName = name
        .toLowerCase()
        // Removes all non alphabetical + numerical charcters
        .replaceAll(/[^a-zA-Z0-9 ]/g, "")
        // Converts spaces into _
        .replaceAll(" ", "_");

      return formattedName;
    };

    const templateName = config.templateName
      ? formatStorageName(config.templateName)
      : formatStorageName(template.name);

    const handleSectionsInitialization = async () => {
      const persistName = useResumeStore.persist.getOptions().name;
      const targetName = `template-${template.id}-${templateName}`;

      // If Zustand's persist store exists but isn't targetName
      if (persistName && persistName !== targetName) {
        const existingData = localStorage.getItem(persistName);

        // Zustand's persist name is still default and there is data
        if (persistName === DEFAULT_RESUME_STORE_PERSIST_NAME && existingData) {
          // Push data from default name into targetName
          localStorage.setItem(targetName, existingData);
          localStorage.removeItem(persistName);
        }

        // Tell Zustand to change where its looking for persist data
        useResumeStore.persist.setOptions({ name: targetName });
      }

      const unsub = useResumeStore.persist.onFinishHydration(() => {
        // Only fills store will new data if doesn't exist.
        const currentSections = useResumeStore.getState().sections;
        if (!currentSections || Object.values(currentSections).length === 0) {
          // Populate zustand store with sections, field, and bullets
          if (template.sections) {
            const syncPayload = template.sections.map((s) => ({
              id: s.id,
              fieldIds: s.fields.map((f) => f.id),
              order: s.order,
            }));

            initializeSections(syncPayload);
          }
        }

        setIsSectionsPayloadReady(true);
        unsub();
      });

      // Wakes up zustand and forces it to pull data from new folder
      await useResumeStore.persist.rehydrate();
    };

    // Copied logic from handleSectionsInitialization
    const handleConfigInitialization = async () => {
      const persistName = useResumeConfigStore.persist.getOptions().name;
      const targetName = `config-${template.id}-${templateName}`;

      if (persistName && persistName !== targetName) {
        const existingData = localStorage.getItem(persistName);

        if (
          persistName === DEFAULT_RESUME_CONFIG_STORE_PERSIST_NAME &&
          existingData
        ) {
          localStorage.setItem(targetName, existingData);
          localStorage.removeItem(persistName);
        }

        useResumeConfigStore.persist.setOptions({ name: targetName });
      }

      const unsub = useResumeConfigStore.persist.onFinishHydration(() => {
        const config = useResumeConfigStore.getState().config;

        // Default Config
        const emptyDefaultTemplateConfig =
          Object.values(defaultConfig.template).length === 0;
        const emptyDefaultSectionsConfig =
          Object.values(defaultConfig.sections).length === 0;

        // User Config
        const emptyTemplateConfig =
          Object.values(config.templateConfig).length === 0;
        const emptySectionsConfig =
          Object.values(config.sectionConfigs).length === 0;

        if (
          emptyDefaultTemplateConfig ||
          emptyDefaultSectionsConfig ||
          emptyTemplateConfig ||
          emptySectionsConfig ||
          !config.templateName
        ) {
          // Populate zustand store with db default db config;
          if (template.sections) {
            const syncPayload = template.sections.map((s) => ({
              id: s.id,
              config: s.default_config,
            }));

            initializeConfig(
              templateName,
              template.default_config,
              syncPayload,
            );
          }
        }

        setIsConfigPayloadReady(true);
        unsub();
      });

      await useResumeConfigStore.persist.rehydrate();
    };

    handleSectionsInitialization();
    handleConfigInitialization();
  }, [
    template,
    config.templateName,
    defaultConfig.sections,
    defaultConfig.template,
    initializeConfig,
    initializeSections,
  ]);

  if (!isSectionsPayloadReady || !isConfigPayloadReady) {
    return (
      <div>
        {!isSectionsPayloadReady && <div>Loading template data...</div>}
        {!isConfigPayloadReady && <div>Loading config data...</div>}
      </div>
    );
  }

  return (
    <div className="pt-12 overflow-x-hidden lg:py-24 print:p-0">
      <div className="grid min-[93rem]:grid-cols-[1fr_auto] gap-12 2xl:gap-24 w-fit mx-auto">
        {/* Headless Font Loader */}
        <GlobalFontLoader />

        {/* Editor Column */}
        <div className=" flex flex-col w-full px-12 lg:px-0 print:hidden">
          <h1 className="mx-auto min-[93rem]:ml-0 text-4xl pb-8 text-primary font-bold tracking-wide">
            {"Untitled Resume"}
          </h1>

          {liveMode === "view" ? (
            <EditorTabs templateData={template} />
          ) : (
            <ConfigItems />
          )}
        </div>

        {/* Live Resume Column */}
        <div className="flex flex-col mx-12 lg:m-0">
          <PreviewHeader />
          <div className="bg-linear-to-b from-primary/8 to-primary/12 p-4 rounded-4xl">
            <div className="flex flex-col gap-4">
              <LivePreview templateData={template} />
              <LivePaper />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
