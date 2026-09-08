import { create, type ExtractState } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import type { DragEndEvent } from "@dnd-kit/react";
import { move } from "@dnd-kit/helpers";

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
	persistantMainSections: Record<string, SectionData>; // mainSection id : [{subSection}, {subSection}]
	liveMainSections: Record<string, SectionData>; // mainSection id : [{subSection}, {subSection}]

	syncLiveSections: () => void;

	initializeSections: (sections: SectionInitialization[]) => void;

	reorderSections: (event: DragEndEvent) => void;

	addSubSection: (mainSectionId: string) => void;
	removeSubSection: (mainSectionId: string, subSectionIndex: number) => void;
	reorderSubSections: (mainSectionId: string, event: DragEndEvent) => void;

	updateLiveField: (
		mainSectionId: string,
		sectionIdx: number,
		fieldId: string,
		value: string,
	) => void;
	updateLiveMainBullet: (
		mainSectionId: string,
		sectionIdx: number,
		bulletId: string,
		text: string,
	) => void;
	updateLiveSubBullet: (
		mainSectionId: string,
		sectionIdx: number,
		parentBulletId: string,
		subBulletId: string,
		text: string,
	) => void;

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
			persistantMainSections: {},
			liveMainSections: {},

			syncLiveSections: () =>
				set((state) => {
					state.liveMainSections = JSON.parse(
						JSON.stringify(state.persistantMainSections),
					);
				}),

			initializeSections: (incommingSections) =>
				set((state) => {
					incommingSections.forEach(({ id, fieldIds, order }) => {
						// Initialize main section if doesn't exist
						if (!state.persistantMainSections[id]) {
							state.persistantMainSections[id] = {
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
							!state.persistantMainSections[id].subSections ||
							state.persistantMainSections[id].subSections.length === 0
						) {
							state.persistantMainSections[id].subSections = [
								{ id: crypto.randomUUID(), fields: {}, bullets: [], order: 0 },
							];
						}

						// Pre-populate field key with empty string and order
						state.persistantMainSections[id].subSections.forEach(
							(subSection) => {
								fieldIds.forEach((fieldId) => {
									if (subSection.fields[fieldId] === undefined) {
										subSection.fields[fieldId] = "";
									}
								});
							},
						);
					});

					// Sync live state with the initial payload on load
					state.liveMainSections = JSON.parse(
						JSON.stringify(state.persistantMainSections),
					);
				}),

			reorderSections: (event) =>
				set((state) => {
					// Sorts keys from lowest to highest
					const sortedIds = Object.keys(state.persistantMainSections).sort(
						(a, b) => {
							return (
								(state.persistantMainSections[a].order || 0) -
								(state.persistantMainSections[b].order || 0)
							);
						},
					);

					const reorderedIds = move(sortedIds, event);

					// Assign new placement order based on idx of the new reorderedIds array
					reorderedIds.forEach((id, idx) => {
						// Persist
						if (state.persistantMainSections[id]) {
							state.persistantMainSections[id].order = idx; // + 1 to account for header section.
						}
						// Live
						if (state.liveMainSections[id]) {
							state.liveMainSections[id].order = idx; // + 1 to account for header section.
						}
					});
				}),

			addSubSection: (mainSectionId) =>
				set((state) => {
					const mainSection = state.persistantMainSections[mainSectionId];
					const liveSection = state.liveMainSections[mainSectionId];

					if (!mainSection) return;

					const newId = crypto.randomUUID();
					const orderIndex = mainSection.subSections.length;

					const persistantSubSection: SubSectionData = {
						id: newId,
						fields: {},
						bullets: [],
						order: orderIndex,
					};
					const liveSubSection: SubSectionData = {
						id: newId,
						fields: {},
						bullets: [],
						order: orderIndex,
					};

					mainSection.subSections.push(persistantSubSection);
					liveSection.subSections.push(liveSubSection);
				}),

			removeSubSection: (mainSectionId, subSectionIndex) =>
				set((state) => {
					const mainSection = state.persistantMainSections[mainSectionId];
					const liveSection = state.liveMainSections[mainSectionId];

					if (subSectionIndex === 0) return;

					// Persist
					if (mainSection) {
						mainSection.subSections.splice(subSectionIndex, 1);
					}

					// Live
					if (liveSection) {
						liveSection.subSections.splice(subSectionIndex, 1);
					}
				}),

			reorderSubSections: (mainSectionId, event) =>
				set((state) => {
					const persistantSection = state.persistantMainSections[mainSectionId];
					const liveSection = state.liveMainSections[mainSectionId];

					if (!persistantSection || !liveSection) return;

					// Persistant
					const orderedPersistSection = move(
						persistantSection.subSections,
						event,
					);

					persistantSection.subSections = orderedPersistSection;
					persistantSection.subSections.forEach((subSection, idx) => {
						subSection.order = idx;
					});

					// Live
					const orderedLiveSection = move(liveSection.subSections, event);

					liveSection.subSections = orderedLiveSection;
					liveSection.subSections.forEach((subSection, idx) => {
						subSection.order = idx;
					});
				}),

			updateLiveField: (mainSectionId, sectionIdx, fieldId, value) =>
				set((state) => {
					if (state.liveMainSections[mainSectionId].subSections[sectionIdx]) {
						state.liveMainSections[mainSectionId].subSections[
							sectionIdx
						].fields[fieldId] = value;
					}
				}),

			updateField: (mainSectionId, sectionIdx, fieldId, value) =>
				set((state) => {
					if (
						state.persistantMainSections[mainSectionId].subSections[sectionIdx]
					) {
						state.persistantMainSections[mainSectionId].subSections[
							sectionIdx
						].fields[fieldId] = value;
					}
				}),

			addMainBullet: (mainSectionId, sectionIdx, text = "") =>
				set((state) => {
					const bulletId = crypto.randomUUID();

					// Persist
					state.persistantMainSections[mainSectionId].subSections[
						sectionIdx
					].bullets.push({
						id: bulletId,
						text,
						subBullets: [],
					});

					// Live
					state.liveMainSections[mainSectionId].subSections[
						sectionIdx
					].bullets.push({
						id: bulletId,
						text,
						subBullets: [],
					});
				}),

			removeMainBullet: (mainSectionId, sectionIdx, bulletId) =>
				set((state) => {
					const mainSubSection =
						state.persistantMainSections[mainSectionId].subSections[sectionIdx];
					const liveMainSubSection =
						state.liveMainSections[mainSectionId].subSections[sectionIdx];

					// Persist
					if (mainSubSection) {
						mainSubSection.bullets = mainSubSection.bullets.filter(
							(b) => b.id !== bulletId,
						);
					}

					// Live
					if (liveMainSubSection) {
						liveMainSubSection.bullets = liveMainSubSection.bullets.filter(
							(b) => b.id !== bulletId,
						);
					}
				}),

			updateLiveMainBullet: (mainSectionId, sectionIdx, bulletId, text) =>
				set((state) => {
					const liveSubSection =
						state.liveMainSections[mainSectionId].subSections[sectionIdx];

					// Live
					const liveMainBullet = liveSubSection.bullets.find(
						(b) => b.id === bulletId,
					);
					if (liveMainBullet) liveMainBullet.text = text;
				}),

			updateMainBullet: (mainSectionId, sectionIdx, bulletId, text) =>
				set((state) => {
					const mainSubSection =
						state.persistantMainSections[mainSectionId].subSections[sectionIdx];

					// Persist
					const mainBullet = mainSubSection.bullets.find(
						(b) => b.id === bulletId,
					);
					if (mainBullet) mainBullet.text = text;
				}),

			addSubBullet: (mainSectionId, sectionIdx, parentBulletId, text = "") =>
				set((state) => {
					const mainSubSection =
						state.persistantMainSections[mainSectionId].subSections[sectionIdx];
					const liveSubSection =
						state.liveMainSections[mainSectionId].subSections[sectionIdx];

					const subBulletId = crypto.randomUUID();

					const mainBullet = mainSubSection.bullets.find(
						(b) => b.id === parentBulletId,
					);
					if (mainBullet) mainBullet.subBullets.push({ id: subBulletId, text });

					const liveMainBullet = liveSubSection.bullets.find(
						(b) => b.id === parentBulletId,
					);
					if (liveMainBullet)
						liveMainBullet.subBullets.push({ id: subBulletId, text });
				}),

			removeSubBullet: (
				mainSectionId,
				sectionIdx,
				parentBulletId,
				subBulletId,
			) =>
				set((state) => {
					const subSection =
						state.persistantMainSections[mainSectionId].subSections[sectionIdx];
					const liveSubSection =
						state.liveMainSections[mainSectionId].subSections[sectionIdx];

					// Persist
					const mainBullet = subSection.bullets.find(
						(b) => b.id === parentBulletId,
					);
					if (mainBullet)
						mainBullet.subBullets = mainBullet.subBullets.filter(
							(sb) => sb.id !== subBulletId,
						);

					// Live
					const liveMainBullet = liveSubSection.bullets.find(
						(b) => b.id === parentBulletId,
					);
					if (liveMainBullet)
						liveMainBullet.subBullets = liveMainBullet.subBullets.filter(
							(sb) => sb.id !== subBulletId,
						);
				}),

			updateLiveSubBullet: (
				mainSectionId,
				sectionIdx,
				parentBulletId,
				subBulletId,
				text,
			) =>
				set((state) => {
					const liveSubSection =
						state.liveMainSections[mainSectionId].subSections[sectionIdx];

					// Live
					const liveMainBullet = liveSubSection.bullets.find(
						(b) => b.id === parentBulletId,
					);
					const liveSubBullet = liveMainBullet?.subBullets.find(
						(sb) => sb.id === subBulletId,
					);
					if (liveSubBullet) liveSubBullet.text = text;
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
						state.persistantMainSections[mainSectionId].subSections[sectionIdx];

					// Persist
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
			partialize: (state) => ({
				persistantMainSections: state.persistantMainSections,
			}),
		},
	),
);

export type ResumeStore = ExtractState<typeof useResumeStore>;
