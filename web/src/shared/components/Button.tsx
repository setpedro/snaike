import { ButtonHTMLAttributes } from "react";
import { cn } from "../utils";

type Props = ButtonHTMLAttributes<HTMLButtonElement> & {
    className?: string;
    variant?: "primary" | "secondary" | "ghost";
};

export function Button({
    onClick,
    children,
    className,
    variant = "primary",
    ...props
}: Props) {
    const baseClasses =
        "w-full px-6 py-3 sm:px-8 sm:py-4 rounded-2xl text-lg sm:text-xl font-bold text-white shadow-lg transition-all duration-200 transform hover:scale-105 active:scale-95 border";

    const variantClasses = {
        primary:
            "bg-gradient-to-r from-emerald-500 to-emerald-600 hover:from-emerald-600 hover:to-emerald-700 border-emerald-400/20",
        secondary:
            "bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 border-blue-400/20",
        ghost: "bg-transparent hover:bg-white/10 border-white/20",
    };

    return (
        <button
            onClick={onClick}
            className={cn(baseClasses, variantClasses[variant], className)}
            {...props}
        >
            {children}
        </button>
    );
}
