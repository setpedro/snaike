import { GoTrophy, GoClock } from "react-icons/go";
import { getProviderIcon, formatDuration } from "../utils";
import { ChampionCardProps } from "../types";
import { cn } from "@/features/shared/utils";
import { BG_GRADIENTS, TROPHY_COLORS } from "../consts";
import { TbApple } from "react-icons/tb";
import { Avatar } from "./shared/Avatar";

export function PodiumPlayer({ player, rank }: ChampionCardProps) {
    const heights = { 1: "h-64", 2: "h-56", 3: "h-48" };
    const avatarSizes = { 1: "w-28 h-28", 2: "w-24 h-24", 3: "w-20 h-20" };

    return (
        <div
            className={cn(
                "w-full max-w-[180px] flex flex-col items-center gap-3",
                rank === 2 ? "order-1" : rank === 1 ? "order-2" : "order-3"
            )}
        >
            <div className="relative">
                <Avatar
                    avatarUrl={player.avatar_url}
                    username={player.username}
                    className={cn(avatarSizes[rank], "shadow-lg")}
                />
                <div className="absolute -top-2 -right-2 bg-black/80 rounded-full p-2 border-2 border-white/20">
                    <GoTrophy
                        className={TROPHY_COLORS[rank]}
                        size={rank === 1 ? 24 : 20}
                    />
                </div>
            </div>

            <div
                className={cn(
                    heights[rank],
                    BG_GRADIENTS[rank],
                    "w-full bg-gradient-to-t rounded-t-xl border-2 border-white/20 flex flex-col items-center justify-start shadow-xl px-4 py-6 gap-2"
                )}
            >
                <div className="flex items-end gap-1">
                    <span className="text-white/70 text-xl">#</span>
                    <p className="text-white font-bold text-2xl">{rank}</p>
                </div>

                <div className="text-center text-white/90 font-medium leading-tight">
                    {player.username}
                </div>

                <div className="flex items-center justify-center gap-1">
                    <GoTrophy size={16} className="text-yellow-400" />
                    <span className="text-white font-bold text-base">
                        {player.total_wins}
                    </span>
                    <span className="text-white/70 text-sm">wins</span>
                </div>

                {player.total_wins > 0 ? (
                    <div className="flex items-center justify-center gap-1">
                        <GoClock size={16} className="text-blue-400" />
                        <span className="text-white text-sm">
                            {formatDuration(player.fastest_win_duration)}
                        </span>
                    </div>
                ) : (
                    <div className="flex items-center gap-1">
                        <TbApple className="text-emerald-400" size={16} />
                        <span className="text-white font-bold">
                            {player.highest_score}
                        </span>
                        <span className="text-white/60 text-sm">/116</span>
                        <span className="text-white/60 text-sm">best</span>
                    </div>
                )}

                <div className="flex items-center justify-center gap-1">
                    {player.providers.map((p) => (
                        <span key={p}>{getProviderIcon(p)}</span>
                    ))}
                </div>
            </div>
        </div>
    );
}
