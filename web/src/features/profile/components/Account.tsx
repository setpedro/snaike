import { useState } from "react";
import { Button } from "@/features/shared/components/Button";
import { FiEdit3, FiCheck, FiX, FiLogOut } from "react-icons/fi";
import { useAuthContext } from "@/features/auth/context/AuthProvider";
import { useNavigate } from "react-router-dom";
import { useProfileContext } from "../context/ProfileProvider";

export function Account() {
    const { signOut } = useAuthContext();
    const navigate = useNavigate();

    const { profile, updateDisplayName } = useProfileContext();

    const displayName =
        profile?.display_name !== "" ? profile?.display_name : "from_metadata";

    const [isEditing, setIsEditing] = useState(false);
    const [newDisplayName, setNewDisplayName] = useState(displayName);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [settingsOpen, setSettingsOpen] = useState(false);

    const handleSave = async () => {
        // TODO: please.
        if (!newDisplayName) {
            return;
        }

        if (!newDisplayName.trim()) {
            setError("Display name cannot be empty");
            return;
        }

        if (newDisplayName.trim() === displayName) {
            setIsEditing(false);
            return;
        }

        setSaving(true);
        setError(null);

        try {
            await updateDisplayName(newDisplayName);
            setIsEditing(false);
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : "Failed to update display name"
            );
        } finally {
            setSaving(false);
        }
    };

    const handleCancel = () => {
        setNewDisplayName(displayName);
        setIsEditing(false);
        setError(null);
    };

    return (
        <div className="bg-white/5 rounded-xl border border-white/10 p-4">
            <h3 className="text-white font-bold mb-3">Account Settings</h3>

            <div className="flex flex-col gap-3">
                <div>
                    <label className="block text-white/70 text-sm mb-2">
                        Display Name
                    </label>

                    {isEditing ? (
                        <div className="flex flex-col gap-2">
                            <input
                                type="text"
                                value={newDisplayName}
                                onChange={(e) =>
                                    setNewDisplayName(e.target.value)
                                }
                                className="w-full px-3 py-2 bg-white/10 border border-white/20 rounded-lg text-white placeholder-white/50 focus:outline-none focus:border-emerald-400 transition-colors"
                                placeholder="Enter display name"
                                maxLength={50}
                                disabled={saving}
                            />

                            {error && (
                                <p className="text-red-400 text-sm">{error}</p>
                            )}

                            <div className="flex gap-2">
                                <Button
                                    onClick={handleSave}
                                    size="sm"
                                    color="primary"
                                    disabled={saving}
                                    className="flex items-center gap-1"
                                >
                                    <FiCheck size={16} />
                                    <span>{saving ? "Saving..." : "Save"}</span>
                                </Button>

                                <Button
                                    onClick={handleCancel}
                                    size="sm"
                                    color="ghost"
                                    disabled={saving}
                                    className="flex items-center gap-1 border border-white/20"
                                >
                                    <FiX size={16} />
                                    <span>Cancel</span>
                                </Button>
                            </div>
                        </div>
                    ) : (
                        <div className="flex items-center justify-between">
                            <span className="text-white font-medium">
                                {displayName}
                            </span>
                            <Button
                                onClick={() => setIsEditing(true)}
                                size="sm"
                                color="ghost"
                                className="flex items-center gap-1 border border-white/20"
                            >
                                <FiEdit3 size={16} />
                                <span>Edit</span>
                            </Button>
                        </div>
                    )}
                </div>

                <div>
                    <Button
                        onClick={() => setSettingsOpen(!settingsOpen)}
                        size="sm"
                        color="secondary"
                        className="mt-4 w-full"
                    >
                        Settings
                    </Button>

                    {settingsOpen && (
                        <div className="mt-3 border border-white/10 bg-black/20 p-3 rounded-lg">
                            <Button
                                onClick={() => {
                                    signOut();
                                    navigate("/login");
                                }}
                                size="sm"
                                color="custom"
                                className="w-full flex items-center justify-center gap-2 bg-red-500"
                            >
                                <FiLogOut size={16} />
                                Sign Out
                            </Button>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
}
