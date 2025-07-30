import { useEffect, useState } from "react";
import { PageWrapper } from "@/features/shared/components/PageWrapper";
import { Header } from "@/features/shared/components/Header";
import { Button } from "@/features/shared/components/Button";
import { GoTrophy, GoFlame } from "react-icons/go";
import { Podium } from "../components/Podium";
import { RegularPlayer } from "../components/RegularPlayer";
import { ChampionCard } from "../components/ChampionCard";
import { LeaderboardPlayer } from "../types";
import { getLeaderboard } from "../services/getLeaderboard";
import { cn } from "@/features/shared/utils";

export function Leaderboard() {
    const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
    const [loading, setLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadLeaderboard = async (isRefresh = false) => {
        isRefresh ? setRefreshing(true) : setLoading(true);

        const data = await getLeaderboard();
        setPlayers(data);
        setLoading(false);
        setRefreshing(false);
    };

    useEffect(() => {
        loadLeaderboard();
    }, []);

    const topThree = players.slice(0, 3);
    const rest = players.slice(3);

    return (
        <PageWrapper>
            <Header className="relative" />
            <div className="w-full flex-grow flex justify-center max-w-3xl px-8 mt-6">
                <div className="w-full p-4 sm:px-8 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-t-2xl border-2 border-b-0 border-white/10 backdrop-blur-sm shadow-2xl">
                    <div className="flex flex-col items-center gap-8">
                        {loading ? (
                            <div className="flex justify-center py-20">
                                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-emerald-400"></div>
                            </div>
                        ) : players.length === 0 ? (
                            <div className="flex flex-col items-center gap-2 py-20">
                                <GoTrophy className="text-white/30" size={64} />
                                <p className="text-white/60 text-xl">
                                    No champions yet
                                </p>
                                <p className="text-white/40">
                                    Be the first to claim the throne!
                                </p>
                            </div>
                        ) : (
                            <div className="w-full flex flex-col gap-8">
                                <div className="flex flex-col items-center gap-4">
                                    <Podium players={topThree} />
                                    <p className="text-white/60 text-center">
                                        The elite few who've mastered the game
                                    </p>

                                    <div className="md:hidden flex flex-col gap-4 w-full">
                                        {topThree.map((p, i) => (
                                            <ChampionCard
                                                key={p.id}
                                                player={p}
                                                rank={(i + 1) as 1 | 2 | 3}
                                            />
                                        ))}
                                    </div>
                                </div>

                                {rest.length > 0 && (
                                    <div className="w-full flex flex-col gap-4 max-w-4xl">
                                        <div className="flex items-center justify-end">
                                            <Button
                                                onClick={() =>
                                                    loadLeaderboard(true)
                                                }
                                                size="sm"
                                                color="ghost"
                                                disabled={refreshing}
                                                className="border border-white/20"
                                            >
                                                <GoFlame
                                                    size={24}
                                                    className={cn(
                                                        refreshing &&
                                                            "animate-spin"
                                                    )}
                                                />
                                            </Button>
                                        </div>

                                        <div className="max-h-96 overflow-y-auto">
                                            <div className="flex flex-col gap-3">
                                                {rest.map((player, i) => (
                                                    <RegularPlayer
                                                        key={player.id}
                                                        player={player}
                                                        rank={i + 4}
                                                    />
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </PageWrapper>
    );
}
