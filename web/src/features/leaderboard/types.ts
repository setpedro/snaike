export type LeaderboardPlayer = {
    id: string;
    username: string;
    avatar_url?: string;
    provider: "google" | "github" | "twitter";
    total_wins: number;
    fastest_win_duration: number;
    highest_score: number;
    total_games: number;
    win_rate: number;
};
