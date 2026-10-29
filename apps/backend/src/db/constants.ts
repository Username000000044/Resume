export const FONT_WEIGHTS = [100, 200, 300, 400, 500, 600, 700, 800, 900] as const;
export const FONT_VARIANTS = ["primary", "secondary"] as const;
export const FONTS_LIST = [
    "inter",
    "roboto",
    "open-sans",
    "montserrat",
    "arimo",
    "noto-sans",
    "libre-franklin",
    "source-sans-3",
    "rubik",
    "plus-jakarta-sans",
] as const;

export const DIVIDER_STYLES = ["solid", "dashed", "thick"] as const;
export const BULLET_STYLES = ["disc", "circle", "square", "none"] as const;
export const GROUP_SEPARATOR = ["dot", "bullet", "pipe", "comma", "slash", "none"] as const;

export type GroupSeparator = (typeof GROUP_SEPARATOR)[number];
export type DividerStyle = (typeof DIVIDER_STYLES)[number];
export type BulletStyle = (typeof BULLET_STYLES)[number];
export type Font = (typeof FONTS_LIST)[number];
export type FontWeight = (typeof FONT_WEIGHTS)[number];
export type FontVariant = (typeof FONT_VARIANTS)[number];
