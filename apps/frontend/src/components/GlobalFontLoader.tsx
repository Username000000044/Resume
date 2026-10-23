import {
  useDynamicFontStack,
  type FontVariantConfig,
} from "#/hooks/useDynamicFontStack";
import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import { FONT_REGISTRY } from "#/utils/fontRegistery";
import { useMemo } from "react";

const getVariantsForFont = (
  fontName: string,
  uniqueWeights: Set<number>,
): FontVariantConfig[] => {
  const fontId = fontName.toLowerCase().replace(/\s+/g, "-");

  // Get the single loader file for this variable font
  const singleFontLoader = FONT_REGISTRY[fontId];
  if (!singleFontLoader) {
    console.warn(`Variable Font ID "${fontId}" not found in FONT_REGISTRY.`);
    return [];
  }

  // Assign the exact same file loader to every weight requested by the resume
  return Array.from(uniqueWeights).map((weight) => ({
    weight,
    loader: singleFontLoader, // Every weight points to the same asset package!
  }));
};

export const GlobalFontLoader = () => {
  const typography = useResumeConfigStore((store) => store.config.template.theme.typography);

  const primaryFontFamily = typography.primary_font_family;
  const secondaryFontFamily = typography.secondary_font_family;
  const roleWeight = typography.font_weight;

  const allUniqueWeights = useMemo(() => {
    return new Set(Object.values(roleWeight));
  }, [roleWeight]);

  const primaryVariants = useMemo(
    () => getVariantsForFont(primaryFontFamily, allUniqueWeights),
    [primaryFontFamily, allUniqueWeights],
  );
  const secondaryVariants = useMemo(
    () => getVariantsForFont(secondaryFontFamily, allUniqueWeights),
    [secondaryFontFamily, allUniqueWeights],
  );

  useDynamicFontStack(primaryFontFamily, primaryVariants);
  useDynamicFontStack(secondaryFontFamily, secondaryVariants);

  return null;
};
