import { ValueType } from "@resume/frontend/src/store/useResumeConfigStore";
import { createContext } from "react";

export const ConfigChangeContext = createContext<(path: string[], value: ValueType) => void>(() => undefined);
