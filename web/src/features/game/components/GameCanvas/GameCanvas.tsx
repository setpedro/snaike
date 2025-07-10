import React, { useEffect, useState } from "react";
import { GRID } from "../../../../shared/consts";
import { useGameContext } from "../../context/GameProvider";
import { GameEndModal } from "../GameEndModal";
import { MainMenu } from "./GameMenu";

export function GameCanvas() {
    const { gameMode, gameContainerRef, setGameMode } = useGameContext();
    const [width, setWidth] = useState(0);
    const aspectRatio =
        (GRID.cols * GRID.cellSizePx) / (GRID.rows * GRID.cellSizePx);

    useEffect(() => {
        function updateWidth() {
            const maxWidth = Math.min(
                window.innerWidth * 0.95,
                window.innerHeight * 0.7 * aspectRatio
            );
            setWidth(maxWidth);
        }

        window.addEventListener("resize", updateWidth);
        updateWidth();

        return () => window.removeEventListener("resize", updateWidth);
    }, [aspectRatio]);

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
                <GameEndModal />
            </div>
        </div>
    );
}
