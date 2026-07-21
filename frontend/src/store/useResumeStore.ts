import { create } from "zustand";
import { immer } from "zustand/middleware/immer";
import { persist } from "zustand/middleware";

export interface MainBullet {
	id: string;
	text: string;
	subBullets: SubBullet[];
}

export interface SubBullet {
	id: string;
	text: string;
}

interface SectionData {
	fields: Record<string, string>; // uuid : value (34dfe2343f234(name) : "Bobby")
	bullets: MainBullet[];
}

interface SectionInitialization {
	id: string;
	fieldIds: string[];
}

interface ResumeStoreState {
	mainSections: Record<string, SectionData[]>; // mainSection id : [{data}, {data}]
	initializeSections: (sections: SectionInitialization[]) => void;

	// addSubSection: (mainSectionId: string) => void;
	// removeSubSection: (mainSectionId: string, subSectionIndex: string) => void;

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
			mainSections: {},
			initializeSections: (incommingSections) =>
				set((state) => {
					incommingSections.forEach(({ id, fieldIds }) => {
						// Create section object if doesn't exist
						if (!state.mainSections[id]) {
							state.mainSections[id] = [{ fields: {}, bullets: [] }];
						}

						// Pre-populate field key with empty string
						state.mainSections[id].forEach((_, idx) => {
							fieldIds.forEach((fieldId) => {
								if (state.mainSections[id][idx].fields[fieldId] === undefined) {
									state.mainSections[id][idx].fields[fieldId] = "";
								}
							});
						});
					});
				}),

			updateField: (sectionGroupId, sectionIdx, fieldId, value) =>
				set((state) => {
					state.mainSections[sectionGroupId][sectionIdx].fields[fieldId] =
						value;
				}),

			addMainBullet: (sectionGroupId, sectionIdx, text = "") =>
				set((state) => {
					state.mainSections[sectionGroupId][sectionIdx].bullets.push({
						id: crypto.randomUUID(),
						text,
						subBullets: [],
					});
				}),

			removeMainBullet: (sectionGroupId, sectionIdx, bulletId) =>
				set((state) => {
					const section = state.mainSections[sectionGroupId][sectionIdx];
					if (section) {
						section.bullets = section.bullets.filter((b) => b.id !== bulletId);
					}
				}),

			updateMainBullet: (sectionGroupId, sectionIdx, bulletId, text) =>
				set((state) => {
					const bullet = state.mainSections[sectionGroupId][
						sectionIdx
					].bullets.find((b) => b.id === bulletId);
					if (bullet) bullet.text = text;
				}),
			addSubBullet: (sectionGroupId, sectionIdx, parentBulletId, text = "") =>
				set((state) => {
					const parent = state.mainSections[sectionGroupId][
						sectionIdx
					].bullets.find((b) => b.id === parentBulletId);
					if (parent) {
						parent.subBullets.push({
							id: crypto.randomUUID(),
							text,
						});
					}
				}),

			removeSubBullet: (
				sectionGroupId,
				sectionIdx,
				parentBulletId,
				subBulletId,
			) =>
				set((state) => {
					const parent = state.mainSections[sectionGroupId][
						sectionIdx
					].bullets.find((b) => b.id === parentBulletId);
					if (parent) {
						parent.subBullets = parent.subBullets.filter(
							(sb) => sb.id !== subBulletId,
						);
					}
				}),
			updateSubBullet: (
				sectionGroupId,
				sectionIdx,
				parentBulletId,
				subBulletId,
				text,
			) =>
				set((state) => {
					const parent = state.mainSections[sectionGroupId][
						sectionIdx
					].bullets.find((b) => b.id === parentBulletId);
					const sub = parent?.subBullets.find((sb) => sb.id === subBulletId);
					if (sub) sub.text = text;
				}),
		})),
		{
			name: "template-storage-default",
		},
	),
);
