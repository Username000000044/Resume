import { Book, ScrollText } from "lucide-react";
import { Button } from "./ui/button";

export const TemplatesOverlaySelection = () => {



  return <div className="flex flex-col gap-8 justify-center bg-popover p-12 rounded-r shadow-md min-w-90 max-w-min">
    <div>
        <h3 className="text-4xl font-bold text-primary text-nowrap">Minimal Res...</h3>
        <p className="text-muted-foreground">Resume (Portrait) &nbsp; 8.5 x 11 in</p>
    </div>
    <div className="flex items-center gap-4">
        <div className="bg-primary rounded-full size-8 flex justify-center items-center text-primary-foreground">
            <Book size={18}/>
        </div>
        <p className="text-muted-foreground">by <span className="underline">Resume</span></p>
    </div>

    <img className="aspect-[8/11] border border-primary/10" src="https://i.imgur.com/tC1AFDX.png" alt="Template Thumbnail"></img>
    
    <Button size="lg">Customize this template</Button>

  </div>
};