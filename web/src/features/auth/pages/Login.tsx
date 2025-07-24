import { useNavigate } from "react-router-dom";
import { providers } from "../consts";
import { OrSeparator } from "@/features/shared/components/OrSeparator";
import { Button } from "@/features/shared/components/Button";
import { ProviderButton } from "../components/ProviderButton";
import { Header } from "@/features/shared/components/Header";
import { PageWrapper } from "@/features/shared/components/PageWrapper";

export function Login() {
    const navigate = useNavigate();

    return (
        <PageWrapper>
            <div className="hidden sm:block">
                <Header />
            </div>
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

                <div className="w-full flex flex-col gap-2">
                    {providers.map((provider) => (
                        <ProviderButton
                            key={provider.name}
                            provider={provider}
                        />
                    ))}
                </div>

                <OrSeparator />

                <Button
                    onClick={() => navigate("/")}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 hover:scale-[1.02] active:scale-[0.98]"
                    size="md"
                    color="ghost"
                >
                    Play as Guest
                </Button>

                <p className="text-white/40 text-xs text-center leading-relaxed">
                    Guest scores are saved locally only.
                    <br />
                    Sign in to compete on global leaderboards!
                </p>
            </div>
        </PageWrapper>
    );
}
