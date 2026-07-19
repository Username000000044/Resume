import { Book } from "lucide-react";
import { Button } from "./ui/button";
import { useSelectedTemplateStore } from "#/store/useSelectedTemplateStore";
import { useSelectTemplateRedirect } from "#/hooks/useSelectTemplateRedirect";

export const TemplatesSelection = () => {
  const selectedTemplate = useSelectedTemplateStore(
    (state) => state.selectedTemplate,
  );

  const { redirect } = useSelectTemplateRedirect();

  return (
    <div className="flex flex-col gap-8 justify-center bg-popover p-12 rounded-4xl scale-102 shadow-md w-full max-w-100">
      <div>
        <h3 className="text-4xl font-bold text-nowrap truncate">
          {selectedTemplate?.name}
        </h3>
        <p className="text-muted-foreground">
          Resume (Portrait) &nbsp; 8.5 x 11 in
        </p>
      </div>
      <div className="flex items-center gap-4 text-muted-foreground">
        <div className="bg-primary rounded-full size-8 flex justify-center items-center text-primary-foreground">
          <Book size={18} />
        </div>
        <p>
          by <span className="underline">{selectedTemplate?.ownerId}</span>
        </p>
      </div>

      <img
        className="aspect-[8/11] border border-primary/10"
        src={selectedTemplate?.thumbnail}
        alt="Template Thumbnail"
      ></img>

      <Button
        size="lg"
        className="cursor-pointer"
        onClick={() => redirect(selectedTemplate?.id)}
      >
        Customize this template
      </Button>
    </div>
  );
};
