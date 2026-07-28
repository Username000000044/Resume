import { createFileRoute } from "@tanstack/react-router";
import { EditorTabs } from "#/components/editor/EditorTabs";

export const Route = createFileRoute("/create/$templateId")({
  component: RouteComponent,
  notFoundComponent: () => <div>Template Not Found</div>,
});

function RouteComponent() {
  return (
    <div className="container">
      {/* Information Form */}
      <div className="pt-16">
        <h1 className="text-4xl text-primary font-bold tracking-wide flex justify-center md:justify-start pb-8">
          Resume Editor
        </h1>

        <EditorTabs />
      </div>

      {/* Live Resume */}
      {/* <div className="fixed top-0 left-0 w-full min-h-screen flex justify-center items-center pointer-events-none bg-red-200">
        <div className="pointer-events-auto bg-red-500" />
      </div> */}
      {/* <LiveTemplate /> */}
    </div>
  );
}
