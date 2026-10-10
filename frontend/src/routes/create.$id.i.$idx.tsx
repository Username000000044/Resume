import { createFileRoute, redirect } from "@tanstack/react-router";
import { queryClient, trpc } from "#/utils/trpc";
import {
  DEFAULT_RESUME_STORE_PERSIST_NAME,
  useResumeStore,
} from "#/store/useResumeStore";
import { useEffect, useMemo, useState } from "react";
import { EditorTabs } from "#/components/editor/data_form/EditorTabs";
import { LivePagePreview } from "#/components/editor/live_preview/LivePagePreview";
import {
  DEFAULT_RESUME_CONFIG_STORE_PERSIST_NAME,
  useResumeConfigStore,
} from "#/store/useResumeConfigStore";
import { useShallow } from "zustand/react/shallow";
import { firstAvaibleStorageIndex, storageTargetName } from "#/utils/templateStorage";
import { constructPagesMatrix } from "#/utils/livePreview";
import { useResumeDimensionsStore } from "#/store/useResumeDimensionsStore";
import { useResizeObserver } from "#/hooks/useResizeObserver";
import { DragDropProvider } from "@dnd-kit/react"; // Imported for global tracking context
import { GlobalFontLoader } from "#/components/GlobalFontLoader";
import { PreviewHeader } from "#/components/editor/live_preview/PreviewHeader";
import { ConfigItems } from "#/components/editor/config_form/ConfigItems";

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
      trpc.template.templateById.queryOptions(params.id, { retry: false }),
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

  // Stores
  const sectionDimensions = useResumeDimensionsStore((store) => store.sectionDimensions);
  const { initializeSections, reorderSections } = useResumeStore(
    useShallow((store) => ({
      initializeSections: store.initializeSections,
      reorderSections: store.reorderSections,
    }))
  );
  const { config, defaultConfig, templateConfigName, liveMode, initializeConfig, updateProperty } =
    useResumeConfigStore(
      useShallow((store) => ({
        config: store.config,
        defaultConfig: store.defaultConfig,
        liveMode: store.liveMode,
        templateConfigName: store.config.templateName,
        initializeConfig: store.initializeConfig,
        updateProperty: store.updateProperty
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

  // Storage Population
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

      const hasExistingLocalStorage = localStorage.getItem(targetName);

      const unsub = useResumeStore.persist.onFinishHydration(() => {
        // Only fills store will new data if doesn't exist.
        const currentSections = useResumeStore.getState().sections;
        const hasInMemorySections = currentSections && Object.values(currentSections).length > 0;

        if (!hasExistingLocalStorage && !hasInMemorySections) {

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

      const hasExistingLocalStorage = localStorage.getItem(targetName);

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

        if (hasExistingLocalStorage &&
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

  const [containerWidth, setContainerWidth] = useState(0);

  // Monitor ONLY the overall scrollbox layout column width to stay immune to page splitting variations
  const { targetRef } = useResizeObserver((width) => {
    setContainerWidth(width);
  });

  // Completed metrics calculation engine
  const layoutMetrics = useMemo(() => {
    const baseWidth = containerWidth || 844;
    const totalPageHeight = baseWidth * (11 / 8.5); // US Letter Aspect Ratio

    const spacingConfig = config?.templateConfig?.spacing;
    const targetMargin = spacingConfig?.page_margin ?? 0.75;

    const sectionGapPt = spacingConfig?.section_gap;
    const sectionGapPx = sectionGapPt * (96 / 72) // (1pt = 1.333px)

    // Scale padding pixels proportionally so margins contract accurately on smaller screens
    const verticalPaddingPx = (targetMargin / 11) * totalPageHeight;

    const maxPageContentHeight = totalPageHeight - (verticalPaddingPx * 2);

    return { maxPageContentHeight, sectionGapPx };
  }, [containerWidth, config]);

  // Generate page-segmented data grids dynamically
  const pagesMatrix = useMemo(() => {
    if (!template.sections) return [];

    const orderedSectionIds = template.sections.map((s) => s.id);

    // Guard: Change from !height to explicit checking for undefined
    const dimensionsLoading = orderedSectionIds.some((id) => sectionDimensions[id]?.height === undefined);

    if (dimensionsLoading) {
      return [orderedSectionIds];
    }

    return constructPagesMatrix(
      layoutMetrics.maxPageContentHeight,
      sectionDimensions,
      orderedSectionIds,
      layoutMetrics.sectionGapPx
    );
  }, [layoutMetrics.maxPageContentHeight, sectionDimensions, template.sections]);


  // Status Display
  if (!isSectionsPayloadReady || !isConfigPayloadReady) {
    return (
      <div>
        {!isSectionsPayloadReady && <div>Loading template data...</div>}
        {!isConfigPayloadReady && <div>Loading config data...</div>}
      </div>
    )
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

        <DragDropProvider
          onDragEnd={(event) => {
            const sectionId = event.operation.target?.id;
            if (sectionId) {
              reorderSections(event);
            }
          }}
        >
          {/* Live Resume Column */}
          <div className="flex flex-col mx-12 lg:m-0">
            <PreviewHeader />
            <div className="bg-linear-to-b from-primary/8 to-primary/12 p-4 rounded-4xl">
              <div className="flex flex-col gap-4">
                {pagesMatrix.map((pageSectionIds, pageIndex) => (
                  <div key={`page-${pageIndex}`} ref={targetRef}>
                    <LivePagePreview
                      templateData={template}
                      pageSectionsId={pageSectionIds}
                    />
                  </div>
                ))}
              </div>
            </div>
          </div>

        </DragDropProvider>
      </div>
    </div>
  );
}