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
            <CardHeader>
              <CardTitle>{section.title}</CardTitle>
              <CardDescription>Card Description</CardDescription>
            </CardHeader>
            <CardContent>
              <p>Card Content</p>
            </CardContent>
            <CardFooter>
              <p>Card Footer</p>
            </CardFooter>
          </Card>
        </TabsContent>
      ))}
    </Tabs>
  );
};
