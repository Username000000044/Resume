import { useEffect, useState, type ReactElement } from "react";
import { useMediaQuery } from "#/hooks/useMediaQuery";
import { useQuery } from "@tanstack/react-query";
import { trpc } from "#/utils/trpc";
import { Dialog, DialogContent, DialogTrigger } from "./ui/dialog";
import { TemplatesGallery } from "./TemplatesGallery";
import {
  Empty,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from "./ui/empty";
import { Funnel, Search, Shredder } from "lucide-react";
import { TemplatesSelection } from "./TemplatesSelection";
import {
  Drawer,
  DrawerContent,
  DrawerDescription,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "./ui/drawer";
import { Button } from "./ui/button";
import { TemplatesCarousel } from "./TemplatesCarousel";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { InputGroup, InputGroupInput, InputGroupAddon } from "./ui/input-group";
import { useSelectTemplateRedirect } from "#/hooks/useSelectTemplateRedirect";
import { useTemplateStore } from "#/store/useTemplateStore";
import { useShallow } from "zustand/react/shallow";

export const TemplatesOverlay = ({ trigger }: { trigger: ReactElement }) => {
  const { data } = useQuery(trpc.templatesList.queryOptions());
  const { redirect } = useSelectTemplateRedirect();

  const [open, setOpen] = useState(false);
  const { selectedTemplate, setSelectedTemplate } = useTemplateStore(
    useShallow((state) => ({
      selectedTemplate: state.selectedTemplate,
      setSelectedTemplate: state.setSelectedTemplate,
    })),
  );

  const isDesktop = useMediaQuery("(min-width: 1024px)"); // Tailwind lg media query

  useEffect(() => {
    // Set a default template once data loads if none is selected yet
    if (data && data.length > 0 && !selectedTemplate) {
      return setSelectedTemplate(data[0]);
    }
  }, [data, selectedTemplate, setSelectedTemplate]);

  if (!data) {
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={trigger} />
        <DialogContent showCloseButton={false}>
          <Empty className="h-full bg-muted">
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <Shredder />
              </EmptyMedia>
              <EmptyTitle>No Templates</EmptyTitle>
              <EmptyDescription className="max-w-xs">
                We&apos;re out of stock. Don&apos;t worry, we&apos;ve already
                put in another order.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
        </DialogContent>
      </Dialog>
    );
  }

  if (isDesktop)
    return (
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogTrigger render={trigger} />
        <DialogContent
          showCloseButton={false}
          className="bg-transparent shadow-none p-0 ring-0 flex gap-0 min-w-2/3 max-h-2/3"
        >
          <Card className="p-10 rounded-r-none">
            <CardHeader>
              <CardTitle className="text-5xl font-bold text-primary">
                Select Template
              </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-1 min-h-0">
              {/* Filters */}
              <div className="flex gap-4">
                <Button variant="outline">
                  <Funnel /> Filters
                </Button>
                <InputGroup className="h-full max-w-xs">
                  <InputGroupInput placeholder="Search..." />
                  <InputGroupAddon>
                    <Search />
                  </InputGroupAddon>
                </InputGroup>
              </div>

              {/* Templates  */}
              <TemplatesGallery data={data} />
            </CardContent>
          </Card>

          {/* Templates Selection */}
          <TemplatesSelection />
        </DialogContent>
      </Dialog>
    );

  return (
    <Drawer open={open} onOpenChange={setOpen}>
      <DrawerTrigger asChild>{trigger}</DrawerTrigger>
      <DrawerContent className="py-12 before:border-none before:inset-0">
        <DrawerHeader>
          <DrawerTitle className="text-4xl font-bold">
            {selectedTemplate?.name}
          </DrawerTitle>
          <DrawerDescription>
            by{" "}
            <span className="underline">
              {selectedTemplate?.ownerId || "Resume"}
            </span>
          </DrawerDescription>
        </DrawerHeader>

        <div className="mt-8 mb-12">
          <TemplatesCarousel data={data} />
        </div>

        <Button
          className="mx-auto w-3/4 cursor-pointer"
          size="lg"
          onClick={() => redirect(selectedTemplate?.id)}
        >
          Customize this template
        </Button>
      </DrawerContent>
    </Drawer>
  );
};
