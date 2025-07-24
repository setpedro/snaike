import { Header } from "@/features/shared/components/Header";
import { PageWrapper } from "@/features/shared/components/PageWrapper";
import { Account } from "../components/Account";

export function Profile() {
    return (
        <PageWrapper>
            <Header />

            <div className="flex flex-col gap-4 max-w-lg mx-auto w-full px-4 mt-8">
                <Account />
            </div>
        </PageWrapper>
    );
}
