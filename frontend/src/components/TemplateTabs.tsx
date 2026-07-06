import { notFound, useParams } from "@tanstack/react-router";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { trpc } from "#/utils/trpc";
import { useSuspenseQuery } from "@tanstack/react-query";
import { Field, FieldLabel, FieldLegend, FieldTitle } from "./ui/field";
import { Input } from "./ui/input";
import clsx from "clsx";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";

export const TemplateTabs = () => {
  const { templateId } = useParams({ from: "/create/$templateId" });
  const { data, error } = useSuspenseQuery(
    trpc.templatesById.queryOptions(templateId),
  );

  if (error) return notFound();

  return (
    <Tabs defaultValue="account" className="w-100 gap-0">
      <TabsList className="bg-transparent gap-4 px-2 py-0">
        {data.sections.map((section) => (
          <TabsTrigger
            className="cursor-pointer px-3 rounded-b-none font-normal data-active:bg-primary data-active:text-primary-foreground data-active:hover:text-primary-foreground"
            value={section.title}
            key={section.id}
          >
            {section.title.charAt(0).toUpperCase() +
              section.title.slice(1).toLowerCase()}
          </TabsTrigger>
        ))}
      </TabsList>
      {data.sections.map((section) => (
        <TabsContent value={section.title} key={section.id}>
          <Card>
            <CardContent className="grid grid-cols-4 gap-2">
              {section.fields.map((field) => (
                <Field
                  key={field.id}
                  className={clsx("col-span-full gap-0", {
                    "col-span-2": field.type === "date",
                  })}
                >
                  <FieldLabel className="font-normal">{field.name}</FieldLabel>
                  <Input
                    type={field.type}
                    placeholder={field.placeholder || undefined}
                  ></Input>
                </Field>
              ))}

              {/* Bullets  */}
              <Button
                variant="outline"
                size="xs"
                className="col-span-full w-25 mt-6 mb-2"
              >
                <Plus /> Add Bullet
              </Button>
              {/* <Field className="gap-0 col-span-3">
                <div className="flex justify-between">
                  <FieldLabel className="font-normal">Bullet 1</FieldLabel>
                  <Button variant="link" className="font-normal p-0 text-xs">
                    + Sub Bullet
                  </Button>
                </div>
                <Input type="text"></Input>
              </Field>

              <Field className="gap-0 col-span-2">
                <FieldLabel className="font-normal">Sub Bullet</FieldLabel>
                <Input type="text"></Input>
              </Field> */}
            </CardContent>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};
