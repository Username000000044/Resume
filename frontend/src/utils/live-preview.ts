import { PRESET_MAP } from "#/components/editor/live_preview/LivePreview";
import type { FieldType, TemplateConfig } from "#/types/Template";

export const getFieldProperties = (
	field: FieldType,
	templateConfig: TemplateConfig,
) => {
	const preset = PRESET_MAP[templateConfig.theme.typography.preset];

	const fieldRole = field.renderRole;
	const fieldWeight = templateConfig.theme.typography.font_weight[fieldRole];
	const fieldColor = templateConfig.theme.colors[fieldRole];
	const FieldElement = templateConfig.elements[fieldRole] ?? "p";

	// Field Size
	const fontSizeBase = templateConfig.theme.typography.font_size_base;
	const fieldSize = preset.scale_curve[FieldElement] * fontSizeBase;

	// Leading
	const fieldHeight = preset.line_height[FieldElement];

	return {
		fieldRole,
		fieldWeight,
		fieldSize,
		fieldColor,
		fieldHeight,
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
