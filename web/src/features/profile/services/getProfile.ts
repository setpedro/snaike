import { supabase } from "@/features/auth/services/supabaseClient";
import { Profile } from "../types";

export async function getProfile(userId: string): Promise<Profile | null> {
    const { data, error } = await supabase
        .from("Users")
        .select("*")
        .eq("id", userId)
        .single();

    if (error) {
        return null;
    }
    return data;
}
