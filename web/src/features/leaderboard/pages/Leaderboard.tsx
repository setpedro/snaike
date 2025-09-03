import { useEffect, useState } from "react";
import { PageWrapper } from "@/features/shared/components/PageWrapper";
import { Header } from "@/features/shared/components/Header";
import { Button } from "@/features/shared/components/Button";
import { GoFlame } from "react-icons/go";
import { Podium } from "../components/Podium";
import { RegularPlayer } from "../components/RegularPlayer";
import { ChampionCard } from "../components/ChampionCard";
import { LeaderboardPlayer } from "../types";
import { getLeaderboard } from "../services/getLeaderboard";
import { cn } from "@/features/shared/utils";
import { Loading } from "@/features/shared/components/Loading";
import { EmptyLeaderboard } from "../components/EmptyLeaderboard";

export function Leaderboard() {
    const [players, setPlayers] = useState<LeaderboardPlayer[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [refreshing, setRefreshing] = useState(false);

    const loadLeaderboard = async (isRefresh = false) => {
        isRefresh ? setRefreshing(true) : setIsLoading(true);

        const data = await getLeaderboard();
        setPlayers(data);
        setIsLoading(false);
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
                    {isLoading ? (
                        <Loading />
                    ) : (
                        <div className="flex flex-col items-center gap-8">
                            {players.length === 0 ? (
                                <EmptyLeaderboard />
                            ) : (
                                <div className="w-full flex flex-col gap-8">
                                    <div className="flex flex-col items-center gap-4">
                                        <Podium players={topThree} />
                                        <p className="text-white/70 text-center">
                                            The elite few who've mastered the
                                            game
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
                    )}
                </div>
            </div>
        </PageWrapper>
    );
}
