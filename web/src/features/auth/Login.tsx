import React from "react";
import { supabase } from "../../shared/utils/supabaseClient";

const providers = ["google", "github", "twitter"] as const;

export function Login() {
    return (
        <div className="w-full border flex flex-col items-center gap-2">
            {providers.map((provider) => (
                <button
                    key={provider}
                    onClick={() => supabase.auth.signInWithOAuth({ provider })}
                    className="border"
                >
                    Sign in with {provider}
                </button>
            ))}
        </div>
    );
}
