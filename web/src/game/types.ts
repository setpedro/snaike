export type GameState = "playing" | "gameOver" | "win" | "draw";
export type GameMode = "menu" | "solo" | "versus";

export type GameContextType = {
    gameMode: GameMode;
    gameState: GameState;
    score: number;
    record: number;
    onRestart: () => void;
    onBackToMenu: () => void;
};
