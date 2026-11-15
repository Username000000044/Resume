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
import { useSaveStatusStore } from "#/store/uesSaveStatusStore";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import { Box, ChevronsLeftRightEllipsis, Download, Folder, FolderX, LayersArrowDown, RefreshCcw, Settings, Settings2, SquareChevronDown } from "lucide-react";
import { useShallow } from "zustand/react/shallow";
import { DownloadResume } from "./ExportResume";
import type { TemplateType } from "#/types/trpc";
import { Field, FieldGroup, FieldLabel } from "#/components/ui/field";
import { Checkbox } from "#/components/ui/checkbox";
import { cn } from "#/lib/utils";
import { Separator } from "#/components/ui/separator";
import { useResumePreferencesStore } from "#/store/useResumePreferencesStore";
import { useState } from "react";

interface PreviewHeaderProps {
  pagesMatrix: string[][],
  templateData: TemplateType,
}

export const PreviewHeader = ({ pagesMatrix, templateData }: PreviewHeaderProps) => {
  const status = useSaveStatusStore((store) => store.status);
  const { pagination, updatePreference } = useResumePreferencesStore(
    useShallow((store) => ({
      pagination: store.preferences.pagination,
      updatePreference: store.updatePreference
    }))
  )
  const { mode, setMode } = useResumeConfigStore(
    useShallow((state) => ({
      mode: state.mode,
      setMode: state.setMode,
    })),
  );

  const [paginationState, setPaginationState] = useState(pagination);


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
          <DownloadResume pagesMatrix={pagesMatrix} templateData={templateData} />
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
          {mode === "preview" ? (
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
            mode === "preview" ? setMode("editor") : setMode("preview")
          }
        />

        <Popover>
          <PopoverTrigger
            render={
              <Button
                variant="ghost"
                className="font-normal p-0 h-min hover:cursor-pointer hover:bg-transparent aria-expanded:bg-transparent"
              >
                <Settings2 size={16} aria-hidden="true" />
              </Button>
            }
          >
          </PopoverTrigger>
          <PopoverContent className="gap-0" align="center">
            <PopoverHeader className="mb-3">
              <PopoverTitle>Preferences</PopoverTitle>
            </PopoverHeader>

            <div className="flex flex-col rounded-2xl overflow-clip gap-2">
              <button
                key={crypto.randomUUID()}
                className={cn("flex items-center gap-4 h-full p-2 cursor-pointer w-full hover:bg-muted", {
                  "bg-input/50 hover:bg-input/50": pagination,
                })}
                onClick={() => {
                  updatePreference("pagination", paginationState);
                  setPaginationState(!paginationState);
                }}
              >
                <LayersArrowDown strokeWidth={1.5} />
                <div className="text-left">
                  <div className="flex items-center gap-2">
                    <h2 className="font-medium">Pagination</h2>
                  </div>
                </div>
              </button>

            </div>

          </PopoverContent>
        </Popover>
      </div>
    </div>
  );
};
