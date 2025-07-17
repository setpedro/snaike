import { useState } from "react";
import { useAuthContext } from "../context/AuthProvider";
import { cn } from "@/features/shared/utils/cn";
import { Header } from "@/features/shared/components/Header";
import { PageWrapper } from "@/features/shared/components/PageWrapper";
import { useNavigate } from "react-router-dom";

export function Profile() {
    const { signOut } = useAuthContext();
    const navigate = useNavigate();
    const [level, setLevel] = useState(0);

    const messages = [
        "Sign out",
        "Wait, are you sure?",
        "But we were just getting to know each other...",
        "I promise I'll be better!",
        "What if I told you a joke?",
        "Please reconsider! I have snacks! 🍪",
        "I'm not clingy, you're clingy!",
        "Fine, but I'm telling everyone you left me",
        "This is your last chance to stay...",
        "Okay okay, you win. Here's your exit 🚪",
    ];

    const handleClick = () => {
        if (level < messages.length - 1) {
            setLevel(level + 1);
        } else {
            signOut();
        }
    };

    const getBoxSize = () => {
        const baseWidth = 320;
        const baseHeight = 100;
        const reduction = level * 2;
        return {
            width: Math.max(baseWidth - reduction, 240),
            height: Math.max(baseHeight - reduction, 80),
        };
    };

    const isLastLevel = level === messages.length - 1;
    const boxSize = getBoxSize();

    return (
        <PageWrapper
            className={isLastLevel ? "bg-gradient-red" : "bg-gradient-default"}
        >
            <Header />

            <div
                onClick={() => navigate("/")}
                className="flex flex-col items-center gap-1 px-4 py-2 border rounded-lg cursor-pointer hover:bg-white/10 hover:border-white/50 hover:scale-105 active:scale-95 transition-all duration-200 ease-in-out border-white/20 group"
            >
                <p className="text-white/70 text-sm group-hover:text-white transition-colors">
                    Return to main page
                </p>
                <p className="text-2xl sm:text-3xl group-hover:animate-pulse">
                    🐍
                </p>
            </div>

            <div className="fixed bottom-6 right-6">
                <div
                    className={cn(
                        "bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl",
                        "flex items-center justify-center cursor-pointer transition-all duration-300",
                        isLastLevel
                            ? "hover:bg-red-900/40 hover:border-red-400/50"
                            : "hover:bg-black/60 hover:border-white/30"
                    )}
                    style={{
                        width: `${boxSize.width}px`,
                        height: `${boxSize.height}px`,
                    }}
                    onClick={handleClick}
                >
                    <p
                        className={cn(
                            "font-medium text-center px-4 break-words transition-colors duration-300 text-base sm:text-lg",
                            isLastLevel ? "text-red-300" : "text-white/80"
                        )}
                    >
                        {messages[level]}
                    </p>
                </div>
            </div>
        </PageWrapper>
    );
}
