import { supabase } from "@/features/auth/services/supabaseClient";
import { Provider } from "@supabase/supabase-js";

export async function authWithOAuth(provider: Provider) {
    const redirectTo = import.meta.env.VITE_SITE_URL;

    const { error } = await supabase.auth.signInWithOAuth({
        provider,
        options: { redirectTo },
    });
    if (error) {
        console.error("OAuth error:", error);
    }
}
