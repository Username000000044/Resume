import { useResumeStore } from "#/store/useResumeStore";
import { useShallow } from "zustand/react/shallow";
import { DragDropProvider } from "@dnd-kit/react";
import { Plus } from "lucide-react";
import { SortableSubSectionItem } from "./SortableSubSectionItem";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../../../backend/src/appRouter";
import { ScrollArea } from "#/components/ui/scroll-area";
import { Button } from "#/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "#/components/ui/tabs";

export const MAX_BULLET_COUNT = 5;
export const MAX_SUB_BULLET_COUNT = 5;
const MAX_SUB_SECTION_COUNT = 4;

interface templateData {
  templateData: inferRouterOutputs<AppRouter>["templateById"];
}

export const EditorTabs = ({ templateData }: templateData) => {
  const { addSubSection, reorderSubSections, persistantMainSectionsStorage } =
    useResumeStore(
      useShallow((state) => ({
        persistantMainSectionsStorage: state.persistantMainSections,
        addMainBullet: state.addMainBullet,
        addSubSection: state.addSubSection,
        reorderSubSections: state.reorderSubSections,
      })),
    );

  return (
    <Tabs defaultValue="account" className="w-[calc(100%-90px)] gap-0">
      <ScrollArea className="mx-auto px-4 md:m-0">
        <TabsList className="bg-transparent py-0 overflow-y-hidden md:gap-4">
          {/* Tabs */}
          {templateData.sections.map((section) => (
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
        {/* <ScrollBar orientation="horizontal" className="px-4 !h-[6px]" /> */}
      </ScrollArea>
      {templateData.sections.map((section, sectionIndex) => (
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
              {persistantMainSectionsStorage[section.id].map(
                (subSection, subSectionIndex) => (
                  <SortableSubSectionItem
                    key={subSection.id}
                    section={section}
                    sectionIndex={sectionIndex}
                    subSection={subSection}
                    subSectionIndex={subSectionIndex}
                    templateData={templateData}
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
                  persistantMainSectionsStorage[section.id].length >=
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
