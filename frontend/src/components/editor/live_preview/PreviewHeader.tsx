import { Badge } from "#/components/ui/badge";
import { Button } from "#/components/ui/button";
import { Label } from "#/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverDescription,
  PopoverHeader,
  PopoverTitle,
  PopoverTrigger,
} from "#/components/ui/popover";
import { Switch } from "#/components/ui/switch";
import type { LiveMode } from "#/routes/create/$templateId";
import { useResumeStore } from "#/store/useResumeStore";
import { Download, Folder, icons, Image, RefreshCcw } from "lucide-react";
import type { Dispatch, SetStateAction } from "react";
import { useShallow } from "zustand/react/shallow";

interface PreviewHeaderProps {
  liveMode: LiveMode;
  setLiveMode: Dispatch<SetStateAction<LiveMode>>;
}

interface DownloadOption {
  name: string;
  description: string;
  suggested?: boolean;
  icon: keyof typeof icons;
}

const downloadOptions: DownloadOption[] = [
  {
    name: "JPG",
    description: "Best for sharing",
    icon: "Image",
  },
  {
    name: "PNG",
    description: "Best for sharing",
    icon: "Image",
  },
  {
    name: "PDF Standard",
    description: "Best for documents (and emailing)",
    icon: "FileText",
    suggested: true,
  },
  {
    name: "PDF Print",
    description: "Best for printing",
    icon: "FileText",
  },
  {
    name: "DOCX",
    description: "Best for enterprise sharing",
    icon: "FileText",
  },
];

export const PreviewHeader = ({
  liveMode,
  setLiveMode,
}: PreviewHeaderProps) => {
  const { persistantMainSections, liveMainSections } = useResumeStore(
    useShallow((state) => ({
      persistantMainSections: state.persistantMainSections,
      liveMainSections: state.liveMainSections,
    })),
  );

  return (
    <div className="flex justify-between items-center text-sm">
      <Popover>
        <PopoverTrigger
          render={
            <Button
              variant="ghost"
              className="font-normal p-0 h-min hover:cursor-pointer hover:bg-transparent aria-expanded:bg-transparent"
            >
              Download <Download size={16} aria-hidden="true" />
            </Button>
          }
        >
          Open Popover
        </PopoverTrigger>
        <PopoverContent className="flex flex-col gap-0 p-0 overflow-hidden cursor-pointer">
          {downloadOptions.map((downloadOption) => {
            const Icon = icons[downloadOption.icon];

            return (
              <div
                key={crypto.randomUUID()}
                className="flex items-center gap-4 h-full p-4 hover:bg-muted"
              >
                <Icon strokeWidth={1.5} />
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h2 className="font-medium">{downloadOption.name}</h2>
                    {downloadOption.suggested && (
                      <Badge className="h-4 text-[.7rem]">ADVISED</Badge>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm">
                    {downloadOption.description}
                  </p>
                </div>
              </div>
            );
          })}
        </PopoverContent>
      </Popover>

      {/* Resume data in storage */}
      {JSON.stringify(persistantMainSections) ===
        JSON.stringify(liveMainSections) && (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Folder size={14} />{" "}
          <p>
            Saved <span className="italic">(localstorage)</span>
          </p>
        </div>
      )}

      {/* Resume data being saved into storage */}
      {JSON.stringify(liveMainSections) !==
        JSON.stringify(persistantMainSections) && (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <RefreshCcw size={14} />{" "}
          <p>
            Saving... (<span className="italic">localstorage</span>)
          </p>
        </div>
      )}

      <div className="flex gap-2 items-center">
        <Label htmlFor="view-mode" className="font-normal cursor-pointer">
          {liveMode === "view" ? (
            <span>View Mode</span>
          ) : (
            <span>Config Mode</span>
          )}
        </Label>
        <Switch
          className="cursor-pointer"
          id="view-mode"
          size="sm"
          onCheckedChange={() =>
            liveMode === "view" ? setLiveMode("config") : setLiveMode("view")
          }
        />
      </div>
    </div>
  );
};
