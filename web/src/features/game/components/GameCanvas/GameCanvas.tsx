import { GRID } from "@/shared/consts";
import { useGameContext } from "../../context/GameProvider";
import { GameEndModal } from "../GameEndModal";
import { MainMenu } from "./GameMenu";
import { useResizeCanvas } from "../../hooks/useResizeCanvas";

export function GameCanvas() {
    const { gameMode, gameState, gameContainerRef, setGameMode } =
        useGameContext();
    const aspectRatio =
        (GRID.cols * GRID.cellSizePx) / (GRID.rows * GRID.cellSizePx);
    const width = useResizeCanvas(aspectRatio);

    return (
        <div className="flex justify-center items-center w-full">
            <div
                className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl bg-black/20"
                style={{
                    width: `${width}px`,
                    aspectRatio: aspectRatio,
                }}
            >
                <div
                    ref={gameContainerRef}
                    className="absolute inset-0 rounded-2xl overflow-hidden"
                />
                {gameMode === "menu" && <MainMenu onSelectMode={setGameMode} />}
                {gameState !== "playing" && <GameEndModal />}
            </div>
        </div>
    );
}
