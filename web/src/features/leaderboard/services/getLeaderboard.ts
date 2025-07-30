import { supabase } from "@/features/auth/services/supabaseClient";
import { LeaderboardPlayer } from "../types";

export async function getLeaderboard() {
    const { data, error } = await supabase
        .from("leaderboard_view")
        .select("*")
        .order("highest_score", { ascending: false });

    if (error) {
        console.error("Failed to fetch leaderboard:", error);
        return [];
    }

    return data as LeaderboardPlayer[];
}
