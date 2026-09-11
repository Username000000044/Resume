import { create, type ExtractState } from "zustand";
import { immer } from "zustand/middleware/immer";
import { createJSONStorage, persist } from "zustand/middleware";
import type { DragEndEvent } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";
import { debouncedStorage } from "#/utils/debouncedStorage";

export interface MainBullet {
	id: string;
	text: string;
	subBullets: SubBullet[];
}

export interface SubBullet {
	id: string;
	text: string;
}

export interface SubSectionData {
	id: string;
	fields: Record<string, string>; // uuid : value (34dfe2343f234(name) : "Bobby")
	bullets: MainBullet[];
	order: number;
}

export interface SectionData {
	id: string;
	subSections: SubSectionData[];
	order: number;
}

interface SectionInitialization {
	id: string;
	fieldIds: string[];
	order: number;
}

interface ResumeStoreState {
	sections: Record<string, SectionData>; // section id : [{subSection}, {subSection}]

	initializeSections: (sections: SectionInitialization[]) => void;

	reorderSections: (event: DragEndEvent) => void;

	addSubSection: (mainSectionId: string) => void;
	removeSubSection: (mainSectionId: string, subSectionIndex: number) => void;
	reorderSubSections: (mainSectionId: string, event: DragEndEvent) => void;

	updateField: (
		mainSectionId: string,
		sectionIdx: number,
		fieldId: string,
		value: string,
	) => void;
	addMainBullet: (sectionId: string, sectionIdx: number) => void;
	removeMainBullet: (
		mainSectionId: string,
		sectionIdx: number,
		bulletId: string,
	) => void;
	updateMainBullet: (
		mainSectionId: string,
		sectionIdx: number,
		bulletId: string,
		text: string,
	) => void;
	addSubBullet: (
		mainSectionId: string,
		sectionIdx: number,
		parentBulletId: string,
	) => void;
	removeSubBullet: (
		mainSectionId: string,
		sectionIdx: number,
		parentBulletId: string,
		subBulletId: string,
	) => void;
	updateSubBullet: (
		mainSectionId: string,
		sectionIdx: number,
		parentBulletId: string,
		subBulletId: string,
		text: string,
	) => void;
}

export const DEFAULT_RESUME_STORE_PERSIST_NAME = "template-default";

