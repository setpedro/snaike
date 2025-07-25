export type GameResult = "win" | "lose" | "draw";
export type GameState = GameResult | "playing";

export type GameMode = "solo" | "versus";
export type GameViewMode = GameMode | "menu";

export type Platform = "mobile" | "desktop";

export type DeathCause = "wall" | "self" | null;

export type GameData = {
    userId: string;
    gameMode: GameMode;
    score: number;
    platform: Platform;
    result: GameResult;
    deathCause: DeathCause;
    duration: number;
    replayData: any;
};
