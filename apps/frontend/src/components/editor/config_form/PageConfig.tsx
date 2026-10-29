import { Field, FieldLabel } from "#/components/ui/field";
import { PAGE_MARGIN_SCRUBBER } from "#/limits";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import { pageSizeMap } from "@resume/renderer/constants";
import { NumberScrubberInputItem } from "./NumberScrubberInputItem";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "#/components/ui/select";
import { useShallow } from "zustand/react/shallow";
import { useState } from "react";
import { Toggle } from "#/components/ui/toggle";
import { ChevronsLeftRightEllipsis } from "lucide-react";

interface Item {
  label: string;
  value: string;
}

const pageSizes: Item[] = Object.keys(pageSizeMap).map((size) => ({
  label: size.charAt(0).toUpperCase() + size.slice(1),
  value: size,
}));

export const PageConfig = () => {
  const { pagination, pageSize, defaultPageMargin, updateProperty } = useResumeConfigStore(
    useShallow((store) => ({
      pageSize: store.config.template.pageSize,
      pagination: store.config.template.pagination,
      defaultPageMargin: store.defaultConfig.template.spacing.page_margin,
      updateProperty: store.updateProperty,
    })),
  );

  const [selectedPageSize, setSelectedPageSize] = useState(pageSize);
  const [pagePagination, setPagePagination] = useState(pagination);

  return (
    <>
      <Field className="col-span-2 gap-0">
        <FieldLabel className="font-normal">Page Margin</FieldLabel>
        <NumberScrubberInputItem
          hasIcon={true}
          iconOrientation="horizontal"
          path={["template", "spacing", "page_margin"]}
          config={{ step: PAGE_MARGIN_SCRUBBER.STEP, min: PAGE_MARGIN_SCRUBBER.MIN, max: PAGE_MARGIN_SCRUBBER.MAX }}
          defaultValue={defaultPageMargin} />
      </Field>
      <Field className="col-span-2 gap-0">
        <FieldLabel className="font-normal">Page Size</FieldLabel>
        <Select
          items={pageSizes}
          value={selectedPageSize}
          onValueChange={(value) => {
            if (!value) return;

            setSelectedPageSize(value);
            updateProperty(["template", "pageSize"], value);
          }}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Theme" />
          </SelectTrigger>
          <SelectContent>
            <SelectGroup>
              {pageSizes.map((item) => (
                <SelectItem key={item.value} value={item.value}>
                  {item.label}
                </SelectItem>
              ))}
            </SelectGroup>
          </SelectContent>
        </Select>
      </Field>
      <div className="col-span-2 flex items-end justify-end">
        {/* Header Toggle */}
        <Toggle
          className="aria-pressed:bg-input/50 font-normal cursor-pointer"
          aria-label="Toggle Header Divider"
          pressed={pagePagination}
          onPressedChange={(pressed) => {
            updateProperty(
              ["template", "pagination"],
              pressed,
            );
            setPagePagination(pressed);
          }}

        >
          <ChevronsLeftRightEllipsis className="rotate-90" />
        </Toggle>

      </div >
    </>
  );
};
