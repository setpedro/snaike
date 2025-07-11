export type GameState = "playing" | "over" | "win" | "draw";

export type GameMode = "solo" | "versus";
export type GameViewMode = GameMode | "menu";

export type Game = {
    id: string;
    user_id: string;
    game_mode: GameMode;
    score: number;
    created_at: string;
};
