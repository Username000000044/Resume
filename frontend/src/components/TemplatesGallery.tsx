import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../backend/src/appRouter";
import clsx from "clsx";
import { useTemplateStore } from "#/store/templatesStore";

interface GalleryProps {
  data: inferRouterOutputs<AppRouter>["templatesList"];
}

export const TemplatesGallery = ({ data }: GalleryProps) => {
  const selectedTemplate = useTemplateStore((state) => state.selectedTemplate);
  const setSelectedTemplate = useTemplateStore(
    (state) => state.setSelectedTemplate,
  );

  return (
    <div className="overflow-y-auto h-full my-12 pr-8 py-1">
      <div className="grid md:grid-cols-2 2xl:grid-cols-3 gap-4">
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
