import { Provider } from "@supabase/supabase-js";

export type LeaderboardPlayer = {
    id: string;
    username: string;
    avatar_url?: string;
    providers: Provider[];
    total_wins: number;
    fastest_win_duration: number;
    highest_score: number;
    total_games: number;
    win_rate: number;
};

export type BasePlayerCardProps = {
    player: LeaderboardPlayer;
    rank: number;
};

export type ChampionCardProps = BasePlayerCardProps & {
    rank: 1 | 2 | 3;
};
