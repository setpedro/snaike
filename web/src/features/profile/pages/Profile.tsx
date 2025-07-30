import { Header } from "@/features/shared/components/Header";
import { PageWrapper } from "@/features/shared/components/PageWrapper";
import { Account } from "../components/Account";

export function Profile() {
    return (
        <PageWrapper>
            <Header />

            <div className="max-w-lg w-full px-8">
                <Account />
            </div>
        </PageWrapper>
    );
}
