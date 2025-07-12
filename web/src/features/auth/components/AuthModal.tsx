import { providers } from "@/features/auth/consts";
import { Provider } from "@supabase/supabase-js";

type Props = {
    record: number;
    onSignIn: (providerName: Provider) => void;
    onClose: () => void;
};

export function AuthModal({
    record,
    onSignIn,
    onClose,
}: Props) {
    return (
        <div className="rounded-3xl absolute top-0 left-0 w-full h-full bg-black/30 backdrop-blur-sm text-white flex justify-center items-center z-20 p-4">
            <div className="flex flex-col items-center w-full max-w-md gap-4 p-6 bg-black/60 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl">
                <div className="flex flex-col items-center gap-2 text-center">
                    <div className="text-4xl">🎉</div>
                    <h2 className="text-2xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent">
                        Great Game!
                    </h2>
                    <p className="text-lg text-white/90">
                        You scored{" "}
                        <span className="text-emerald-400 font-bold">
                            {record}
                        </span>{" "}
                        points
                    </p>
                </div>

                <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl p-4 border border-emerald-500/20 w-full">
                    <h3 className="text-center text-white/90 font-medium mb-2">
                        🏆 Save Your Progress
                    </h3>
                    <ul className="text-sm text-white/70 space-y-1">
                        <li>• Keep this score forever</li>
                        <li>• Compete on global leaderboards</li>
                        <li>• Track your improvement over time</li>
                        <li>• See detailed game statistics</li>
                    </ul>
                </div>

                <div className="w-full flex flex-col gap-2">
                    {providers.map((provider) => (
                        <button
                            key={provider.name}
                            onClick={() => {
                                onSignIn(provider.name);
                                onClose();
                            }}
                            className={`w-full flex items-center justify-center gap-3 px-4 py-3 bg-gradient-to-r ${provider.color} rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 text-white font-medium hover:scale-[1.02] active:scale-[0.98]`}
                        >
                            <span className="text-xl">{provider.icon}</span>
                            <span className="capitalize">
                                Continue with {provider.name}
                            </span>
                        </button>
                    ))}
                </div>

                <div className="w-full flex items-center gap-3">
                    <div className="flex-1 h-px bg-white/10"></div>
                    <span className="text-white/50 text-sm">or</span>
                    <div className="flex-1 h-px bg-white/10"></div>
                </div>

                <button
                    onClick={onClose}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white/5 rounded-xl border border-white/10 hover:border-white/20 transition-all duration-200 text-white/80 hover:text-white font-medium hover:scale-[1.02] active:scale-[0.98]"
                >
                    <span>Continue as Guest</span>
                </button>

                <p className="text-white/40 text-xs text-center leading-relaxed">
                    Guest scores are saved locally only and will be lost if you
                    clear your browser data.
                </p>
            </div>
        </div>
    );
}
