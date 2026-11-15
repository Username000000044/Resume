import type { TemplateType } from "#/types/trpc";
import { create } from "zustand";

interface TemplateState {
	selectedTemplate?: TemplateType;
	setSelectedTemplate: (template: TemplateType) => void;
}

export const useTemplateStore = create<TemplateState>()((set) => ({
	selectedTemplate: undefined,
	setSelectedTemplate: (template) => set({ selectedTemplate: template }),
}));
