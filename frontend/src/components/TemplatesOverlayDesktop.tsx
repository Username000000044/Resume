import {
	FileDigit,
	Funnel,
	RefreshCcwIcon,
	Search,
	Shredder,
} from "lucide-react";
import { type ReactElement, useMemo, useState } from "react";
import type { TemplateData } from "#/types/template-data";
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
	Empty,
	EmptyContent,
	EmptyDescription,
	EmptyHeader,
	EmptyMedia,
	EmptyTitle,
} from "./ui/empty";
import { InputGroup, InputGroupAddon, InputGroupInput } from "./ui/input-group";

interface ComponentProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	trigger: ReactElement;
	templates: TemplateData[];
}

export const TemplatesOverlayDesktop = ({
	open,
	setOpen,
	trigger,
	templates,
}: ComponentProps) => {
	const [searchTerm, setSearchTerm] = useState("");

	const filteredTemplates = useMemo(() => {
		return templates.filter((template) =>
			template.name.toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [templates, searchTerm]);

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
						<FileDigit size={16} /> ATS READABILITY VARIES ON RESUME
					</DialogDescription>
				</DialogHeader>

				<div className="flex gap-4">
					<div className="relative">
						<Button size="lg" className="shadow-md">
							<Funnel /> Filters{" "}
						</Button>

						<Badge variant="secondary" className="absolute -top-2 -right-2">
							2
						</Badge>
					</div>

					{/* TODO: Have # of filters applied within the button */}

					<InputGroup className="h-full max-w-xs">
						<InputGroupInput
							placeholder="Search..."
							value={searchTerm}
							onChange={(e) => setSearchTerm(e.target.value)}
						/>
						<InputGroupAddon>
							<Search />
						</InputGroupAddon>
					</InputGroup>
				</div>

				{filteredTemplates.length !== 0 ? (
					<div className="grid grid-cols-5 gap-6">
						{filteredTemplates.map((template) => (
							<img
								src={template.thumbnail}
								key={template.template_id}
								alt="Template Thumbnail"
								className="aspect-[8/11] w-50 cursor-pointer transition ease hover:scale-105 duration-400"
							/>
						))}
					</div>
				) : (
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
				)}
			</DialogContent>
		</Dialog>
	);
};
