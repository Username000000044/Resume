import type { ComponentType } from "react";
import { SpacingConfig } from "./SpacingConfig";
import { ConfigCardItem } from "./ConfigCardItem";
import { TypographyConfig } from "./TypographyConfig";
import { DecorationsConfig } from "./DecorationsConfig";

interface ConfigItem {
  id: string;
  name: string;
  component: ComponentType;
  order: number;
}

const configItems: ConfigItem[] = [
  {
    id: "global_spacing",
    name: "Global Spacing",
    component: SpacingConfig,
    order: 1,
  },
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
  return (
    <div className="flex flex-col gap-4 min-w-full lg:w-120">
      {configItems
        .sort((a, b) => a.order - b.order)
        .map((configItem) => (
          <ConfigCardItem
            key={configItem.id}
            header={null}
            content={<configItem.component />}
          />
        ))}
    </div>
  );
};
