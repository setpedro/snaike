import {
    PropsWithChildren,
    useContext,
    useEffect,
    useState,
    createContext,
    useCallback,
} from "react";
import { Profile } from "../types";
import { updateProfile } from "../services/updateProfile";
import { getProfile } from "../services/getProfile";
import { useAuthContext } from "@/features/auth/context/AuthProvider";
import { Session, User } from "@supabase/supabase-js";

type ProfileContextType = {
    profile: Profile | null;
    isLoading: boolean;
    updateDisplayName: (newDisplayName: string) => Promise<void>;
};

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

export function ProfileProvider({ children }: PropsWithChildren) {
    const { session } = useAuthContext();

    const [profile, setProfile] = useState<Profile | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const loadProfile = useCallback(async (session: Session) => {
        const _profile = await getProfile(session.user.id);

        if (!_profile) {
            setProfile(null);
            setIsLoading(false);
            return;
        }

        const display_name =
            _profile.display_name ||
            session.user.user_metadata.user_name ||
            session.user.user_metadata.full_name ||
            "Unknown User";

        setProfile({ ..._profile, display_name });
        setIsLoading(false);
    }, []);

    useEffect(() => {
        if (!session?.user) {
            setProfile(null);
            setIsLoading(false);
            return;
        }

        setIsLoading(true);
        loadProfile(session);
    }, [session, loadProfile]);

    const updateDisplayName = async (display_name: string) => {
        await updateProfile({ display_name });
        setProfile((prev) => (prev ? { ...prev, display_name } : prev));
    };

    return (
        <ProfileContext.Provider
            value={{ profile, isLoading, updateDisplayName }}
        >
            {children}
        </ProfileContext.Provider>
    );
}

export function useProfileContext() {
    const ctx = useContext(ProfileContext);
    if (!ctx) {
        throw new Error(
            "useProfileContext must be used within ProfileProvider"
        );
    }
    return ctx;
}
