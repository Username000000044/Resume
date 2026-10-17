import { createFileRoute, redirect } from "@tanstack/react-router";
import { queryClient, trpc } from "#/utils/trpc";
import {
  DEFAULT_RESUME_STORE_PERSIST_NAME,
  useResumeSectionsStore,
} from "#/store/useResumeSectionsStore";
import { useEffect, useMemo, useState } from "react";
import { EditorTabs } from "#/components/editor/data_form/EditorTabs";
import { LivePagePreview } from "#/components/editor/live_preview/LivePagePreview";
import {
  DEFAULT_RESUME_CONFIG_STORE_PERSIST_NAME,
  useResumeConfigStore,
} from "#/store/useResumeConfigStore";
import { useShallow } from "zustand/react/shallow";
import { firstAvaibleStorageIndex, storageTargetName } from "#/utils/templateStorage";
import { useResumeDimensionsStore } from "#/store/useResumeDimensionsStore";
import { useResizeObserver } from "#/hooks/useResizeObserver";
import { DragDropProvider } from "@dnd-kit/react"; // Imported for global tracking context
import { GlobalFontLoader } from "#/components/GlobalFontLoader";
import { PreviewHeader } from "#/components/editor/live_preview/PreviewHeader";
import { ConfigItems } from "#/components/editor/config_form/ConfigItems";
import type { SectionType } from "#/types/template";
import { LivePaper } from "#/components/Paper";
import { Empty, EmptyDescription, EmptyHeader, EmptyTitle } from "#/components/ui/empty";
import { constructPagesMatrix } from "#/utils/livePreview";

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
  const { sections, initializeSections, reorderSections } = useResumeSectionsStore(
    useShallow((store) => ({
      initializeSections: store.initializeSections,
      reorderSections: store.reorderSections,
      sections: store.sections,
    }))
  );
  const { config, templateConfigName, liveMode, initializeConfig, updateProperty } =
    useResumeConfigStore(
      useShallow((store) => ({
        config: store.config,
        liveMode: store.liveMode,
        templateConfigName: store.config.templateName,
        initializeConfig: store.initializeConfig,
        updateProperty: store.updateProperty
      })),
    );

  const [isSectionsPayloadReady, setIsSectionsPayloadReady] = useState(false);
  const [isConfigPayloadReady, setIsConfigPayloadReady] = useState(false);
  const [localName, setLocalName] = useState(templateConfigName);

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
      const persistName = useResumeSectionsStore.persist.getOptions().name;
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
        useResumeSectionsStore.persist.setOptions({ name: targetName });

      }

      const storedSections = localStorage.getItem(targetName);
      const hasStoredSections = storedSections !== null;

      const unsub = useResumeSectionsStore.persist.onFinishHydration(() => {
        // Only fills store will new data if doesn't exist.
        if (!hasStoredSections) {

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
      await useResumeSectionsStore.persist.rehydrate();
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

        // Populate zustand store with db default db config;
        if (template.sections) {
          const syncPayload = template.sections.map((s) => ({
            id: s.id,
            config: s.default_config,
          }));

          initializeConfig(
            config.templateName || "Untitled Resume",
            template.default_config,
            syncPayload,
          );
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
    template.default_config,
    template.sections,
    initializeConfig,
    initializeSections,
  ]);

  const [containerWidth, setContainerWidth] = useState(0);

  // Monitor ONLY the overall scrollbox layout column width to stay immune to page splitting variations
  const { targetRef } = useResizeObserver((width) => {
    setContainerWidth(width);
  });

  const sectionIsEmpty = (dbSection: SectionType) => {
    const liveMainSection = sections[dbSection.id];

    // If the section doesn't exist in the live state store yet, treat it as empty
    if (!liveMainSection) return true;

    // If there are zero sub-sections explicitly allocated, it has no printable context
    if (!liveMainSection.subSections || liveMainSection.subSections.length === 0) {
      return true;
    }

    // A section is empty if EVERY sub-section inside it is empty
    return liveMainSection.subSections.every((subSection) => {

      // 1. Check all text field input values inside this specific sub-section
      const fieldsEmpty = !subSection.fields || Object.values(subSection.fields).every((value) => {
        return typeof value === "string" ? value.trim() === "" : !value;
      });

      // 2. Check all lists, bullets, and child sub-bullets inside this sub-section
      const bulletsEmpty = !subSection.bullets || subSection.bullets.every((bullet) => {
        const textBlank = !bullet.text || bullet.text.trim() === "";

        const subBulletsBlank = !bullet.subBullets || bullet.subBullets.every((subBullet) => {
          return !subBullet.text || subBullet.text.trim() === "";
        });

        return textBlank && subBulletsBlank;
      });

      // The sub-section is empty only if BOTH fields and bullet points are empty strings
      return fieldsEmpty && bulletsEmpty;
    });
  };

  const templateIsEmpty = template.sections.every((dbSection) => {
    const liveMainSection = sections[dbSection.id];
    if (!liveMainSection?.subSections) return true;

    return liveMainSection.subSections.every((subSection) => {
      const fieldsEmpty = Object.values(subSection.fields || {}).every(
        (value) => value === "",
      );

      const bulletsEmpty = (subSection.bullets || []).every(
        (bullet) =>
          bullet.text === "" &&
          (bullet.subBullets || []).every((subBullet) => subBullet.text === ""),
      );

      return fieldsEmpty && bulletsEmpty;
    });
  });

  // Completed metrics calculation engine
  const layoutMetrics = useMemo(() => {
    const baseWidth = containerWidth || 844;
    const totalPageHeight = baseWidth * (11 / 8.5); // US Letter Aspect Ratio

    const spacingConfig = config?.templateConfig?.spacing;

    const targetMargin = spacingConfig?.page_margin ?? 0.75;
    const sectionGapPt = spacingConfig?.section_gap ?? 0;
    const sectionGapPx = sectionGapPt * (96 / 72) // (1pt = 1.333px)

    // Scale padding pixels proportionally so margins contract accurately on smaller screens
    const verticalPaddingPx = (targetMargin / 11) * totalPageHeight;

    const maxPageContentHeight = totalPageHeight - (verticalPaddingPx * 2);

    return { maxPageContentHeight, sectionGapPx };
  }, [containerWidth, config]);

  // Generate page-segmented data grids dynamically
  const pagesMatrix = useMemo(() => {
    if (!sections || Object.keys(sections).length === 0) return [];

    const orderedSectionIds = Object.keys(sections).sort((a, b) => {
      return (sections[a].order || 0) - (sections[b].order || 0);
    });

    const visibleOrderedSectionIds = orderedSectionIds.filter((id) => {
      const dbSection = template.sections.find((s) => s.id === id);
      if (!dbSection) return false;

      return !sectionIsEmpty(dbSection);
    });

    const dimensionsLoading = visibleOrderedSectionIds.some((id) => sectionDimensions[id]?.height === undefined);

    if (dimensionsLoading) {
      return [visibleOrderedSectionIds];
    }

    return constructPagesMatrix(
      layoutMetrics.maxPageContentHeight,
      sectionDimensions,
      visibleOrderedSectionIds,
      layoutMetrics.sectionGapPx
    );
  }, [sections, layoutMetrics.maxPageContentHeight, sectionDimensions, template.sections]);


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
            <PreviewHeader pagesMatrix={pagesMatrix} />
            <div className="bg-linear-to-b from-primary/8 to-primary/12 p-4 rounded-4xl">
              <div className="flex flex-col gap-4">
                {templateIsEmpty ? (
                  <LivePaper className="flex justify-center items-center">
                    <Empty>
                      <EmptyHeader>
                        <EmptyTitle>Empty Template</EmptyTitle>
                        <EmptyDescription>
                          Begin completing each section to populate the live preview.
                        </EmptyDescription>
                      </EmptyHeader>
                    </Empty>
                  </LivePaper>
                ) : (
                  pagesMatrix.map((pageSectionIds) => (
                    <div key={`page-${pageSectionIds.join('-')}`} ref={targetRef}>
                      <LivePagePreview
                        templateData={template}
                        pageSectionsId={pageSectionIds}
                      />
                    </div>
                  ))
                )
                }
              </div>
            </div>
          </div>

        </DragDropProvider>
      </div>
    </div>
  );
}