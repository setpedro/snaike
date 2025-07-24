import { Platform } from "@/features/game/types";
import { useState, useEffect } from "react";

export function useIsMobile() {
    const [isMobile, setIsMobile] = useState(false);

    useEffect(() => {
        const checkMobile = () => {
            return (
                /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
                    navigator.userAgent
                ) || "ontouchstart" in window
            );
        };

        setIsMobile(checkMobile());

        // Listen for window resize to re-check
        const handleResize = () => {
            setIsMobile(checkMobile());
        };

        window.addEventListener("resize", handleResize);
        return () => window.removeEventListener("resize", handleResize);
    }, []);

    return isMobile;
}

export const usePlatform = (): Platform => {
    const isMobile = useIsMobile();
    return isMobile ? "mobile" : "desktop";
};