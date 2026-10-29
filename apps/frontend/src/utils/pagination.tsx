import type { Dimensions } from "#/store/useResumeDimensionsStore";

export const constructPagesMatrix = (
	pagination: boolean,
	pageHeightPx: number,
	pageMarginPx: number,
	sectionDimensions: Record<string, Dimensions>,
	sectionIds: string[],
) => {
	const matrix: string[][] = [];
	let currentPage: string[] = [];
	let currentPageHeight = 0;

	let totalHeight = 0; // Inital height include page margins
	const avaiblePageHeight = pageHeightPx - (pageMarginPx * 2);

	const missingDimensions = sectionIds.some(id => !sectionDimensions[id] || sectionDimensions[id].height === 0);
	if (missingDimensions) {
		return {
			matrix: [sectionIds], // Return everything on a single provisional page while dimensions load
			totalHeight: pageHeightPx,
		};
	}

	for (const sectionId of sectionIds) {
		const sectionHeight = sectionDimensions[sectionId].height;

		if ((sectionHeight + currentPageHeight) > avaiblePageHeight && currentPage.length > 0) {
			matrix.push(currentPage);
			currentPage = [];
			currentPageHeight = 0;
		}

		currentPage.push(sectionId);
		currentPageHeight += sectionHeight;
	}

	if (currentPage.length > 0) {
		matrix.push(currentPage);
	}

	const totalPageCount = pagination ? (matrix.length || 1) : 1;
	const totalContentHeight = matrix.flat().reduce((acc, id) => acc + sectionDimensions[id].height, 0);
	totalHeight = totalContentHeight + (totalPageCount * pageMarginPx * 2);

	return pagination ? { matrix, totalHeight } : { matrix: [sectionIds], totalHeight }

}