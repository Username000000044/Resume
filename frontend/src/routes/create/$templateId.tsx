import { createFileRoute } from "@tanstack/react-router";
import { EditorTabs } from "#/components/editor/EditorTabs";
import { LiveTemplate } from "#/components/editor/LiveTemplate";

export const Route = createFileRoute("/create/$templateId")({
  component: RouteComponent,
  notFoundComponent: () => <div>Template Not Found</div>,
});

function RouteComponent() {
  return (
    <div className="mx-auto max-w-[80rem] grid md:px-16 md:py-8">
      <div className="grid grid-cols-1 md:grid-cols-[auto_1fr] gap-10 justify-center md:justify-start">
        {/* Information Form */}
        <div className=" w-[calc(100%-7rem)] md:w-min justify-self-center md:justify-items-start">
          <h1 className="text-4xl mt-16 text-primary font-bold tracking-wide flex justify-center md:justify-start pb-8">
            Resume Editor
          </h1>

          <EditorTabs />
        </div>

        {/* Live Resume */}
        <div className="sticky top-0 max-h-screen flex items-center">
          <LiveTemplate />
        </div>
      </div>
    </div>
  );
}
