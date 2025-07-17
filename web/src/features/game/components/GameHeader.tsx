import { Button } from "@/features/shared/components/Button";
import { useGameContext } from "../context/GameProvider";
import { FiGrid } from "react-icons/fi";
import { TbApple } from "react-icons/tb";
import { FaArrowLeft } from "react-icons/fa";
import { GoTrophy } from "react-icons/go";

export function GameHeader() {
    const { gameMode, score, record, onBackToMenu } = useGameContext();
    const displayRecord = Math.max(record, score);

    return (
        <div className="w-full flex justify-between items-center px-6 py-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-t-2xl border-2 border-white/10 backdrop-blur-sm shadow-2xl">
            {gameMode !== "menu" && (
                <Button
                    onClick={onBackToMenu}
                    size="custom"
                    color="ghost"
                    className="rounded-md p-1.5 border-0"
                >
                    <FaArrowLeft size={20} />
                </Button>
            )}

            {gameMode === "menu" && (
                <div className="flex items-center gap-3 text-white font-bold text-lg">
                    <FiGrid size={24} />
                    <span>Menu</span>
                </div>
            )}

            {gameMode !== "menu" && (
                <div className="flex items-center gap-3 text-white font-bold text-lg">
                    <span className="text-2xl">
                        <TbApple
                            size={24}
                            className="text-emerald-400 scale-115"
                        />
                    </span>
                    <span className="text-emerald-400">{score}</span>
                </div>
            )}

            <div className="flex items-center gap-3 text-white font-bold text-lg">
                <span className="text-2xl">
                    <GoTrophy size={24} className="text-yellow-400 scale-115" />
                </span>
                <span className="text-yellow-400">{displayRecord}</span>
            </div>
        </div>
    );
}
