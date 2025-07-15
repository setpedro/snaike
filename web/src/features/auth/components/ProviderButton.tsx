import { Button } from "@/features/shared/components/Button";
import { OAuthProvider } from "../consts";
import { cn } from "@/features/shared/utils";
import { authWithOAuth } from "../services/authWithOAuth";

type Props = {
    provider: OAuthProvider;
    onClick?: () => void;
};

export function ProviderButton({ provider, onClick }: Props) {
    return (
        <Button
            onClick={() => {
                authWithOAuth(provider.name);
                onClick?.();
            }}
            size="md"
            color="custom"
            className={cn(
                "bg-gradient-to-r",
                provider.color,
                "border border-white/10 hover:border-white/20",
                "hover:scale-[1.02] active:scale-[0.98]"
            )}
        >
            <span className="text-xl">{provider.icon}</span>
            <span className="capitalize">Continue with {provider.name}</span>
        </Button>
    );
}
