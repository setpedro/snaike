import { useAuthContext } from "@/features/auth/context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";
import { WithClassName } from "../types";
import { cn } from "../utils";

export function Header({ className }: WithClassName) {
    const { session } = useAuthContext();
    const navigate = useNavigate();

    return (
        <div
            className={cn(
                "w-full flex justify-between items-center px-8 py-4 fixed top-0 left-0",
                className
            )}
        >
            <button
                onClick={() => navigate("/")}
                className="group relative w-10 h-10 transition-all hover:scale-[1.02] active:scale-[0.98] hover:cursor-pointer"
            >
                <img
                    src="/logo.png"
                    alt="Default"
                    className="absolute inset-0 w-full h-full object-contain transition-opacity duration-200 group-hover:opacity-0 rounded-md"
                />

                <div className="absolute inset-0 flex items-center justify-center">
                    <img
                        src="/green-logo.png"
                        alt="Hover"
                        className="w-full h-full object-contain opacity-0 group-hover:opacity-100 transition-opacity duration-200 rounded-md"
                    />
                </div>
            </button>

            <div className="flex items-center gap-2">
                <Button
                    onClick={() => navigate("/leaderboard")}
                    size="sm"
                    color="link"
                >
                    <span>Leaderboard</span>
                </Button>

                {session ? (
                    <Button
                        onClick={() => navigate("/profile")}
                        size="sm"
                        color="link"
                    >
                        <span>Profile</span>
                    </Button>
                ) : (
                    <Button
                        onClick={() => navigate("/login")}
                        size="sm"
                        color="primary"
                    >
                        Log In
                    </Button>
                )}
            </div>
        </div>
    );
}
