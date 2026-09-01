import { createFileRoute, useParams } from "@tanstack/react-router";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "#/utils/trpc";
import { useResumeStore } from "#/store/useResumeStore";
import { useEffect, useState } from "react";
import { EditorTabs } from "#/components/editor/form/EditorTabs";

import { PreviewHeader } from "#/components/editor/live_preview/PreviewHeader";
import { LivePreview } from "#/components/editor/live_preview/LivePreview";

export const Route = createFileRoute("/create/$templateId")({
  component: RouteComponent,
  notFoundComponent: () => <div>Template Not Found</div>,
});

export type LiveMode = "view" | "config";

function RouteComponent() {
  const [liveMode, setLivewMode] = useState<LiveMode>("view");

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

    const handleInitialization = async () => {
      const persistName = useResumeStore.persist.getOptions().name;
      const targetName = `template-${templateId}`;

      if (persistName !== targetName) {
        if (persistName) {
          localStorage.removeItem(persistName);
        }

        useResumeStore.persist.setOptions({
          name: targetName,
        });

        await useResumeStore.persist.rehydrate();
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
    };

    handleInitialization();
  }, [templateRequest.data, templateId, initializeSections]);

  if (!templateRequest.data) return <div>{templateRequest.error?.message}</div>;
  if (!isPayloadReady) return <div>Loading template configurations...</div>;

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
          <PreviewHeader liveMode={liveMode} setLiveMode={setLivewMode} />
          <div className="bg-linear-to-b from-primary/8 to-primary/12 p-4 rounded-4xl">
            <LivePreview templateData={templateRequest.data} />
          </div>
        </div>
      </div>
    </div>
  );
}
