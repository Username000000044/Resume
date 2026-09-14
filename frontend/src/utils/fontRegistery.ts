import type { Font } from "@resume/backend/src/db/schema.js";

export interface FontLoaderMap {
	[weight: number]: () => Promise<{ default: string }>;
}

export const FONT_REGISTRY: Record<string, () => Promise<{ default: string }>> =
	{};

const fontModules = import.meta.glob(
	"/node_modules/@fontsource-variable/*/files/*-latin-*-normal.woff2",
);

Object.entries(fontModules).forEach(([path, loader]) => {
	// Example path: /node_modules/@fontsource-variable/open-sans/files/open-sans-latin-wght-normal.woff2
	const parts = path.split("/");
	const fontId = parts[3]; // Extracts "open-sans"

	if (fontId) {
		FONT_REGISTRY[fontId] = loader as () => Promise<{ default: string }>;
	}
});

export function getClosestAvaibleWeight(
	fontId: string,
	targetWeight: number,
): number | null {
	const font = FONT_REGISTRY[fontId];
	if (!font) return null;

	const availableWeights = Object.keys(font).map(Number);
	if (availableWeights.length === 0) return null;

	return availableWeights.reduce((closest, current) => {
		return Math.abs(current - targetWeight) < Math.abs(closest - targetWeight)
			? current
			: closest;
	});
}
