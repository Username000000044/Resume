import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import type { ReactNode } from "react";

interface ConfigCardProps extends Omit<
  React.ComponentPropsWithoutRef<typeof Card>,
  "content"
> {
  header?: ReactNode;
  content: ReactNode;
}

export const ConfigCardItem = ({
  header,
  content,
  className,
  ...props
}: ConfigCardProps) => {
  return (
    <Card className={className} {...props}>
      {header && <CardHeader className="">{header}</CardHeader>}
      <CardContent className="grid grid-cols-2 w-full gap-3">
        {content}
      </CardContent>
    </Card>
  );
};
