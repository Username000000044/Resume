import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../backend/src/appRouter";
import { Button } from "./ui/button";
import { Funnel, Search } from "lucide-react";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";
import clsx from "clsx";
import { useSelectedTemplateStore } from "#/store/templatesStore";
import { useStore } from "zustand";

interface GalleryProps {
  data: inferRouterOutputs<AppRouter>["templatesList"];
}

export const TemplatesOverlayGallery = ({ data }: GalleryProps) => {
  const selectedTemplate = useStore(
    useSelectedTemplateStore,
    (state) => state.selectedTemplate,
  );
  const setSelectedTemplate = useStore(
    useSelectedTemplateStore,
    (state) => state.setSelectedTemplate,
  );

  return (
    <div className="mt-4">
      <div className="flex gap-4">
        <Button variant="outline">
          <Funnel /> Filters
        </Button>
        <InputGroup className="h-full max-w-xs">
          <InputGroupInput placeholder="Search..." />
          <InputGroupAddon>
            <Search />
          </InputGroupAddon>
        </InputGroup>
      </div>

      <div className="grid grid-cols-4 mt-12 gap-6">
        {data.map((template) => (
          <button
            type="button"
            key={template.id}
            onClick={() => setSelectedTemplate(template)}
          >
            <img
              src={template.thumbnail}
              alt="Template Thumbnail"
              className={clsx(
                "aspect-[8/11] shadow-md transition duration-400 cursor-pointer",
                {
                  "border-2": template.id === selectedTemplate?.id,
                },
              )}
            />
          </button>
        ))}
      </div>
    </div>
  );
};
