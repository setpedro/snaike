import { supabase } from "@/features/auth/services/supabaseClient";

export async function updateDisplayName(newName: string) {
    const user = (await supabase.auth.getUser()).data.user;
    if (!user) {
        throw new Error("Not authenticated");
    }

    const { error } = await supabase
        .from("users")
        .update({ display_name: newName })
        .eq("id", user.id);

    if (error) {
        throw error;
    }
}
