import { providers } from "@/features/auth/consts";
import { Provider } from "@supabase/supabase-js";

export function getProviderIcon(provider: Provider) {
    const match = providers.find((p) => p.name === provider);
    if (!match) {
        return null;
    }

    const Icon = match.icon;
    return <Icon className="text-white/70" size={16} />;
}
