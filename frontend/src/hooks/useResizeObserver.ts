import { useEffect, useRef, useCallback } from "react";

export function useResizeObserver(onResize: (width: number, height: number) => void) {
    const observerRef = useRef<ResizeObserver | null>(null);

    // 1. Keep a mutable ref of the latest callback to prevent stale closures 
    // and avoid forcing the ResizeObserver to disconnect/re-connect on updates.
    const onResizeRef = useRef(onResize);
    useEffect(() => {
        onResizeRef.current = onResize;
    }, [onResize]);

    // 2. Wrap targetRef in useCallback so its identity stays stable across renders.
    const targetRef = useCallback((node: HTMLElement | null) => {
        if (observerRef.current) {
            observerRef.current.disconnect();
            observerRef.current = null;
        }

        if (!node) return;

        observerRef.current = new ResizeObserver(([entry]) => {
            if (!entry) return;

            // Safe fallbacks for various browser engine implementations
            const height = entry.borderBoxSize?.[0]?.blockSize ?? entry.contentRect.height;
            const width = entry.borderBoxSize?.[0]?.inlineSize ?? entry.contentRect.width;

            if (height > 0 && width > 0) {
                // Call the current version of the callback safely
                onResizeRef.current(width, height);
            }
        });

        observerRef.current.observe(node);
    }, []); // Empty dependency array keeps this function reference identical

    // Clean up when the component completely unmounts
    useEffect(() => {
        return () => {
            if (observerRef.current) {
                observerRef.current.disconnect();
            }
        };
    }, []);

    return { targetRef };
}
