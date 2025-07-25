export type GameResult = "win" | "lose" | "draw";
export type GameState = GameResult | "playing";

export type GameMode = "solo" | "versus";
export type GameViewMode = GameMode | "menu";

export type Platform = "mobile" | "desktop";

export type SoloEndCause = "wall" | "self" | "filled";
export type VersusEndCause =
    | "aiHitWall"
    | "aiHitSelf"
    | "aiFilled"
    | "humanHitAi"
    | "aiHitHuman"
    | "headOnCollision"
    | "bothFilled";
export type GameEndCause = SoloEndCause | VersusEndCause | null;

export type GameData = {
    userId: string;
    mode: GameMode;
    score: number;
    platform: Platform;
    result: GameResult;
    endCause: GameEndCause;
    duration: number;
    replayData: any;
};
