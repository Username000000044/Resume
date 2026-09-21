import type { ComponentType } from "react";
import { SpacingConfig } from "./SpacingConfig";
import { ConfigCardItem } from "./ConfigCardItem";
import { TypographyConfig } from "./TypographyConfig";
import { DecorationsConfig } from "./DecorationsConfig";
import { RefreshCcw, RotateCcw, Trash } from "lucide-react";
import { Button } from "#/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "#/components/ui/dialog";
import { Label } from "#/components/ui/label";
import { Input } from "#/components/ui/input";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import { useShallow } from "zustand/react/shallow";

interface ConfigItem {
  id: string;
  name: string;
  component: ComponentType;
  order: number;
}

const configItems: ConfigItem[] = [
  // {
  //   id: "global_spacing",
  //   name: "Global Spacing",
  //   component: SpacingConfig,
  //   order: 1,
  // },
  {
    id: "typography",
    name: "Typography",
    component: TypographyConfig,
    order: 2,
  },
  {
    id: "decorations",
    name: "Decorations",
    component: DecorationsConfig,
    order: 3,
  },
  // {
  //     id: "groups",
  //     name: "Groups",
  //     component: GroupsConfig,
  //     order: 4,
  // },
];

export const ConfigItems = () => {
  const resetConfig = useResumeConfigStore((store) => store.resetConfig);

  return (
    <div className="flex flex-col gap-4 min-w-full lg:w-120">
      {configItems
        .sort((a, b) => a.order - b.order)
        .map((configItem) => (
          <ConfigCardItem
            key={configItem.id}
            content={<configItem.component />}
          />
        ))}

      {/* Reset Configuration */}
      <div className="flex justify-center mt-4">
        <Dialog>
          <DialogTrigger
            render={
              <Button
                size="icon-lg"
                variant="ghost_destructive"
                className="border-none shadow-sm ring-1 ring-foreground/5 cursor-pointer bg-background"
                onClick={() => null}
              >
                <RefreshCcw />
              </Button>
            }
          />
          <DialogContent
            className="sm:max-w-md text-center"
            showCloseButton={false}
          >
            <DialogHeader>
              <DialogTitle className="text-2xl">Confirm Reset</DialogTitle>
              <DialogDescription>
                Are you sure you want to reset the template configuration?
                Deleting it will erase all{" "}
                <span className="font-bold">config mode</span> customization.
              </DialogDescription>
            </DialogHeader>
            <DialogFooter>
              <DialogClose
                render={
                  <Button
                    className="w-full cursor-pointer"
                    variant="destructive"
                    onClick={resetConfig}
                  >
                    <RefreshCcw /> Reset
                  </Button>
                }
              />
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
};
