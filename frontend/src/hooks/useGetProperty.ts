import { useResumeConfigStore } from "#/store/useResumeConfigStore";
import { useShallow } from "zustand/react/shallow";

export const useGetProperty = <T = any>(path: string[], defaultValue?: T): T => {
    return useResumeConfigStore(
        useShallow((state) => {
            let target = state.config as Record<string, any>;
            for (let i = 0; i < path.length; i++) {
                if (target == null) return defaultValue as T;
                target = target[path[i]];
            }
            return (target ?? defaultValue) as T;
        })
    );
};