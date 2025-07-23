import { Header } from "@/features/shared/components/Header";
import { PageWrapper } from "@/features/shared/components/PageWrapper";
import { useNavigate } from "react-router-dom";

export function Leaderboard() {
    const navigate = useNavigate();

    return (
        <PageWrapper>
            <Header />
            <div className="relative flex flex-col justify-center items-center h-screen min-h-[70vh] text-white py-10">
                <div className="flex flex-col items-center gap-4">
                    <div className="text-lg sm:text-xl">
                        Page under construction
                    </div>
                    <span className="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                </div>

                <div
                    onClick={() => navigate("/")}
                    className="absolute bottom-10 flex flex-col items-center gap-1 px-4 py-2 border rounded-lg cursor-pointer hover:bg-white/10 hover:border-white/50 hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out border-white/20 group"
                >
                    <p className="text-white/70 text-sm group-hover:text-white transition-colors">
                        Return to main page
                    </p>
                </div>
            </div>
        </PageWrapper>
    );
}
