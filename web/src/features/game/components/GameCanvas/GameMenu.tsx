import { GameViewMode } from "../../types";
import { Button } from "@/features/shared/components/Button";

type Props = {
    onSelectMode: (mode: GameViewMode) => void;
};

export function MainMenu({ onSelectMode }: Props) {
    return (
        <div className="absolute top-0 left-0 w-full h-full bg-black/70 backdrop-blur-sm text-white flex justify-center items-center z-10 p-4">
            <div className="flex flex-col items-center w-full max-w-sm sm:max-w-md gap-2 p-2 sm:p-6 md:p-8 bg-black/50 backdrop-blur-sm rounded-3xl border border-white/20 shadow-2xl">
                <h2 className="text-center text-2xl sm:text-3xl font-bold bg-gradient-to-r from-emerald-400 to-blue-400 bg-clip-text text-transparent mb-2">
                    🐍 Snaike
                </h2>

                <div className="flex flex-col w-full gap-2 px-2 sm:px-0 mt-2">
                    <Button
                        onClick={() => onSelectMode("solo")}
                        className="group"
                        size="lg"
                        color="primary"
                    >
                        <span className="emoji-jump">🎮</span> Solo Play
                    </Button>

                    <Button
                        onClick={() => onSelectMode("versus")}
                        size="lg"
                        color="secondary"
                        disabled={true}
                        title="Coming soon..."
                    >
                        🤖 Versus AI (Coming Soon)
                    </Button>
                </div>
            </div>
        </div>
    );
}
