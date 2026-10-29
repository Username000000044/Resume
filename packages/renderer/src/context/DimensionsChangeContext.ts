import { ValueType } from "@resume/frontend/src/store/useResumeConfigStore";
import { Dimensions } from "@resume/frontend/src/store/useResumeDimensionsStore";
import { createContext } from "react";

export const DimensionsChangeContext = createContext<(sectionId: string, dimensions: Dimensions) => void>(() => undefined);