export const useResumeStore = create<ResumeStoreState>()(
	persist(
		immer((set) => ({
			sections: {},

			initializeSections: (incommingSections) =>
				set((state) => {
					incommingSections.forEach(({ id, fieldIds, order }) => {
						// Initialize main section if doesn't exist
						if (!state.sections[id]) {
							state.sections[id] = {
								id,
								subSections: [
									{
										id: crypto.randomUUID(),
										fields: {},
										bullets: [],
										order: 0,
									},
								],
								order,
							};
						}
						// Fallback to nitialize default sub section if subsection was empty/missing
						else if (
							!state.sections[id].subSections ||
							state.sections[id].subSections.length === 0
						) {
							state.sections[id].subSections = [
								{ id: crypto.randomUUID(), fields: {}, bullets: [], order: 0 },
							];
						}

						// Pre-populate field key with empty string and order
						state.sections[id].subSections.forEach((subSection) => {
							fieldIds.forEach((fieldId) => {
								if (subSection.fields[fieldId] === undefined) {
									subSection.fields[fieldId] = "";
								}
							});
						});
					});
				}),

			reorderSections: (event) =>
				set((state) => {
					// Sorts keys from lowest to highest
					const sortedIds = Object.keys(state.sections).sort((a, b) => {
						return (
							(state.sections[a].order || 0) - (state.sections[b].order || 0)
						);
					});

					const reorderedIds = move(sortedIds, event);

					// Assign new placement order based on idx of the new reorderedIds array
					reorderedIds.forEach((id, idx) => {
						if (state.sections[id]) {
							state.sections[id].order = idx; // + 1 to account for header section.
						}
					});
				}),

			addSubSection: (mainSectionId) =>
				set((state) => {
					const section = state.sections[mainSectionId];

					if (!section) return;

					const newId = crypto.randomUUID();
					const orderIndex = section.subSections.length;

					const persistantSubSection: SubSectionData = {
						id: newId,
						fields: {},
						bullets: [],
						order: orderIndex,
					};

					section.subSections.push(persistantSubSection);
				}),

			removeSubSection: (mainSectionId, subSectionIndex) =>
				set((state) => {
					const section = state.sections[mainSectionId];

					if (!section) return;
					if (subSectionIndex === 0) return;

					section.subSections.splice(subSectionIndex, 1);
				}),

			reorderSubSections: (mainSectionId, event) =>
				set((state) => {
					const section = state.sections[mainSectionId];
					if (!section) return;

					const orderedPersistSection = move(section.subSections, event);

					section.subSections = orderedPersistSection;
					section.subSections.forEach((subSection, idx) => {
						subSection.order = idx;
					});
				}),

			updateField: (mainSectionId, sectionIdx, fieldId, value) =>
				set((state) => {
					if (state.sections[mainSectionId].subSections[sectionIdx]) {
						state.sections[mainSectionId].subSections[sectionIdx].fields[
							fieldId
						] = value;
					}
				}),

			addMainBullet: (mainSectionId, sectionIdx, text = "") =>
				set((state) => {
					const bulletId = crypto.randomUUID();

					state.sections[mainSectionId].subSections[sectionIdx].bullets.push({
						id: bulletId,
						text,
						subBullets: [],
					});
				}),

			removeMainBullet: (mainSectionId, sectionIdx, bulletId) =>
				set((state) => {
					const subSection =
						state.sections[mainSectionId].subSections[sectionIdx];

					// Persist
					if (subSection) {
						subSection.bullets = subSection.bullets.filter(
							(b) => b.id !== bulletId,
						);
					}
				}),

			updateMainBullet: (mainSectionId, sectionIdx, bulletId, text) =>
				set((state) => {
					const subSection =
						state.sections[mainSectionId].subSections[sectionIdx];

					const mainBullet = subSection.bullets.find((b) => b.id === bulletId);
					if (mainBullet) mainBullet.text = text;
				}),

			addSubBullet: (mainSectionId, sectionIdx, parentBulletId, text = "") =>
				set((state) => {
					const subSection =
						state.sections[mainSectionId].subSections[sectionIdx];

					const subBulletId = crypto.randomUUID();
					const mainBullet = subSection.bullets.find(
						(b) => b.id === parentBulletId,
					);

					if (mainBullet) mainBullet.subBullets.push({ id: subBulletId, text });
				}),

			removeSubBullet: (
				mainSectionId,
				sectionIdx,
				parentBulletId,
				subBulletId,
			) =>
				set((state) => {
					const subSection =
						state.sections[mainSectionId].subSections[sectionIdx];

					const mainBullet = subSection.bullets.find(
						(b) => b.id === parentBulletId,
					);

					if (mainBullet)
						mainBullet.subBullets = mainBullet.subBullets.filter(
							(sb) => sb.id !== subBulletId,
						);
				}),

			updateSubBullet: (
				mainSectionId,
				sectionIdx,
				parentBulletId,
				subBulletId,
				text,
			) =>
				set((state) => {
					const subSection =
						state.sections[mainSectionId].subSections[sectionIdx];

					const mainBullet = subSection.bullets.find(
						(b) => b.id === parentBulletId,
					);
					const subBullet = mainBullet?.subBullets.find(
						(sb) => sb.id === subBulletId,
					);

					if (subBullet) subBullet.text = text;
				}),
		})),
		{
			name: DEFAULT_RESUME_STORE_PERSIST_NAME,
			storage: debouncedStorage(
				createJSONStorage(() => localStorage),
				1500,
			),
		},
	),
);

export type ResumeStore = ExtractState<typeof useResumeStore>;
