import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "#/utils/trpc";
import {
  DEFAULT_RESUME_STORE_PERSIST_NAME,
  useResumeStore,
} from "#/store/useResumeStore";
import { useEffect, useState } from "react";
import { EditorTabs } from "#/components/editor/form/EditorTabs";

import { PreviewHeader } from "#/components/editor/live_preview/PreviewHeader";
import { LivePreview } from "#/components/editor/live_preview/LivePreview";
import {
  DEFAULT_RESUME_CONFIG_STORE_PERSIST_NAME,
  useResumeConfigStore,
} from "#/store/useResumeConfigStore";
import { useShallow } from "zustand/react/shallow";

export const Route = createFileRoute("/create/$templateId")({
  component: RouteComponent,
  notFoundComponent: () => <div>Template Not Found</div>,
});

function RouteComponent() {
  const { templateId } = useParams({ from: "/create/$templateId" });
  const templateRequest = useQuery(
    trpc.templateById.queryOptions(templateId, { retry: false }),
  );

  const initializeSections = useResumeStore(
    (state) => state.initializeSections,
  );
  const {
    initializeConfig,
    liveConfig,
    defaultTemplateConfig,
    defaultSectionConfig,
  } = useResumeConfigStore(
    useShallow((state) => ({
      liveConfig: state.liveConfig,
      defaultTemplateConfig: state.defaultTemplateConfig,
      defaultSectionConfig: state.defaultSectionConfig,
      initializeConfig: state.initializeConfig,
    })),
  );

  const [isSectionsPayloadReady, setIsSectionsPayloadReady] = useState(false);
  const [isConfigPayloadReady, setIsConfigPayloadReady] = useState(false);

  useEffect(() => {
    if (!templateRequest.data) return;

    // template-{id}-{name}
    // config-{id}-{name}
    // {name} = (Captial One Buisness -> captial_one_buisness) or template name

    const formatStorageName = (name: string) => {
      return (
        name
          .toLowerCase()
          // Removes all non alphabetical + numerical charcters
          .replaceAll(/[^a-zA-Z0-9 ]/g, "")
          // Converts spaces into _
          .replaceAll(" ", "_")
      );
    };

    const templateName = liveConfig.templateName
      ? formatStorageName(liveConfig.templateName)
      : formatStorageName(templateRequest.data.name);

    const handleSectionsInitialization = async () => {
      const persistName = useResumeStore.persist.getOptions().name;
      const targetName = `template-${templateId}-${templateName}`;

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
        const currentSections =
          useResumeStore.getState().persistantMainSections;
        if (!currentSections || Object.values(currentSections).length === 0) {
          // Populate zustand store with sections, field, and bullets
          if (templateRequest.data.sections) {
            const syncPayload = templateRequest.data.sections.map((s) => ({
              id: s.id,
              fieldIds: s.fields.map((f) => f.id),
              order: s.order,
            }));

            initializeSections(syncPayload);
          }
        } else {
          useResumeStore.getState().syncLiveSections();
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
      const targetName = `config-${templateId}-${templateName}`;

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
        const persistConfig = useResumeConfigStore.getState().persistantConfig;
        if (
          // Default Config
          Object.values(defaultTemplateConfig).length === 0 ||
          Object.values(defaultSectionConfig).length === 0 ||
          // Persist Config
          Object.values(persistConfig.templateConfig).length === 0 ||
          Object.values(persistConfig.sectionConfigs).length === 0 ||
          !persistConfig.templateName
        ) {
          // Populate zustand store with db default db config;
          if (templateRequest.data.sections) {
            const syncPayload = templateRequest.data.sections.map((s) => ({
              id: s.id,
              config: s.default_config,
            }));

            initializeConfig(
              templateName,
              templateRequest.data.default_config,
              syncPayload,
            );
          }
        } else {
          useResumeConfigStore.getState().syncLiveSections();
        }

        setIsConfigPayloadReady(true);
        unsub();
      });

      await useResumeConfigStore.persist.rehydrate();
    };

    handleSectionsInitialization();
    handleConfigInitialization();
  }, [
    templateRequest.data,
    liveConfig.templateName,
    templateId,
    defaultSectionConfig,
    defaultTemplateConfig,
    initializeConfig,
    initializeSections,
  ]);

  if (!templateRequest.data) return <div>{templateRequest.error?.message}</div>;

  if (!isSectionsPayloadReady || !isConfigPayloadReady) {
    return (
      <div>
        {!isSectionsPayloadReady && <div>Loading template data...</div>}
        {!isConfigPayloadReady && <div>Loading config data...</div>}
      </div>
    );
  }

  return (
    <div className="pt-12 lg:py-24 print:p-0">
      <div className="grid lg:grid-cols-[auto_auto] gap-10 max-w-min mx-auto">
        {/* Editor Column */}
        <div className="flex flex-col items-center 2xl:items-start w-full print:hidden">
          <h1 className="text-4xl pb-8 text-primary font-bold tracking-wide">
            Resume Editor
          </h1>

          <EditorTabs templateData={templateRequest.data} />
        </div>

        {/* Live Resume Column */}
        <div className="flex flex-col gap-1">
          <PreviewHeader />
          <div className="bg-linear-to-b from-primary/8 to-primary/12 p-4 rounded-4xl">
            <LivePreview templateData={templateRequest.data} />
          </div>
        </div>
      </div>
    </div>
  );
}
