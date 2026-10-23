import { FieldElement } from "@resume/frontend/src/types/trpc";

export const pageSizeMap = {
    // All measurements in IN
    "A4": { w: 8.27, h: 11.69 },
    "letter": { w: 8.5, h: 11.0 }
} as const;

export const scalePresetMap = {
    editorial: {
        scale_curve: {
            h1: 2.5,
            h2: 1.6,
            h3: 1.25,
            h4: 1.05,
            p: 1,
            span: 1,
            li: 1,
        },
        line_height: {
            h1: 1.05,
            h2: 1.1,
            h3: 1.2,
            h4: 1.35,
            p: 1.5,
            span: 1.5,
            li: 1.5,
        },
    },
    balanced: {
        scale_curve: {
            h1: 2.0,
            h2: 1.35,
            h3: 1.15,
            h4: 1.0,
            p: 1,
            span: 1,
            li: 1,
        },
        line_height: {
            h1: 1.1,
            h2: 1.15,
            h3: 1.25,
            h4: 1.35,
            p: 1.5,
            span: 1.5,
            li: 1.5,
        },
    },
    minimal: {
        scale_curve: {
            h1: 1.5,
            h2: 1.15,
            h3: 1.05,
            h4: 0.95,
            p: 1,
            span: 1,
            li: 1,
        },
        line_height: {
            h1: 1.2,
            h2: 1.25,
            h3: 1.3,
            h4: 1.35,
            p: 1.5,
            span: 1.5,
            li: 1.5,
        },
    },
} as const;

export const separatorMap = {
    dot: "·",
    bullet: "•",
    pipe: "|",
    comma: ",",
    slash: "/",
    none: " ",
} as const;

export const elementNameMap: Record<FieldElement, string> = {
    h1: "Header",
    h2: "Title",
    h3: "Role",
    h4: "Entity",
    p: "Paragraph",
    span: "Metadata",
    li: "Bullet",
} as const;

// Type Exports
export type PageSize = keyof typeof pageSizeMap;
export type Separator = keyof typeof separatorMap;
export type ElementName = keyof typeof elementNameMap;

