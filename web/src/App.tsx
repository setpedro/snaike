import { Routes, Route, Navigate } from "react-router-dom";
import { Game } from "./features/game/pages/Game";
import { Login } from "./features/auth/pages/Login";
import { useAuthContext } from "./features/auth/context/AuthProvider";
import { GameProvider } from "./features/game/context/GameProvider";
import { Profile } from "./features/profile/pages/Profile";
import { Leaderboard } from "./features/leaderboard/pages/Leaderboard";

export function App() {
    const { session, isLoading } = useAuthContext();

    if (isLoading) {
        return (
            <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900">
                <div className="text-white text-xl">Loading...</div>
            </div>
        );
    }

    return (
        <Routes>
            <Route
                path="/"
                element={
                    <GameProvider>
                        <Game />
                    </GameProvider>
                }
            />
            <Route
                path="/login"
                element={session ? <Navigate to="/" /> : <Login />}
            />
            <Route path="/leaderboard" element={<Leaderboard />} />
            <Route
                path="/profile"
                element={session ? <Profile /> : <Navigate to="/login" />}
            />
            <Route path="*" element={<Navigate to="/" />} />
        </Routes>
    );
}
