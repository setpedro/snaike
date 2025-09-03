import { GoTrophy } from "react-icons/go";

export function EmptyLeaderboard() {
    return (
        <div className="flex flex-col items-center gap-2 py-20">
            <GoTrophy className="text-white/30" size={64} />
            <p className="text-white/60 text-xl">No champions yet</p>
            <p className="text-white/40">Be the first to claim the throne!</p>
        </div>
    );
}
