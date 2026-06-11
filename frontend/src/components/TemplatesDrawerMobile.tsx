import type { ReactElement } from "react";
import type { TemplateData } from "#/types/template-data";
import {
	Drawer,
	DrawerContent,
	DrawerDescription,
	DrawerHeader,
	DrawerTitle,
	DrawerTrigger,
} from "./ui/drawer";

interface ComponentProps {
	open: boolean;
	setOpen: React.Dispatch<React.SetStateAction<boolean>>;
	trigger: ReactElement;
	templates: TemplateData[];
}

export const TemplatesOverlayMobile = ({
	open,
	setOpen,
	trigger,
	templates,
}: ComponentProps) => {
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
