import { FieldType } from "@resume/frontend/src/types/trpc";

export const constructLayoutMatrix = (fields: FieldType[]) => {
    const matrix: FieldType[][] = [];

    for (const field of fields) {
        // Fallback for missing layout metadata
        const rowIndex = field.alignment?.rowIndex ?? 0;

        // Ensure nested row array exists
        if (!matrix[rowIndex]) {
            matrix[rowIndex] = [];
        }

        matrix[rowIndex].push(field);
    }

    // Remove empty gaps and sort row by interOrder horizontally
    return matrix
        .filter(Boolean)
        .map((row) =>
            row.sort(
                (a, b) => (a.alignment?.itemOrder ?? 0) - (b.alignment?.itemOrder ?? 0),
            ),
        );
};