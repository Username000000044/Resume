import { Button } from "#/components/ui/button";
import { Label } from "#/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "#/components/ui/popover";
import { Switch } from "#/components/ui/switch";
import { useSaveStatusStore } from "#/store/uesSaveStatusStore";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import { useResumeSectionsStore } from "#/store/useResumeSectionsStore";
import { Download, Folder, FolderX, RefreshCcw } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { DownloadResume } from "./DownloadResume";


export const PreviewHeader = ({ pagesMatrix }: { pagesMatrix: string[][] }) => {
  const config = useResumeConfigStore((store) => store.config);
  const sections = useResumeSectionsStore((store) => store.sections);
  const status = useSaveStatusStore((store) => store.status);
  const { liveMode, setLiveMode } = useResumeConfigStore(
    useShallow((state) => ({
      liveMode: state.liveMode,
      setLiveMode: state.setLiveMode,
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
          <DownloadResume config={config} sections={sections} pagesMatrix={pagesMatrix} />
        </PopoverContent>
      </Popover>

      {/* Resume data unsaved */}
      {status === "unsaved" && (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <FolderX size={14} />{" "}
          <p>
            Unsaved <span className="italic">(localstorage)</span>
          </p>
        </div>
      )}

      {/* Resume data in storage */}
      {status === "saved" && (
        <div className="flex items-center gap-1.5 text-muted-foreground">
          <Folder size={14} />{" "}
          <p>
            Saved <span className="italic">(localstorage)</span>
          </p>
        </div>
      )}

      {/* Resume data being saved into storage */}
      {status === "saving" && (
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
