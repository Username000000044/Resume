import { notFound, useParams } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useSuspenseQuery } from "@tanstack/react-query";
import { trpc } from "#/utils/trpc";
import { useEffect, useState } from "react";
import { useResumeStore } from "#/store/useResumeStore";
import { useShallow } from "zustand/react/shallow";
import { DragDropProvider } from "@dnd-kit/react";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { SortableSubSectionItem } from "./SortableSubSectionItem";

export const MAX_BULLET_COUNT = 5;
export const MAX_SUB_BULLET_COUNT = 5;
const MAX_SUB_SECTION_COUNT = 4;

export const EditorTabs = () => {
  const {
    initializeSections,
    addSubSection,
    reorderSubSections,
    mainSectionsStorage,
  } = useResumeStore(
    useShallow((state) => ({
      mainSectionsStorage: state.mainSections,
      addMainBullet: state.addMainBullet,
      addSubSection: state.addSubSection,
      reorderSubSections: state.reorderSubSections,
      initializeSections: state.initializeSections,
    })),
  );

  const { templateId } = useParams({ from: "/create/$templateId" });
  const { data: template, error } = useSuspenseQuery(
    trpc.templateById.queryOptions(templateId),
  );

  const [isPayloadReady, setIsPayloadReady] = useState(false);

  useEffect(() => {
    // Persist zustand store name set
    const persistName = useResumeStore.persist.getOptions().name;
    if (template && persistName !== `template-${templateId}`) {
      // Remove default name
      if (persistName) {
        localStorage.removeItem(persistName);
      }

      // Add dynamic name
      useResumeStore.persist.setOptions({
        name: `template-${templateId}`,
      });

      // Immediately pull local data for sections, field, and bullets
      useResumeStore.persist.rehydrate();
    }

    // Populate zustand store with sections, field, and bullets
    if (template.sections) {
      const syncPayload = template.sections.map((s) => ({
        id: s.id,
        fieldIds: s.fields.map((f) => f.id),
      }));

      initializeSections(syncPayload);
      setIsPayloadReady(true);
    }
  }, [template, templateId, initializeSections]);

  if (error) notFound();
  if (!isPayloadReady) return <div>Loading template configurations...</div>;

  return (
    <Tabs defaultValue="account" className="w-80 md:w-100 gap-0">
      <TabsList className="bg-transparent gap-4 mx-auto md:m-0 md:mx-4 py-0">
        {/* Tabs */}
        {template.sections.map((section) => (
          <TabsTrigger
            className="cursor-pointer px-3 rounded-b-none font-normal data-active:bg-primary data-active:text-primary-foreground data-active:hover:text-primary-foreground"
            value={section.title}
            key={section.id}
          >
            {section.title.charAt(0).toUpperCase() +
              section.title.slice(1).toLowerCase()}
          </TabsTrigger>
        ))}
      </TabsList>
      {template.sections.map((section) => (
        <TabsContent
          value={section.title}
          key={section.id}
          className="flex flex-col gap-4"
        >
          {/* Enable Cards to Be Dragable */}
          <DragDropProvider
            onDragEnd={(event) => {
              reorderSubSections(section.id, event);
            }}
          >
            {/* Map main sections to expose sections*/}
            <ul className="flex flex-col gap-4">
              {mainSectionsStorage[section.id].map(
                (subSection, subSectionIndex) => (
                  <SortableSubSectionItem
                    key={subSection.id}
                    section={section}
                    subSection={subSection}
                    subSectionIndex={subSectionIndex}
                  />
                ),
              )}
            </ul>
          </DragDropProvider>

          {/* Add Section */}
          {section.manyInstances && (
            <div className="flex justify-center mt-4">
              <Button
                size="icon-lg"
                variant="outline"
                className="border-none shadow-sm ring-1 ring-foreground/5 cursor-pointer"
                onClick={() => addSubSection(section.id)}
                disabled={
                  mainSectionsStorage[section.id].length >=
                  MAX_SUB_SECTION_COUNT
                }
              >
                <Plus />
              </Button>
            </div>
          )}
        </TabsContent>
      ))}
    </Tabs>
  );
};
