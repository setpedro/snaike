import { useAuthContext } from "@/features/auth/context/AuthProvider";
import { useNavigate } from "react-router-dom";

export function Header() {
    const { session } = useAuthContext();
    const navigate = useNavigate();

    return (
        <div className="w-full flex justify-end items-center px-6 py-2 fixed top-0 left-0 z-50">
            <div className="border-b-2  border-white/20 flex items-center gap-6 transition-colors duration-200 [&:has(button:hover)]:border-emerald-400">
                <button
                    onClick={() => navigate("/")}
                    className="flex items-center gap-2 text-white/80 hover:text-emerald-400 transition-colors duration-200 font-medium px-4 py-2 rounded-lg"
                >
                    <span>Leaderboard</span>
                </button>

                {session ? (
                    <>
                        <button
                            onClick={() => navigate("/")}
                            className="flex items-center gap-2 text-white/80 hover:text-emerald-400 transition-colors duration-200 font-medium px-4 py-2 rounded-lg"
                        >
                            <span>Profile</span>
                        </button>
                    </>
                ) : (
                    <button
                        onClick={() => navigate("/login")}
                        className="flex items-center gap-2 text-white/80 hover:text-emerald-400 transition-colors duration-200 font-medium px-4 py-2 rounded-lg"
                    >
                        <span>Log in</span>
                    </button>
                )}
            </div>
        </div>
    );
}
