import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";
import { move } from "@dnd-kit/helpers";
import { set } from "lodash";

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

interface SectionInitialization {
	id: string;
	fieldIds: string[];
}

interface ResumeStoreState {
	persistantMainSections: Record<string, SubSectionData[]>; // mainSection id : [{subSection}, {subSection}]
	liveMainSections: Record<string, SubSectionData[]>; // mainSection id : [{subSection}, {subSection}]

	initializeSections: (sections: SectionInitialization[]) => void;

	addSubSection: (mainSectionId: string) => void;
	removeSubSection: (mainSectionId: string, subSectionIndex: number) => void;
	reorderSubSections: (mainSectionId: string, event: any) => void;

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

export const useResumeStore = create<ResumeStoreState>()(
	persist(
		immer((set) => ({
			persistantMainSections: {},
			liveMainSections: {},

			initializeSections: (incommingSections) =>
				set((state) => {
					incommingSections.forEach(({ id, fieldIds }) => {
						// Create section object if doesn't exist
						if (!state.persistantMainSections[id]) {
							state.persistantMainSections[id] = [
								{ id: crypto.randomUUID(), fields: {}, bullets: [], order: 0 },
							];
						}

						// Pre-populate field key with empty string and order
						state.persistantMainSections[id].forEach((_, idx) => {
							fieldIds.forEach((fieldId) => {
								const subSection = state.persistantMainSections[id][idx];

								if (subSection.fields[fieldId] === undefined) {
									subSection.fields[fieldId] = "";
								}
							});
						});
					});

					// Sync live state with the initial payload on load
					state.liveMainSections = JSON.parse(
						JSON.stringify(state.persistantMainSections),
					);
				}),

			addSubSection: (mainSectionId) =>
				set((state) => {
					const mainSection = state.persistantMainSections[mainSectionId];
					const liveSection = state.liveMainSections[mainSectionId];

					if (!mainSection) return;

					const newId = crypto.randomUUID();
					const orderIndex = mainSection.length;

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

					mainSection.push(persistantSubSection);
					liveSection.push(liveSubSection);
				}),

			removeSubSection: (mainSectionId, subSectionIndex) =>
				set((state) => {
					const mainSection = state.persistantMainSections[mainSectionId];
					const liveSection = state.liveMainSections[mainSectionId];

					if (subSectionIndex === 0) return;

					// Persist
					if (mainSection) {
						mainSection.splice(subSectionIndex, 1);
					}

					// Live
					if (liveSection) {
						liveSection.splice(subSectionIndex, 1);
					}
				}),

			reorderSubSections: (mainSectionId, event) =>
				set((state) => {
					// Persist
					const orderedMainSection = move(
						state.persistantMainSections[mainSectionId],
						event,
					);
					state.persistantMainSections[mainSectionId] = orderedMainSection;
					state.persistantMainSections[mainSectionId].forEach(
						(subSection, idx) => {
							subSection.order = idx;
						},
					);

					// Live
					const orderedLiveSection = move(
						state.liveMainSections[mainSectionId],
						event,
					);
					state.liveMainSections[mainSectionId] = orderedLiveSection;
					state.liveMainSections[mainSectionId].forEach((subSection, idx) => {
						subSection.order = idx;
					});
				}),

			updateLiveField: (mainSectionId, sectionIdx, fieldId, value) =>
				set((state) => {
					if (state.liveMainSections[mainSectionId][sectionIdx]) {
						state.liveMainSections[mainSectionId][sectionIdx].fields[fieldId] =
							value;
					}
				}),

			updateField: (mainSectionId, sectionIdx, fieldId, value) =>
				set((state) => {
					if (state.persistantMainSections[mainSectionId][sectionIdx]) {
						state.persistantMainSections[mainSectionId][sectionIdx].fields[
							fieldId
						] = value;
					}
				}),

			addMainBullet: (mainSectionId, sectionIdx, text = "") =>
				set((state) => {
					const bulletId = crypto.randomUUID();

					// Persist
					state.persistantMainSections[mainSectionId][sectionIdx].bullets.push({
						id: bulletId,
						text,
						subBullets: [],
					});

					// Live
					state.liveMainSections[mainSectionId][sectionIdx].bullets.push({
						id: bulletId,
						text,
						subBullets: [],
					});
				}),

			removeMainBullet: (mainSectionId, sectionIdx, bulletId) =>
				set((state) => {
					const mainSubSection =
						state.persistantMainSections[mainSectionId][sectionIdx];
					const liveMainSubSection =
						state.liveMainSections[mainSectionId][sectionIdx];

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
						state.liveMainSections[mainSectionId][sectionIdx];

					// Live
					const liveMainBullet = liveSubSection.bullets.find(
						(b) => b.id === bulletId,
					);
					if (liveMainBullet) liveMainBullet.text = text;
				}),

			updateMainBullet: (mainSectionId, sectionIdx, bulletId, text) =>
				set((state) => {
					const mainSubSection =
						state.persistantMainSections[mainSectionId][sectionIdx];

					// Persist
					const mainBullet = mainSubSection.bullets.find(
						(b) => b.id === bulletId,
					);
					if (mainBullet) mainBullet.text = text;
				}),

			addSubBullet: (mainSectionId, sectionIdx, parentBulletId, text = "") =>
				set((state) => {
					const mainSubSection =
						state.persistantMainSections[mainSectionId][sectionIdx];
					const liveSubSection =
						state.liveMainSections[mainSectionId][sectionIdx];

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
						state.persistantMainSections[mainSectionId][sectionIdx];
					const liveSubSection =
						state.liveMainSections[mainSectionId][sectionIdx];

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
						state.liveMainSections[mainSectionId][sectionIdx];

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
						state.persistantMainSections[mainSectionId][sectionIdx];

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
			name: "template-storage-default",
			partialize: (state) => ({
				persistantMainSections: state.persistantMainSections,
			}),
		},
	),
);
