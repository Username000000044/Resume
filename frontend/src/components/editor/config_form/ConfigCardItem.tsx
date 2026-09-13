import {
  Card,
  CardAction,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "#/components/ui/card";
import type { ReactNode } from "react";

interface ConfigCardTypes {
  header?: {
    title: string;
    description: string;
    action: ReactNode;
  };
  content: ReactNode;
}

export const ConfigCardItem = ({ header, content }: ConfigCardTypes) => {
  return (
    <Card>
      {header && (
        <CardHeader>
          <CardTitle>{header?.title}</CardTitle>
          <CardDescription>{header?.description}</CardDescription>
          <CardAction>{header?.action}</CardAction>
        </CardHeader>
      )}
      <CardContent className="grid grid-cols-2 w-full gap-3">
        {content}
      </CardContent>
    </Card>
  );
};
