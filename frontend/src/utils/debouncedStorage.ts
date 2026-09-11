import { useSaveStatusStore } from "#/store/uesSaveStatusStore";
import type { PersistStorage } from "zustand/middleware";

function debounce<T extends (...args: any[]) => void>(
	fn: T,
	delay: number,
	onStart?: () => void,
) {
	let timeoutId: ReturnType<typeof setTimeout> | null = null;

	return (...args: Parameters<T>) => {
		if (!timeoutId && onStart) onStart();

		if (timeoutId) clearTimeout(timeoutId);
		timeoutId = setTimeout(() => {
			timeoutId = null;
			fn(...args);
		}, delay);
	};
}

export const debouncedStorage = (
	baseStorage: PersistStorage<any> | undefined,
	delay = 1500,
): PersistStorage<any> | undefined => {
	if (!baseStorage) return undefined;

	const debouncedSetters = new Map<string, (...args: any[]) => void>();

	return {
		// Standard synchronous read
		getItem: (name) => baseStorage.getItem(name),

		// Debounced write
		setItem: (name, value) => {
			if (!debouncedSetters.has(name)) {
				debouncedSetters.set(
					name,
					debounce(
						(val: any) => {
							baseStorage.setItem(name, val);
							useSaveStatusStore.getState().setStatus("saved");
						},
						delay,
						() => {
							// runs as onStart() is called
							useSaveStatusStore.getState().setStatus("saving");
						},
					),
				);
			}
			debouncedSetters.get(name)?.(value);
		},

		// Standard sychronous delete
		removeItem: (name: string) => baseStorage.removeItem(name),
	};
};
