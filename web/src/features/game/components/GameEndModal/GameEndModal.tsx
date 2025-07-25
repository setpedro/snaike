import { Button } from "@/features/shared/components/Button";
import { LabelBox } from "./LabelBox";
import { useGameContext } from "../../context/GameProvider";
import { cn } from "@/features/shared/utils";
import { TbApple } from "react-icons/tb";
import { AiOutlineTrophy } from "react-icons/ai";
import { LuGamepad2 } from "react-icons/lu";

export function GameEndModal() {
    const { gameState, score, record, isNewRecord, onRestart } =
        useGameContext();

    const displayRecord = Math.max(record, score);

    const getTitle = () => {
        switch (gameState) {
            case "lose":
                return "Game Over!";
            case "win":
                return "Victory!";
            case "draw":
                return "Draw!";
            default:
                return "";
        }
    };

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-black/20 backdrop-blur-sm text-white flex justify-center items-center z-2">
            <div
                className={cn(
                    "flex justify-center items-center w-full h-full shadow-2xl",
                    "bg-black/50 sm:bg-transparent backdrop-blur-sm",
                    "sm:p-4 rounded-none"
                )}
            >
                <div
                    className={cn(
                        "flex flex-col items-center justify-center gap-2 p-2 w-full h-full",
                        "sm:max-w-md sm:h-auto sm:flex-none sm:p-6 md:p-8 sm:rounded-3xl",
                        "max-w-sm sm:bg-black/50 sm:border border-white/20"
                    )}
                >
                    <h2 className="text-center text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                        {getTitle()}
                    </h2>

                    <div className="flex flex-col items-center w-full gap-2 px-2 sm:px-0 mb-2">
                        <LabelBox
                            icon={<TbApple size={24} />}
                            label="Score:"
                            value={score}
                            gradient="bg-gradient-to-r from-emerald-500/40 to-blue-500/40"
                            valueColor="text-emerald-400"
                        />

                        <LabelBox
                            icon={<AiOutlineTrophy size={24} />}
                            label="Best:"
                            value={displayRecord}
                            badge={
                                isNewRecord && (
                                    <span className="text-xs bg-gradient-to-r from-yellow-500 to-orange-500 text-white px-2 py-1 rounded-full animate-pulse">
                                        NEW!
                                    </span>
                                )
                            }
                            gradient="bg-gradient-to-r from-yellow-500/40 to-orange-500/40"
                            valueColor="text-yellow-400"
                        />
                    </div>

                    <div className="w-full px-2 sm:px-0">
                        <Button
                            onClick={(e) => {
                                e.stopPropagation();
                                onRestart();
                            }}
                            className="bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 border-emerald-400/20"
                            size="lg"
                            color="primary"
                        >
                            <LuGamepad2 size={24} /> Play Again
                        </Button>
                    </div>
                </div>
            </div>
        </div>
    );
}
