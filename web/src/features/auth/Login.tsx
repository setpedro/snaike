import React from "react";
import { useNavigate } from "react-router-dom";
import { providers } from "./consts";
import { authWithOAuth } from "./services/authWithOauth";

export function Login() {
    const navigate = useNavigate();

    const handleGuestPlay = () => {
        navigate("/");
    };

    return (
        <div className="flex justify-center items-center min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 p-4">
            <div className="flex flex-col items-center gap-6 p-8 bg-black/40 backdrop-blur-sm rounded-3xl border border-white/10 shadow-2xl w-full max-w-md">
                <div className="flex flex-col items-center gap-3">
                    <div className="text-6xl">🐍</div>
                    <h1 className="text-3xl font-bold text-white">
                        Welcome to{" "}
                        <span className="text-emerald-400">Snaike</span>
                    </h1>
                    <p className="text-white/70 text-center">
                        Sign in to save your scores and compete globally
                    </p>
                </div>

                <div className="w-full flex flex-col gap-3">
                    {providers.map((provider) => (
                        <button
                            key={provider.name}
                            onClick={() => authWithOAuth(provider.name)}
                            className={`w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r ${provider.color} rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 text-white font-medium hover:scale-[1.02] active:scale-[0.98]`}
                        >
                            <span className="text-xl">{provider.icon}</span>
                            <span className="capitalize">
                                Continue with {provider.name}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="w-full flex items-center gap-4">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <span className="text-white/50 text-sm">or</span>
                    <div className="flex-1 h-px bg-white/10"></div>
                </div>

                <button
                    onClick={handleGuestPlay}
                    className="w-full flex items-center justify-center gap-3 px-6 py-4 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 text-white font-medium hover:scale-[1.02] active:scale-[0.98]"
                >
                    <span className="text-xl">🎮</span>
                    <span>Play as Guest</span>
                </button>

                <p className="text-white/50 text-sm text-center">
                    Guest scores are saved locally only.
                    <br />
                    Sign in to compete on global leaderboards!
                </p>
            </div>
        </div>
    );
}
