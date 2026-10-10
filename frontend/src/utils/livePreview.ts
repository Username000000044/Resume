import { PRESET_MAP } from "#/components/editor/live_preview/LivePagePreview";
import type { Dimensions } from "#/store/useResumeDimensionsStore";
import type { FieldType, TemplateConfig } from "#/types/Template";
import type { fieldRenderRoleEnum } from "@resume/backend/src/db/schema.js";

type FieldRole = (typeof fieldRenderRoleEnum.enumValues)[number];
export const getElementProperties = (
	type: "field" | "bullet" | "title",
	config: TemplateConfig,
	field?: FieldType,
) => {
	let fieldRole: FieldRole;
	if (type === "field") {
		fieldRole = field?.renderRole ?? "body";
	} else if (type === "bullet") {
		fieldRole = "bullet";
	} else {
		fieldRole = "section_title";
	}

	const preset = PRESET_MAP[config.theme.typography.preset];

	// const fieldRole = field.renderRole;
	const fieldWeight = config.theme.typography.font_weight[fieldRole];
	const fieldColor = config.theme.colors[fieldRole];
	const FieldElement = config.elements[fieldRole] ?? "p";

	// Font
	const fontVariant =
		config.theme.typography.font_family[fieldRole] ?? "primary";

	// Field Size
	const fontSizeBase = config.theme.typography.font_size_base;
	const fieldSize = preset.scale_curve[FieldElement] * fontSizeBase;

	// Leading
	const fieldHeight = preset.line_height[FieldElement];

	return {
		fieldRole,
		fieldWeight,
		fieldSize,
		fieldColor,
		fieldHeight,
		fontVariant,
		FieldElement,
	};
};

export const constructLayoutMatrix = (fields: FieldType[]) => {
	const matrix: FieldType[][] = [];

	for (const field of fields) {
		// Fallback for missing layout metadata
		const rowIndex = field.alignment?.rowIndex ?? 0;

		// Ensure nested row array exists
		if (!matrix[rowIndex]) {
			matrix[rowIndex] = [];
		}

		matrix[rowIndex].push(field);
	}

	// Remove empty gaps and sort row by interOrder horizontally
	return matrix
		.filter(Boolean)
		.map((row) =>
			row.sort(
				(a, b) => (a.alignment?.itemOrder ?? 0) - (b.alignment?.itemOrder ?? 0),
			),
		);
};

export const constructPagesMatrix = (
	maxPageHeight: number,
	sectionDimensions: Record<string, Dimensions>,
	sectionIds: string[],
	sectionGap: number = 0
) => {
	const matrix: string[][] = [];
	let currentPage: string[] = [];
	let currentPageHeight = 0;

	// GUARD: If the store hasn't captured dimensions for all visible sections yet,
	// treat it as an initial loading state to avoid calculating broken layout matrices.
	const missingDimensions = sectionIds.some(id => !sectionDimensions[id] || sectionDimensions[id].height === 0);
	if (missingDimensions) {
		return [sectionIds]; // Return everything on a single provisional page while dimensions load
	}

	for (const sectionId of sectionIds) {
		const sectionHeight = sectionDimensions[sectionId].height;

		const sectionGapTotal = sectionGap * (Object.values(sectionDimensions).length - 1);

		// If a single section is naturally taller than the maximum page boundary, 
		// it must force a page split immediately if there are previous items on the current page.
		if ((sectionHeight + sectionGapTotal + currentPageHeight) > maxPageHeight && currentPage.length > 0) {
			matrix.push(currentPage);
			currentPage = [];
			currentPageHeight = 0;
		}

		currentPage.push(sectionId);
		currentPageHeight += sectionHeight;
	}

	if (currentPage.length > 0) {
		matrix.push(currentPage);
	}

	return matrix;
}
