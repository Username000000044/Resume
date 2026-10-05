import { createFileRoute, redirect } from "@tanstack/react-router";
import { queryClient, trpc } from "#/utils/trpc";
import {
  DEFAULT_RESUME_STORE_PERSIST_NAME,
  useResumeStore,
} from "#/store/useResumeStore";
import { useEffect, useState, type ChangeEvent } from "react";
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

import { GlobalFontLoader } from "#/components/GlobalFontLoader";
import { firstAvaibleStorageIndex, storageTargetName } from "#/utils/template";

export const Route = createFileRoute("/create/$id/i/$idx")({
  beforeLoad: async ({ params }) => {
    const firstAvaibleIndex = firstAvaibleStorageIndex(params.id);
    const targetIdx = parseInt(params.idx, 10);

    if (targetIdx > firstAvaibleIndex) {
      throw redirect({
        to: '/create/$id/i/$idx',
        params: { id: params.id, idx: firstAvaibleIndex.toString() }
      })
    } else {
      return;
    }
  },
  loader: async ({ params }) => {
    const template = await queryClient.query(
      trpc.templateById.queryOptions(params.id, { retry: false }),
    );
    const templateIdx = params.idx;
    const templateConfigName = useResumeConfigStore.getState().config.templateName;
    return { template, templateIdx, templateConfigName };
  },
  head: ({ loaderData }) => ({
    meta: [
      {
        title: loaderData?.templateConfigName,
      },
    ],
  }),
  component: RouteComponent,
  notFoundComponent: () => <div>Template Not Found</div>,
});

function RouteComponent() {
  const { template, templateIdx } = Route.useLoaderData();

  const initializeSections = useResumeStore(
    (state) => state.initializeSections,
  );
  const { defaultConfig, liveMode, templateConfigName, updateProperty, initializeConfig } =
    useResumeConfigStore(
      useShallow((state) => ({
        defaultConfig: state.defaultConfig,
        liveMode: state.liveMode,
        templateConfigName: state.config.templateName,
        initializeConfig: state.initializeConfig,
        updateProperty: state.updateProperty
      })),
    );

  const [isSectionsPayloadReady, setIsSectionsPayloadReady] = useState(false);
  const [isConfigPayloadReady, setIsConfigPayloadReady] = useState(false);
  const [localName, setLocalName] = useState(templateConfigName || "Untitled Resume");

  // Update document title on load
  useEffect(() => {
    if (templateConfigName) {
      setLocalName(templateConfigName);
      document.title = templateConfigName;
    } else {
      document.title = localName;
    }
  }, [templateConfigName]);


  useEffect(() => {
    if (!template.id) return;

    // template-{id}-{index}
    // config-{id}-{index}
    // name is anything. Stored into config storage as templateName

    const handleSectionsInitialization = async () => {
      const persistName = useResumeStore.persist.getOptions().name;
      const targetName = storageTargetName(template.id, templateIdx, "sections");

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
      const targetName = storageTargetName(template.id, templateIdx, "config");

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
              config.templateName,
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
    template.id,
    templateIdx,
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
        <div className=" flex flex-col w-full lg:px-0 print:hidden">
          <input
            type="text"
            name="templateName"
            value={localName}
            onChange={(e) => setLocalName(e.currentTarget.value)}
            onBlur={(e) => {
              const trimmedValue = e.currentTarget.value.trim();
              if (trimmedValue.length === 0) {
                setLocalName("Untitled Resume");
                updateProperty(["templateName"], "Untitled Resume");
              } else {
                updateProperty(["templateName"], trimmedValue);
              }
            }}
            maxLength={24}
            className="text-center min-[93rem]:text-start text-4xl mb-8 text-primary font-bold tracking-wide border-none outline-none"
          />


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
