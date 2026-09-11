import { create } from "zustand";

type StatusType = "saved" | "saving" | "unsaved";
interface SaveStatusState {
	status: StatusType;
	setStatus: (newStatus: StatusType) => void;
}

export const useSaveStatusStore = create<SaveStatusState>()((set) => ({
	status: "saved",
	setStatus: (newStatus) => set({ status: newStatus }),
}));
