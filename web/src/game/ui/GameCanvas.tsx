import React from "react";
import { grid } from "../../consts";
import MainMenu from "./MainMenu";
import GameEndModal from "./GameEndModal";
import { useGameContext } from "../context/useGameContext";
import { GameMode } from "../types";

type Props = {
    gameContainerRef: React.RefObject<HTMLDivElement | null>;
    onSelectMode: (mode: GameMode) => void;
};

export default function GameCanvas({ gameContainerRef, onSelectMode }: Props) {
    const { gameMode } = useGameContext();

    const width = grid.cols * grid.cellSizePx;
    const height = grid.rows * grid.cellSizePx;
    const aspectRatio = width / height;
    const displayHeight = "70vh";
    const displayWidth = `calc(${displayHeight} * ${aspectRatio})`;

    return (
        <div
            className="relative rounded-2xl overflow-hidden border-2 border-white/20 shadow-xl bg-black/20"
            style={{
                height: displayHeight,
                width: displayWidth,
            }}
        >
            <div
                ref={gameContainerRef}
                className="rounded-2xl overflow-hidden"
            />
            {gameMode === "menu" && <MainMenu onSelectMode={onSelectMode} />}

            <GameEndModal />
        </div>
    );
}
