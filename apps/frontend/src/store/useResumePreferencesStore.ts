import { debouncedStorage } from "#/utils/debouncedStorage";
import { create } from "zustand";
import { createJSONStorage, persist } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";

export interface Preferences {
    pagination: boolean;
}
interface PreferencesState {
    preferences: Preferences;
    updatePreference: <K extends keyof Preferences>(preference: K, value: Preferences[K]) => void;
}
export const useResumePreferencesStore = create<PreferencesState>()(
    persist(
        immer((set) => ({
            preferences: {
                pagination: true,
            },

            updatePreference: (preference, value) =>
                set((state) => {
                    state.preferences[preference] = value;
                })
        })),
        {
            name: "preferences",
            partialize: (state) => ({ preferences: state.preferences }),
            storage: debouncedStorage(
                createJSONStorage(() => localStorage),
                1500
            )
        }
    )
);
