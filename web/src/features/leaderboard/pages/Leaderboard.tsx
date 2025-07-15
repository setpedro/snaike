import { Header } from "@/features/shared/components/Header";
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
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <Header />
            <div className="text-white text-xl ">Coming Soon{dots}</div>
        </div>
    );
}
