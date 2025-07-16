import { providers } from "@/features/auth/consts";
import { Button } from "@/features/shared/components/Button";
import { OrSeparator } from "@/features/shared/components/OrSeparator";
import { ProviderButton } from "./ProviderButton";

type Props = {
    record: number;
    onSignIn: () => void;
    onClose: () => void;
};

export function AuthModal({ record, onSignIn, onClose }: Props) {
    return (
        <div className="absolute top-0 left-0 w-full h-full bg-black/30 backdrop-blur-sm text-white flex justify-center items-center z-3">
            <div className="flex items-center justify-center h-screen sm:h-fit w-screen sm:w-fit p-6 bg-black/60 backdrop-blur-sm sm:rounded-3xl border border-white/20 shadow-2xl">
                <div className="flex flex-col gap-4 w-[448px]">
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

                    <div className="bg-gradient-to-r from-emerald-500/10 to-blue-500/10 rounded-2xl p-4 border border-emerald-500/20">
                        <h3 className="text-center text-white/90 font-medium mb-4">
                            🏆 Save Your Progress
                        </h3>
                        <ul className="text-sm ml-4 list-disc text-white/70 space-y-1 justify-self-center">
                            <li>Keep this score forever</li>
                            <li>Compete on global leaderboards</li>
                            <li>Track your improvement over time</li>
                            <li>See detailed game statistics</li>
                        </ul>
                    </div>

                    <div className="flex flex-col gap-2">
                        {providers.map((provider) => (
                            <ProviderButton
                                key={provider.name}
                                onClick={() => {
                                    onSignIn();
                                    onClose();
                                }}
                                provider={provider}
                            />
                        ))}
                    </div>

                    <OrSeparator />

                    <Button
                        onClick={onClose}
                        className="flex items-center justify-center gap-2 px-4 py-3 hover:scale-[1.02] active:scale-[0.98]"
                        size="md"
                        color="ghost"
                    >
                        Continue as Guest
                    </Button>

                    <p className="text-white/40 text-xs text-center leading-relaxed">
                        Guest scores are saved locally only.
                        <br />
                        Sign in to compete on global leaderboards!
                    </p>
                </div>
            </div>
        </div>
    );
}
