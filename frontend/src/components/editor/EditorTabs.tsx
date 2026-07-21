/** biome-ignore-all lint/suspicious/noArrayIndexKey: <explanation> */
import { notFound, useParams } from "@tanstack/react-router";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../ui/tabs";
import { useSuspenseQuery } from "@tanstack/react-query";
import { trpc } from "#/utils/trpc";
import { useEffect, useState } from "react";
import { useResumeStore } from "#/store/useResumeStore";
import { useShallow } from "zustand/react/shallow";
import { Card, CardContent } from "../ui/card";
import { Field, FieldGroup } from "../ui/field";
import { FieldInput } from "./FieldInput";
import { Button } from "../ui/button";
import { Plus } from "lucide-react";
import { BulletItem } from "./BulletItem";
import { SubBulletItem } from "./SubBulletItem";

const MAX_BULLET_COUNT = 5;
export const MAX_SUB_BULLET_COUNT = 5;

export const EditorTabs = () => {
  const [isPayloadReady, setIsPayloadReady] = useState(false);

  const { templateId } = useParams({ from: "/create/$templateId" });
  const { data: template, error } = useSuspenseQuery(
    trpc.templateById.queryOptions(templateId),
  );

  const {
    initializeSections,
    addMainBullet,
    addSubSection,
    mainSectionsStorage,
  } = useResumeStore(
    useShallow((state) => ({
      mainSectionsStorage: state.mainSections,
      addMainBullet: state.addMainBullet,
      addSubSection: state.addSubSection,
      initializeSections: state.initializeSections,
    })),
  );

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
    <Tabs defaultValue="account" className="w-100 gap-0">
      <TabsList className="bg-transparent gap-4 px-2 py-0">
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
          {/* Map main sections to expose sections */}
          {mainSectionsStorage[section.id].map((_, subSectionIndex) => (
            <Card key={`${section.id}-${subSectionIndex}`}>
              <CardContent>
                {/* Section Fields */}
                <FieldGroup className="grid grid-cols-4 gap-3">
                  {section.fields.map((field) => (
                    <FieldInput
                      key={field.id}
                      field={field}
                      section={section}
                      subSectionIndex={subSectionIndex}
                    />
                  ))}
                </FieldGroup>

                {/* Bullets */}
                <Button
                  variant="outline"
                  size="xs"
                  className="col-span-full w-25 my-8"
                  onClick={() => addMainBullet(section.id, subSectionIndex)}
                  disabled={
                    mainSectionsStorage[section.id][subSectionIndex].bullets
                      .length >= MAX_BULLET_COUNT
                  }
                >
                  <Plus /> Add Bullet
                </Button>

                {mainSectionsStorage[section.id][subSectionIndex].bullets.map(
                  (mainBullet, mainBulletIndex) => (
                    <FieldGroup
                      key={mainBullet.id}
                      className="grid grid-cols-6 gap-3"
                    >
                      <div className="col-span-5">
                        <BulletItem
                          section={section}
                          mainBullet={mainBullet}
                          subSectionIndex={subSectionIndex}
                          bulletIndex={mainBulletIndex}
                        />
                      </div>

                      {/* Sub Bullets */}

                      <FieldGroup className="col-start-2 col-span-4 gap-3">
                        {mainBullet.subBullets.map(
                          (subBullet, subBulletIndex) => (
                            <SubBulletItem
                              section={section}
                              mainBullet={mainBullet}
                              subBullet={subBullet}
                              subSectionIndex={subSectionIndex}
                              subBulletIndex={subBulletIndex}
                              key={subBullet.id}
                            />
                          ),
                        )}
                      </FieldGroup>
                    </FieldGroup>
                  ),
                )}
              </CardContent>
            </Card>
          ))}

          {/* Add Section */}
          <div className="flex justify-center mt-10">
            <Button
              size="icon-lg"
              variant="outline"
              className="border-none shadow-sm ring-1 ring-foreground/5 cursor-pointer"
              onClick={() => addSubSection(section.id)}
            >
              <Plus />
            </Button>
          </div>
        </TabsContent>
      ))}
    </Tabs>
  );
};
