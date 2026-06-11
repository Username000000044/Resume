interface Alignment {
	header: "left" | "center" | "right";
	section_titles: "left" | "center" | "right";
	body: "left" | "center" | "right";
}

interface Decorations {
	section_divider: "present" | "none";
	date_style: "right-aligned" | "inline" | string;
}

interface Theme {
	typography: {
		font_family: string;
		font_size_base: string;
	};
	colors: {
		primary: string;
		secondary: string;
	};
}

interface DefaultConfig {
	alignment: Alignment;
	decorations: Decorations;
	theme: Theme;
	default_section_order: string[];
}

export interface TemplateData {
	template_id: string;
	name: string;
	thumbnail: string;
	keywords: string[];
	default_config: DefaultConfig;
}
