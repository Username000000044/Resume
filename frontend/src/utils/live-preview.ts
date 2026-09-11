import { SCALE_CURVES } from "#/components/editor/live_preview/LivePreview";
import type { FieldType, TemplateConfig } from "#/types/Template";

export const getFieldProperties = (
	field: FieldType,
	liveTemplateConfig: TemplateConfig,
) => {
	const fieldRole = field.renderRole;
	const fieldWeight =
		liveTemplateConfig.theme.typography.font_weight[fieldRole];
	const fieldColor = liveTemplateConfig.theme.colors[fieldRole];
	const FieldElement = liveTemplateConfig.elements[fieldRole] ?? "p";

	// Field Size
	const font_size_base = liveTemplateConfig.theme.typography.font_size_base;
	const scale_curve =
		SCALE_CURVES[liveTemplateConfig.theme.typography.scale_curve];
	const fieldSize = scale_curve[FieldElement] * font_size_base;

	return {
		fieldRole,
		fieldSize,
		fieldColor,
		fieldWeight,
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
