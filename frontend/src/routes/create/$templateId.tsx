import { createFileRoute, useParams } from "@tanstack/react-router";
import { LiveTemplate } from "#/components/editor/live_preview/LiveTemplate";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "#/utils/trpc";
import { useResumeStore } from "#/store/useResumeStore";
import { useEffect, useState } from "react";
import { EditorTabs } from "#/components/editor/form/EditorTabs";

export const Route = createFileRoute("/create/$templateId")({
  component: RouteComponent,
  notFoundComponent: () => <div>Template Not Found</div>,
});

function RouteComponent() {
  const { templateId } = useParams({ from: "/create/$templateId" });
  const templateRequest = useQuery(
    trpc.templateById.queryOptions(templateId, { retry: false }),
  );

  const [isPayloadReady, setIsPayloadReady] = useState(false);
  const initializeSections = useResumeStore(
    (state) => state.initializeSections,
  );

  useEffect(() => {
    if (!templateRequest.data) return;

    // Persist zustand store name set
    const persistName = useResumeStore.persist.getOptions().name;
    if (templateRequest.data && persistName !== `template-${templateId}`) {
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
    if (templateRequest.data.sections) {
      const syncPayload = templateRequest.data.sections.map((s) => ({
        id: s.id,
        fieldIds: s.fields.map((f) => f.id),
      }));

      initializeSections(syncPayload);
      setIsPayloadReady(true);
    }
  }, [templateRequest.data, templateId, initializeSections]);

  if (!templateRequest.data) return <div>{templateRequest.error?.message}</div>;
  if (!isPayloadReady) return <div>Loading template configurations...</div>;

  return (
    <div className="pt-12 lg:py-18">
      <div className="grid lg:grid-cols-[auto_auto] gap-10 max-w-min mx-auto">
        <div className="flex flex-col items-center xl:items-start w-full">
          <h1 className="text-4xl pb-8 text-primary font-bold tracking-wide">
            Resume Editor
          </h1>

          {/* Editor Column */}
          <EditorTabs templateData={templateRequest.data} />
        </div>

        {/* Live Resume Column */}
        <LiveTemplate templateData={templateRequest.data} />
      </div>
    </div>
  );
}
