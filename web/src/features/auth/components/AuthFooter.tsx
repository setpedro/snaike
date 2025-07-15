import { useNavigate } from "react-router-dom";

export function AuthFooter() {
    const navigate = useNavigate();

    return (
        <div className="fixed bottom-0 right-0 left-0 text-center py-3">
            <div className="text-white/60 text-xs">
                You're logged out,{" "}
                <button
                    onClick={() => navigate("/login")}
                    className="text-emerald-400 hover:text-emerald-300 transition-colors duration-200 font-medium underline decoration-emerald-400/50 hover:decoration-emerald-300 underline-offset-2"
                >
                    log in
                </button>{" "}
                to save your scores
            </div>
        </div>
    );
}
