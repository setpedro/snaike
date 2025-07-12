import { supabase } from "@/shared/utils/supabaseClient";
import { Provider } from "@supabase/supabase-js";

export async function authWithOAuth(provider: Provider) {
    const { error } = await supabase.auth.signInWithOAuth({ provider });
    if (error) {
        console.error("OAuth error:", error);
    }
}
