import { GameEndCause, GameResult } from "./features/game/types";

declare global {
    interface Window {
        game: Phaser.Game | undefined;
        onGameEnd: (cause: GameEndCause) => void;
        onScoreUpdate: (score: number) => void;
    }
}

export {};
