import { type ReactElement, useEffect, useState } from "react";
import { useMediaQuery } from "#/hooks/useMediaQuery";
import type { TemplateData } from "#/types/template-data";
import { TemplatesOverlayMobile } from "./TemplatesDrawerMobile";
import { TemplatesOverlayDesktop } from "./TemplatesOverlayDesktop";

interface ComponentProps {
	trigger: ReactElement;
}

export const TemplatesOverlay = ({ trigger }: ComponentProps) => {
	const [open, setOpen] = useState(false);
	const isDesktop = useMediaQuery("(min-width: 1024px)"); // Tailwind lg media query
	const [templates, setTemplates] = useState<TemplateData[]>([]);

	useEffect(() => {
		const templateFiles = import.meta.glob<TemplateData>("../data/*.json", {
			eager: true,
		});
		const combinedData: TemplateData[] = Object.values(templateFiles);
		setTemplates(combinedData);
	}, []);

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
