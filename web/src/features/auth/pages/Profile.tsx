import { useState } from "react";
import { useAuthContext } from "../context/AuthProvider";
import { cn } from "@/features/shared/utils/cn";
import { Header } from "@/features/shared/components/Header";

export function Profile() {
    const { signOut } = useAuthContext();
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
        <div
            className={cn(
                "flex justify-center items-center min-h-screen transition-colors duration-700 p-4",
                isLastLevel
                    ? "bg-gradient-to-br from-red-900 via-red-700 to-red-800"
                    : "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900"
            )}
        >
            <Header />
            <div
                className={cn(
                    "bg-black/40 backdrop-blur-sm border border-white/20 rounded-xl",
                    "flex items-center justify-center cursor-pointer transition-all duration-300 mx-auto",
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
    );
}
