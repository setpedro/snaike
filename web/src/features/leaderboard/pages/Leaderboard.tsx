import { Header } from "@/features/shared/components/Header";
import { PageWrapper } from "@/features/shared/components/PageWrapper";
import { useEffect, useState } from "react";

export function Leaderboard() {
    const [dots, setDots] = useState("");

    useEffect(() => {
        const interval = setInterval(() => {
            setDots((prev) => (prev.length >= 3 ? "" : prev + "."));
        }, 500);
        return () => clearInterval(interval);
    }, []);

    return (
        <PageWrapper>
            <Header />
            <div className="text-white text-xl">Coming Soon{dots}</div>
        </PageWrapper>
    );
}
