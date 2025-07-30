import { cn } from "@/features/shared/utils";
import { Button } from "@/features/shared/components/Button";
import { useGameContext } from "../../context/GameProvider";
import { LuGamepad2 } from "react-icons/lu";
import { GoDependabot } from "react-icons/go";
import { GameMode } from "../../types";

export function GameMenu() {
    const { setGameMode, onRestart } = useGameContext();

    const startGame = (mode: GameMode) => {
        onRestart();
        setGameMode(mode);
    };

    return (
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 backdrop-blur-sm text-white flex justify-center items-center z-10 sm:p-4">
            <div
                className={cn(
                    "flex flex-col items-center justify-center w-full gap-2 p-2 shadow-2xl rounded-none flex-1",
                    "sm:flex-none sm:h-auto sm:p-6 md:p-8 sm:max-w-md max-w-sm",
                    "sm:bg-black/50 sm:backdrop-blur-sm sm:rounded-3xl sm:border border-white/20"
                )}
            >
                <h2 className="text-center text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2 sm:mb-4">
                    🐍 Snaike
                </h2>

                <div className="flex flex-col w-full gap-2 px-2 sm:px-0">
                    <Button
                        onClick={() => startGame("solo")}
                        className="group"
                        size="lg"
                        color="primary"
                    >
                        <span className="emoji-jump">
                            <LuGamepad2 size={24} />
                        </span>{" "}
                        Solo Play
                    </Button>

                    <Button
                        onClick={() => startGame("versus")}
                        size="lg"
                        color="secondary"
                        disabled={true}
                        title="Coming soon..."
                    >
                        <span>
                            <GoDependabot size={24} />
                        </span>
                        Versus AI (Coming Soon)
                    </Button>
                </div>
            </div>
        </div>
    );
}
