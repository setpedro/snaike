import { Button } from "@/features/shared/components/Button";
import { OAuthProvider } from "../consts";
import { cn } from "@/features/shared/utils";
import { signInWithOAuth } from "../services/signInWithOAuth";

type Props = {
    provider: OAuthProvider;
    onClick?: () => void;
};

export function ProviderButton({ provider, onClick }: Props) {
    const Icon = provider.icon;
    return (
        <Button
            onClick={() => {
                onClick?.();
                signInWithOAuth(provider.name);
            }}
            size="md"
            color="custom"
            className={cn(
                "bg-gradient-to-r",
                provider.color,
                "border border-white/10 hover:border-white/20"
            )}
        >
            <Icon size={24} />
            <span className="capitalize">Continue with {provider.name}</span>
        </Button>
    );
}
