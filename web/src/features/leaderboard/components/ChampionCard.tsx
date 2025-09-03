import { GoClock, GoTrophy } from "react-icons/go";
import { formatDuration, getProviderIcon } from "../utils";
import { TbApple } from "react-icons/tb";
import { ChampionCardProps } from "../types";
import { cn } from "@/features/shared/utils";
import { BG_GRADIENTS, TROPHY_COLORS } from "../consts";
import { Avatar } from "./shared/Avatar";

export function ChampionCard({ player, rank }: ChampionCardProps) {
    return (
        <div
            className={cn(
                BG_GRADIENTS[rank],
                "bg-gradient-to-r rounded-xl border-2 border-white/20 p-4 shadow-xl"
            )}
        >
            <div className="flex flex-col sm:hidden gap-2">
                <div className="flex items-center gap-2">
                    <GoTrophy className={cn(TROPHY_COLORS[rank], "w-6 h-6")} />
                    <h3 className="text-white font-bold text-lg">
                        {player.username}
                    </h3>
                    {player.providers.map((p) => (
                        <span key={p}>{getProviderIcon(p)}</span>
                    ))}
                </div>

                <div className="flex gap-4 mt-1">
                    <Avatar
                        avatarUrl={player.avatar_url}
                        username={player.username}
                        size="md"
                    />

                    <div className="flex-1 min-w-0 flex flex-col justify-center gap-1">
                        <div className="text-white/70 text-sm">
                            {player.total_games} games •{" "}
                            {player.win_rate.toFixed(1)}% win rate
                        </div>

                        <div className="flex flex-wrap gap-3">
                            <div className="flex items-center gap-1">
                                <GoTrophy
                                    className="text-yellow-400"
                                    size={16}
                                />
                                <span className="text-white font-bold">
                                    {player.total_wins}
                                </span>
                                <span className="text-white/60 text-sm">
                                    wins
                                </span>
                            </div>

                            {player.total_wins > 0 ? (
                                <div className="flex items-center gap-1">
                                    <GoClock
                                        className="text-blue-400"
                                        size={16}
                                    />
                                    <span className="text-white font-bold">
                                        {formatDuration(
                                            player.fastest_win_duration
                                        )}
                                    </span>
                                    <span className="text-white/60 text-sm">
                                        best
                                    </span>
                                </div>
                            ) : (
                                <div className="flex items-center gap-1">
                                    <TbApple
                                        className="text-emerald-400"
                                        size={16}
                                    />
                                    <span className="text-white font-bold">
                                        {player.highest_score}
                                        <span className="text-white/70 font-normal">
                                            /116
                                        </span>
                                    </span>
                                    <span className="text-white/60 text-sm">
                                        best
                                    </span>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>

            <div className="hidden sm:flex items-center gap-4">
                <div className="flex-shrink-0">
                    <GoTrophy
                        className={cn(
                            TROPHY_COLORS[rank],
                            "w-6 h-6 sm:w-8 sm:h-8"
                        )}
                    />
                </div>

                <div className="flex-shrink-0">
                    <Avatar
                        avatarUrl={player.avatar_url}
                        username={player.username}
                        size="md"
                    />
                </div>

                <div className="flex flex-col gap-1 min-w-0">
                    <div className="flex items-center gap-2">
                        <h3 className="text-white font-bold text-lg">
                            {player.username}
                        </h3>
                        {player.providers.map((p) => (
                            <span key={p}>{getProviderIcon(p)}</span>
                        ))}
                    </div>
                    <div className="text-white/70 text-sm">
                        {player.total_games} games •{" "}
                        {player.win_rate.toFixed(2)}% win rate
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-1">
                            <GoTrophy className="text-yellow-400" size={16} />
                            <span className="text-white font-bold">
                                {player.total_wins}
                            </span>
                            <span className="text-white/60 text-sm">wins</span>
                        </div>
                        {player.total_wins > 0 ? (
                            <div className="flex items-center gap-1">
                                <GoClock className="text-blue-400" size={16} />
                                <span className="text-white font-bold">
                                    {formatDuration(
                                        player.fastest_win_duration
                                    )}
                                </span>
                                <span className="text-white/60 text-sm">
                                    best
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-1">
                                <TbApple
                                    className="text-emerald-400"
                                    size={16}
                                />
                                <span className="text-white font-bold">
                                    {player.highest_score}
                                </span>
                                <span className="text-white/60 text-sm">
                                    /116
                                </span>
                                <span className="text-white/60 text-sm">
                                    best
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
