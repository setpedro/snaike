import { useAuthContext } from "@/features/auth/context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { Button } from "./Button";

export function Header() {
    const { session } = useAuthContext();
    const navigate = useNavigate();

    return (
        <div className="w-full flex justify-end items-center px-6 py-3 fixed top-0 left-0">
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
                    <Button onClick={() => navigate("/login")} size="sm">
                        Log In
                    </Button>
                )}
            </div>
        </div>
    );
}
