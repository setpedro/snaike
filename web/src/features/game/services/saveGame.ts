import { supabase } from "@/shared/utils/supabaseClient";
import { GameMode } from "../types";

export async function saveGame(
    userId: string,
    gameMode: GameMode,
    score: number
) {
    const { error } = await supabase.from("Games").insert({
        user_id: userId,
        game_mode: gameMode,
        score,
    });

    if (error) {
        console.error("Error saving game:", error);
    }
}
