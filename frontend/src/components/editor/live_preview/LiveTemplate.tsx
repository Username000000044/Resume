import { useResumeStore } from "#/store/useResumeStore";
import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../../../backend/src/appRouter";
import {
  Empty,
  EmptyHeader,
  EmptyTitle,
  EmptyDescription,
} from "../../ui/empty";
import { LivePaper } from "../../Paper";
import { SortableSectionItem } from "./SortableSectionItem";
import { HeaderItem } from "./HeaderItem";

interface templateData {
  templateData: inferRouterOutputs<AppRouter>["templateById"];
}

export const SCALE_CURVES = {
  editorial: { h3: 1.25, h2: 1.6, h1: 2.5 },
  balanced: { h3: 1.15, h2: 1.35, h1: 2.0 },
  minimal: { h3: 1.05, h2: 1.15, h1: 1.5 },
} as const;

export const TEXT_ALIGNMENT = {
  left: "text-left",
  center: "text-center",
  right: "text-right",
} as const;

export const LiveTemplate = ({ templateData }: templateData) => {
  const liveSections = useResumeStore((store) => store.liveMainSections);

  if (!liveSections) return <div>Loading template live preview...</div>;

  const templateIsEmpty = templateData.sections.every((section) => {
    const liveMainSection = liveSections[section.id] || [];

    return liveMainSection.every((subSection) => {
      const fieldsEmpty = section.fields.every(
        (field) => subSection.fields[field.id] === "",
      );

      const bulletsEmpty = subSection.bullets.every(
        (bullet) =>
          bullet.text === "" &&
          bullet.subBullets.every((subBullet) => subBullet.text === ""),
      );

      return fieldsEmpty && bulletsEmpty;
    });
  });

  if (templateIsEmpty)
    return (
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
    );

  return (
    <div className="flex flex-col gap-8 w-full">
      <LivePaper>
        {/* Template Sections */}
        {/* Header */}
        {templateData.sections
          .filter((dbSection) => dbSection.order === 1)
          .map((dbSection) => (
            <HeaderItem
              templateData={templateData}
              dbSection={dbSection}
              key={dbSection.id}
            />
          ))}

        {/* Sections */}
        {templateData.sections
          .filter((dbSection) => dbSection.order !== 1)
          .map((dbSection) => (
            <SortableSectionItem
              templateData={templateData}
              dbSection={dbSection}
              key={dbSection.id}
            />
          ))}
      </LivePaper>
      <LivePaper />
    </div>
  );
};
