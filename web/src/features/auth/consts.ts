import type { Provider } from "@supabase/supabase-js";
import { IconType } from "react-icons";
import { FcGoogle } from "react-icons/fc";
import { FaGithub } from "react-icons/fa";
import { FaXTwitter } from "react-icons/fa6";

export type OAuthProvider = {
    name: Provider;
    icon: IconType;
    color: string;
};

export const providers: readonly OAuthProvider[] = [
    {
        name: "google",
        icon: FcGoogle,
        color: "from-red-500/20 to-orange-500/20",
    },
    {
        name: "github",
        icon: FaGithub,
        color: "from-gray-500/20 to-slate-500/20",
    },
    {
        name: "twitter",
        icon: FaXTwitter,
        color: "from-blue-500/20 to-cyan-500/20",
    },
] as const;
