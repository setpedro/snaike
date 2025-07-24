import { supabase } from "@/features/auth/services/supabaseClient";
import { GameData } from "../types";

export async function saveGame(gameData: GameData) {
    const dbRecord = toSnakeCase(gameData);
    const { error } = await supabase.from("Games").insert(dbRecord);

    if (error) {
        console.error("Error saving game:", error);
    }
}

function toSnakeCase(gameData: GameData) {
    return {
        user_id: gameData.userId,
        game_mode: gameData.gameMode,
        score: gameData.score,
        platform: gameData.platform,
        result: gameData.result,
        death_cause: gameData.deathCause,
        duration: gameData.duration,
        replay_data: gameData.replayData,
    };
}
