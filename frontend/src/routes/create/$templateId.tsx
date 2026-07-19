import { createFileRoute } from "@tanstack/react-router";
import { LiveTemplate } from "#/components/editor/LiveTemplate";
import { EditorTabs } from "#/components/editor/EditorTabs";

export const Route = createFileRoute("/create/$templateId")({
  component: RouteComponent,
  notFoundComponent: () => <div>Template Not Found</div>,
});

function RouteComponent() {
  return (
    <div className="container flex justify-between h-full">
      {/* Information Form */}
      <div className="pt-16">
        <h1 className="text-4xl text-primary font-bold tracking-wide pb-8">
          Resume Editor
        </h1>

        <EditorTabs />
      </div>

      {/* Live Resume */}
      <LiveTemplate />
    </div>
  );
}
