import { Button } from "@/features/shared/components/Button";
import { useGameContext } from "../context/GameProvider";

export function GameHeader() {
    const { gameMode, score, record, onBackToMenu } = useGameContext();
    const displayRecord = Math.max(record, score);

    return (
        <div className="w-full flex justify-between items-center px-6 py-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-t-2xl border-2 border-white/10 backdrop-blur-sm shadow-2xl">
            {gameMode !== "menu" && (
                <Button
                    onClick={onBackToMenu}
                    size="custom"
                    color="custom"
                    className="bg-white bg-clip-text text-transparent hover:bg-red-600"
                >
                    <span className="text-2xl">🔙</span>
                </Button>
            )}

            {gameMode === "menu" && (
                <div className="flex items-center gap-3 text-white font-bold text-lg">
                    <span className="text-2xl">📋</span>
                    <span>Menu</span>
                </div>
            )}

            {gameMode !== "menu" && (
                <div className="flex items-center gap-3 text-white font-bold text-lg">
                    <span className="text-2xl">🍎</span>
                    <span className="text-emerald-400">{score}</span>
                </div>
            )}

            <div className="flex items-center gap-3 text-white font-bold text-lg">
                <span className="text-2xl">🏆</span>
                <span className="text-yellow-400">{displayRecord}</span>
            </div>
        </div>
    );
}
