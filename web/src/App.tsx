import { Routes, Route, Navigate } from "react-router-dom";
import { Game } from "./features/game/pages/Game";
import { Login } from "./features/auth/pages/Login";
import { useAuthContext } from "./features/auth/context/AuthProvider";
import { GameProvider } from "./features/game/context/GameProvider";
import { Profile } from "./features/profile/pages/Profile";
import { Leaderboard } from "./features/leaderboard/pages/Leaderboard";
import { PageWrapper } from "./features/shared/components/PageWrapper";
import { Loading } from "./features/shared/components/Loading";

export function App() {
    const { session, isLoading } = useAuthContext();

    if (isLoading) {
        return (
            <PageWrapper>
                <Loading />
            </PageWrapper>
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
