import { Field, FieldLabel } from "#/components/ui/field";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import { NumberScrubberItem } from "./NumberScrubberItem";

export const SpacingConfig = () => {
  const defaultPageMargin = useResumeConfigStore(
    (store) => store.defaultConfig.template.spacing.page_margin,
  );

  return (
    <Field className="col-span-full gap-0">
      <FieldLabel className="font-normal">Page Margin</FieldLabel>
      <NumberScrubberItem
        path={["templateConfig", "spacing", "page_margin"]}
        config={{ step: 0.01, min: 0, max: 2 }}
        defaultValue={defaultPageMargin}
      />
    </Field>
  );
};
