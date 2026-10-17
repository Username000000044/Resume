import { create } from "zustand";
import type { TemplateType } from "#/types/template";

interface TemplateState {
	selectedTemplate?: TemplateType;
	setSelectedTemplate: (template: TemplateType) => void;
}

export const useTemplateStore = create<TemplateState>()((set) => ({
	selectedTemplate: undefined,
	setSelectedTemplate: (template) => set({ selectedTemplate: template }),
}));
