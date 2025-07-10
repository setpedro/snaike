import React, {
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
    createContext,
} from "react";
import { Session } from "@supabase/supabase-js";
import { supabase } from "../../../shared/utils/supabaseClient";

type AuthContextType = {
    session: Session | null;
    isLoading: boolean;
    signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: PropsWithChildren) {
    const [session, setSession] = useState<Session | null>(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            const { data, error } = await supabase.auth.getSession();
            if (error) {
                console.error("Error getting session:", error.message);
            }
            setSession(data?.session ?? null);
            setIsLoading(false);
        };

        init();

        const { data: authListener } = supabase.auth.onAuthStateChange(
            (_event, session) => {
                setSession(session);
            }
        );

        return () => authListener.subscription.unsubscribe();
    }, []);

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (error) {
            console.error("Sign out error:", error.message);
        }
    };

    return (
        <AuthContext.Provider value={{ session, isLoading, signOut }}>
            {children}
        </AuthContext.Provider>
    );
}

export function useAuthContext() {
    const ctx = useContext(AuthContext);
    if (!ctx)
        throw new Error("useAuthContext must be used within AuthProvider");
    return ctx;
}
