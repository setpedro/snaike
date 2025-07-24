import { Header } from "@/features/shared/components/Header";
import { PageWrapper } from "@/features/shared/components/PageWrapper";
import { Button } from "@/features/shared/components/Button";
import { useAuthContext } from "@/features/auth/context/AuthProvider";

export function Profile() {
    const { signOut } = useAuthContext();
    return (
        <PageWrapper>
            <Header />

            <Button
                onClick={signOut}
                color="ghost"
                className="fixed bottom-0 right-0"
            >
                sign out
            </Button>
        </PageWrapper>
    );
}
