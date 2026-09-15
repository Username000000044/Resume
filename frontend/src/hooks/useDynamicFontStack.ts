import { useEffect, useState } from "react";

export interface FontVariantConfig {
	weight: number;
	loader: () => Promise<{ default: string }>;
}

export type FontLoadStatus = "idle" | "loading" | "ready" | "error";

export const useDynamicFontStack = (
	fontFamilyName: string,
	variants: FontVariantConfig[],
): FontLoadStatus => {
	const [status, setStatus] = useState<FontLoadStatus>("idle");

	useEffect(() => {
		if (!fontFamilyName || variants.length === 0) return;

		let isMounted = true;

		// Looks inside document.fonts to skip font download if already exists
		const unloadedVariants = variants.filter((variant) => {
			return !Array.from(document.fonts).some(
				(font) =>
					(font.family === fontFamilyName ||
						font.family === `"${fontFamilyName}"`) &&
					font.weight === String(variant),
			);
		});

		if (unloadedVariants.length === 0) {
			setStatus("ready");
			return;
		}

		setStatus("loading");

		async function loadFontStack() {
			try {
				const promises = unloadedVariants.map(async (variant) => {
					const fontModule = await variant.loader();
					const fontUrl = fontModule.default;

					const fontFace = new FontFace(fontFamilyName, `url(${fontUrl})`, {
						weight: String(variant.weight),
						style: "normal",
						display: "swap",
					});

					return fontFace.load();
				});

				const loadedFaces = await Promise.all(promises);

				if (!isMounted) return;

				loadedFaces.forEach((face) => {
					document.fonts.add(face);
				});
				setStatus("ready");
			} catch (error) {
				console.error(
					`Failed to load font stack for: ${fontFamilyName}`,
					error,
				);
				if (isMounted) setStatus("error");
			}
		}

		loadFontStack();

		return () => {
			isMounted = false;
		};
	}, [fontFamilyName, variants]);

	return status;
};
