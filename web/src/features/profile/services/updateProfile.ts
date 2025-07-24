import { supabase } from "@/features/auth/services/supabaseClient";
import type { Profile } from "../types";

export async function updateProfile(data: Partial<Omit<Profile, "id">>) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
        return;
    }

    await supabase.from("Users").update(data).eq("id", user.id);
}
