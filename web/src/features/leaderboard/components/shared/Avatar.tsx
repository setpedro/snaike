import { WithClassName } from "@/features/shared/types";
import { cn } from "@/features/shared/utils";

type Props = WithClassName & {
    avatarUrl: string | undefined;
    username: string;
    size?: "sm" | "md";
    className?: string;
};

const AVATAR_SIZES = {
    sm: "w-10 h-10 text-sm",
    md: "w-16 h-16 text-xl",
};

const BORDER_SIZES = {
    sm: "border-2",
    md: "border-4",
};

export function Avatar({ avatarUrl, username, size, className }: Props) {
    const displayName = username || "Unknown user";
    const initials = displayName.charAt(0).toUpperCase();

    if (avatarUrl) {
        return (
            <img
                src={avatarUrl}
                alt={displayName}
                className={cn(
                    size
                        ? (AVATAR_SIZES[size], BORDER_SIZES[size])
                        : "aspect-ratio",
                    "rounded-full border-white/20",
                    className
                )}
            />
        );
    }

    return (
        <div
            className={cn(
                size
                    ? (AVATAR_SIZES[size], BORDER_SIZES[size])
                    : "aspect-ratio",
                "rounded-full bg-gradient-to-br from-emerald-500 to-blue-500 flex items-center justify-center border-white/20",
                className
            )}
        >
            <span className="text-white font-bold">{initials}</span>
        </div>
    );
}
