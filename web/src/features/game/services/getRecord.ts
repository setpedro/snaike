import { supabase } from "@/shared/utils/supabaseClient";

export async function getRecord(userId: string) {
    const { data, error } = await supabase
        .from("Users")
        .select("record")
        .eq("id", userId)
        .single();

    if (error) {
        if (error.code === "PGRST116") {
            const { error: insertError } = await supabase
                .from("Users")
                .insert([{ id: userId, record: 0 }]);

            if (insertError) {
                console.error("Failed to create user record:", insertError);
                return 0;
            }

            return 0;
        }

        console.error("Failed to fetch record:", error);
        return 0;
    }

    return data?.record ?? 0;
}
