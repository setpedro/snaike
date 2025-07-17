import { Header } from "@/features/shared/components/Header";
import { PageWrapper } from "@/features/shared/components/PageWrapper";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function Leaderboard() {
    const navigate = useNavigate();
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
            <div className="flex flex-col items-center gap-3">
                <div className="text-white text-xl">Coming Soon{dots}</div>
                <div
                    onClick={() => navigate("/")}
                    className="flex flex-col items-center gap-1 px-4 py-2 border rounded-lg cursor-pointer  hover:bg-white/10 hover:border-white/50 hover:scale-105  active:scale-95 transition-all duration-200 ease-in-out border-white/20 group"
                >
                    <p className="text-white/70 text-sm group-hover:text-white transition-colors">
                        Return to main page
                    </p>
                </div>
            </div>
        </PageWrapper>
    );
}
