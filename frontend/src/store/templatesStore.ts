import type { inferRouterOutputs } from "@trpc/server";
import { create } from "zustand";
import type { AppRouter } from "../../../backend/src/appRouter";

type templateType = inferRouterOutputs<AppRouter>["templatesList"][0];

interface SelectedTemplateState {
	selectedTemplate?: templateType;
	setSelectedTemplate: (template: templateType) => void;
}

export const useTemplateStore = create<SelectedTemplateState>()((set) => ({
	selectedTemplate: undefined,
	setSelectedTemplate: (template) => set({ selectedTemplate: template }),
}));
