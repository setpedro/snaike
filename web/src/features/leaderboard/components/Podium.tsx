import { PodiumPlayer } from "./PodiumPlayer";
import type { LeaderboardPlayer } from "../types";

export function Podium({ players }: { players: LeaderboardPlayer[] }) {
    return (
        <div className="hidden md:flex justify-center items-end gap-12">
            {players.map((p, i) => (
                <PodiumPlayer
                    key={p.id}
                    player={p}
                    rank={(i + 1) as 1 | 2 | 3}
                />
            ))}
        </div>
    );
}
