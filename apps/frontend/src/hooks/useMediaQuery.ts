import { useEffect, useState } from "react";

// useMediaQuery("(min-width: 768px)")
// check if current size matches
// return bool

export function useMediaQuery(mediaQueryString: string) {
	const [complies, setComplies] = useState<boolean>();

	useEffect(() => {
		function checkSize() {
			window.matchMedia(mediaQueryString).matches
				? setComplies(true)
				: setComplies(false);
		}

		checkSize();

		window.addEventListener("resize", checkSize);

		return () => {
			window.removeEventListener("resize", checkSize);
		};
	}, [mediaQueryString]);

	return complies;
}
