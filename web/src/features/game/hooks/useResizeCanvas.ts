import { useState, useEffect } from "react";

export function useResizeCanvas(aspectRatio: number) {
    const [width, setWidth] = useState(0);

    useEffect(() => {
        function updateWidth() {
            const maxWidth = Math.min(
                window.innerWidth * 0.95,
                window.innerHeight * 0.7 * aspectRatio
            );
            setWidth(maxWidth);
        }

        window.addEventListener("resize", updateWidth);
        updateWidth();

        return () => window.removeEventListener("resize", updateWidth);
    }, [aspectRatio]);

    return width;
}
