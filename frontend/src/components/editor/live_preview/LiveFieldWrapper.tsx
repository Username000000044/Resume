import type { FieldType } from "#/types/Template";
import type { ReactNode } from "react";

interface LiveGroupProps {
  field: FieldType;
  value: string;
  children: ReactNode;
}

const seperatorMap = {
  dot: "·",
  bullet: "•",
  pipe: "|",
  comma: ",",
  slash: "/",
  none: "",
};

export const LiveFieldWrapper = ({
  field,
  value,
  children,
}: LiveGroupProps) => {
  if (!value) return;

  const group = field.group;
  if (!group || group.separator === "none") return <>{children}</>;

  return (
    <span
      key={field.id}
      className="inline-flex items-center after:content-[attr(data-separator)] after:px-[var(--separator-gap)] last:after:content-none"
      data-separator={seperatorMap[group.separator]}
    >
      {children}
    </span>
  );
};
