import type { Provider } from "@supabase/supabase-js";

export type OAuthProvider = {
    name: Provider;
    icon: string;
    color: string;
};

export const providers: readonly OAuthProvider[] = [
    { name: "google", icon: "🔍", color: "from-red-500/20 to-orange-500/20" },
    { name: "github", icon: "🐱", color: "from-gray-500/20 to-slate-500/20" },
    { name: "twitter", icon: "🐦", color: "from-blue-500/20 to-cyan-500/20" },
] as const;
