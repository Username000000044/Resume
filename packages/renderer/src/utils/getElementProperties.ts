import { scalePresetMap } from "@/constants";
import { fieldRenderRoleEnum } from "@resume/backend/src/db/schema.js";
import { type FieldType, TemplateConfig } from "@resume/frontend/src/types/trpc";

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

    const preset = scalePresetMap[config.theme.typography.preset];

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