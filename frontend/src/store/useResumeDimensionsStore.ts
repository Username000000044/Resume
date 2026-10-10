import { create } from "zustand";
import { immer } from "zustand/middleware/immer";

export interface Dimensions {
    width: number;
    height: number;
}
interface ResumeDimensionState {
    sectionDimensions: Record<string, Dimensions>; // section id : section height (px)
    setSectionDimensions: (sectionId: string, newDimensions: Dimensions) => void;
}

export const useResumeDimensionsStore = create<ResumeDimensionState>()(
    immer((set) => ({
        sectionDimensions: {},
        setSectionDimensions: (sectionId, newDimensions) => set((state) => {
            // 1. Check if the element already exists in state
            const current = state.sectionDimensions[sectionId];

            if ((newDimensions.height === 0 || newDimensions.width === 0) && current) {
                return;
            }

            // Compare with the rounded values to avoid infinite loops
            if (current &&
                current.height === newDimensions.height &&
                current.width === newDimensions.width) {
                return;
            }

            // Save values to the state so future checks match perfectly
            state.sectionDimensions[sectionId] = {
                width: newDimensions.width,
                height: newDimensions.height
            };
        }),

    }))
);
