import { GoTrophy, GoClock } from "react-icons/go";
import { TbApple } from "react-icons/tb";
import { getProviderIcon, formatDuration } from "../utils";
import { LeaderboardPlayer } from "../types";

type Props = {
    player: LeaderboardPlayer;
    rank: number;
};

export function RegularPlayer({ player, rank }: Props) {
    return (
        <div className="bg-white/5 rounded-xl border border-white/10 p-4 hover:bg-white/10 transition-all duration-200 hover:scale-[1.01] cursor-pointer">
            <div className="flex items-center gap-4">
                <div className="flex-shrink-0 w-8 text-center">
                    <span className="text-lg font-bold text-white/60">
                        #{rank}
                    </span>
                </div>

                <div className="flex-shrink-0">
                    {player.avatar_url ? (
                        <img
                            src={player.avatar_url}
                            alt={player.username}
                            className="w-10 h-10 rounded-full border-2 border-white/20"
                        />
                    ) : (
                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center border-2 border-white/20">
                            <span className="text-white font-bold text-sm">
                                {player.username
                                    ? player.username
                                    : "Unknown user"}
                            </span>
                        </div>
                    )}
                </div>

                <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                        <h3 className="text-white font-medium truncate">
                            {player.username}
                        </h3>
                        {player.providers.map((p) => (
                            <span key={p}>{getProviderIcon(p)}</span>
                        ))}
                    </div>
                    <div className="text-white/50 text-sm">
                        {player.total_games} games •{" "}
                        {player.win_rate.toFixed(1)}% win rate
                    </div>
                </div>

                <div className="flex-shrink-0 text-right">
                    <div className="flex flex-col gap-1">
                        <div className="flex items-center gap-2 justify-end">
                            <GoTrophy className="text-yellow-400" size={14} />
                            <span className="text-white font-bold text-sm">
                                {player.total_wins}
                            </span>
                        </div>
                        {player.total_wins > 0 ? (
                            <div className="flex items-center gap-2 justify-end">
                                <GoClock className="text-blue-400" size={14} />
                                <span className="text-white text-sm">
                                    {formatDuration(
                                        player.fastest_win_duration
                                    )}
                                </span>
                            </div>
                        ) : (
                            <div className="flex items-center gap-2 justify-end">
                                <TbApple
                                    className="text-emerald-400"
                                    size={14}
                                />
                                <span className="text-white text-sm">
                                    {player.highest_score}
                                </span>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
