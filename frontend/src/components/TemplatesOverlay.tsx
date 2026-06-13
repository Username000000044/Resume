import { type ReactElement, useState } from "react";
import { useMediaQuery } from "#/hooks/useMediaQuery";
import { TemplatesOverlayMobile } from "./TemplatesDrawerMobile";
import { TemplatesOverlayDesktop } from "./TemplatesOverlayDesktop";

interface ComponentProps {
	trigger: ReactElement;
}

export const TemplatesOverlay = ({ trigger }: ComponentProps) => {
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 1024px)"); // Tailwind lg media query
	


	const templates: string[] = []

	if (isDesktop)
		return (
			<TemplatesOverlayDesktop
				open={open}
				setOpen={setOpen}
				trigger={trigger}
				templates={templates}
			/>
		);

	return (
		<TemplatesOverlayMobile
			open={open}
			setOpen={setOpen}
			trigger={trigger}
			templates={templates}
		/>
	);
};
