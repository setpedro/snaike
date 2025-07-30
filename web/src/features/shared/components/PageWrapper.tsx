import { ReactNode } from "react";
import { cn } from "@/features/shared/utils/cn";

type Props = {
    children: ReactNode;
    className?: string;
};

export function PageWrapper({ children, className }: Props) {
    return (
        <div
            className={cn(
                "h-screen flex flex-col items-center justify-center bg-gradient-default",
                className
            )}
        >
            {children}
        </div>
    );
}
