import type { inferRouterOutputs } from "@trpc/server";
import type { AppRouter } from "../../../backend/src/appRouter";
import { Button } from "./ui/button";
import { Funnel } from "lucide-react";


interface GalleryProps {
  data: inferRouterOutputs<AppRouter>["templatesList"];
}


export const TemplatesOverlayGallery = ({ data }: GalleryProps) => {

  return <div className="mt-4">
    <Button size="lg" className="font-normal shadow-md"><Funnel /> Filters</Button>

    {/* <div className="grid grid-cols-4">
      {data.map((template) => (
        <img src={template.thumbnail} alt="Template Thumbnail" key={template.id} className="aspect-[8/11]"/> 
      ))}
    </div>     */}

  </div>
};
