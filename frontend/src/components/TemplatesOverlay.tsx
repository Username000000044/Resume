import {
	FileDigit,
	Funnel,
	RefreshCcwIcon,
	Search,
	Shredder,
} from "lucide-react";
import { type ReactElement, useState } from "react";
import { useMediaQuery } from "#/hooks/useMediaQuery";
import { Badge } from "./ui/badge";
import { Button } from "./ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
	DialogTrigger,
} from "./ui/dialog";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "./ui/drawer";
import {
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "./ui/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

interface componentProps {
	trigger: ReactElement;
}

export const TemplatesOverlay = ({ trigger }: componentProps) => {
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 1024px)"); // Tailwind lg media query

	const templates: string[] = ["temppaltes"];

	if (isDesktop)
		return (
			<Dialog open={open} onOpenChange={setOpen}>
				<DialogTrigger render={trigger}>Show Dialog</DialogTrigger>
				<DialogContent
					showCloseButton={false}
					className="!min-w-max max-h-[40rem] overflow-scroll p-12"
				>
					<DialogHeader>
						<DialogTitle className="text-center text-primary text-5xl font-bold">
							Select Template
						</DialogTitle>
						<DialogDescription className="flex gap-2 items-center justify-center text-secondary/50">
							<FileDigit size={16} /> ATS SCORE VARIES ON RESUME
						</DialogDescription>
					</DialogHeader>

					{templates.length ? (
						<>
							<div className="flex gap-4">
								<div className="relative">
									<Button size="lg" variant="secondary" className="shadow-md">
										<Funnel /> Filters{" "}
									</Button>

									<Badge className="absolute -top-2 -right-2">2</Badge>
								</div>

								{/* TODO: Have # of filters applied within the button */}

								<InputGroup className="h-full max-w-xs">
									<InputGroupInput placeholder="Search..." />
									<InputGroupAddon>
										<Search />
									</InputGroupAddon>
								</InputGroup>
							</div>

							<div className="grid grid-cols-5 gap-6">
								<div className="aspect-[8/11] w-50 bg-primary/10"></div>
								<div className="aspect-[8/11] w-50 bg-primary/10"></div>
								<div className="aspect-[8/11] w-50 bg-primary/10"></div>
								<div className="aspect-[8/11] w-50 bg-primary/10"></div>

								<div className="aspect-[8/11] w-50 bg-primary/10"></div>
								<div className="aspect-[8/11] w-50 bg-primary/10"></div>
								<div className="aspect-[8/11] w-50 bg-primary/10"></div>
								<div className="aspect-[8/11] w-50 bg-primary/10"></div>

								<div className="aspect-[8/11] w-50 bg-primary/10"></div>
								<div className="aspect-[8/11] w-50 bg-primary/10"></div>
								<div className="aspect-[8/11] w-50 bg-primary/10"></div>
								<div className="aspect-[8/11] w-50 bg-primary/10"></div>
							</div>
						</>
					) : (
						<Empty className="h-full bg-secondary">
							<EmptyHeader>
								<EmptyMedia variant="icon">
									<Shredder />
								</EmptyMedia>
								<EmptyTitle className="text-secondary-foreground">
									No Templates
								</EmptyTitle>
								<EmptyDescription className="max-w-xs text-secondary-foreground/50">
									We&apos;re out of stock. We&apos;ve already put in an order.
								</EmptyDescription>
							</EmptyHeader>
							<EmptyContent>
								<Button variant="outline" className="w-full">
									<RefreshCcwIcon data-icon="inline-start" />
									Refresh
								</Button>
							</EmptyContent>
						</Empty>
					)}
				</DialogContent>
			</Dialog>
		);

	return (
		<Drawer open={open} onOpenChange={setOpen}>
			<DrawerTrigger asChild>{trigger}</DrawerTrigger>
			<DrawerContent>
				<DrawerHeader>
					<DrawerTitle>Are you absolutely sure?</DrawerTitle>
					<DrawerDescription>This action cannot be undone.</DrawerDescription>
				</DrawerHeader>
			</DrawerContent>
		</Drawer>
	);
};
