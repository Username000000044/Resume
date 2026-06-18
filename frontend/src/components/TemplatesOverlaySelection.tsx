import { Book } from "lucide-react";
import { Button } from "./ui/button";
import { useStore } from "zustand";
import { useSelectedTemplateStore } from "#/store/templatesStore";

export const TemplatesOverlaySelection = () => {
  const selectedTemplate = useStore(
    useSelectedTemplateStore,
    (state) => state.selectedTemplate,
  );

  return (
    <div className="flex flex-col gap-8 justify-center bg-popover p-12 rounded-r-4xl shadow-md w-150">
      <div>
        <h3 className="text-4xl font-bold text-primary text-nowrap truncate">
          {selectedTemplate?.name}
        </h3>
        <p className="text-muted-foreground">
          Resume (Portrait) &nbsp; 8.5 x 11 in
        </p>
      </div>
      <div className="flex items-center gap-4">
        <div className="bg-primary rounded-full size-8 flex justify-center items-center text-primary-foreground">
          <Book size={18} />
        </div>
        <p className="text-muted-foreground">
          by <span className="underline">{selectedTemplate?.author}</span>
        </p>
      </div>

      <img
        className="aspect-[8/11] border border-primary/10"
        src={selectedTemplate?.thumbnail}
        alt="Template Thumbnail"
      ></img>

      <Button size="lg">Customize this template</Button>
    </div>
  );
};
