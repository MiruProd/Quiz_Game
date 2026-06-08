export interface UserStats {
  gamesPlayed: number;
  totalScore: number;
  averagePercentage: number;
  categoryHighScores: Record<string, number>;
}

export interface User {
  id: string;
  username: string;
  token: string;
  loginTime: string;
  createdAt: string;
  level: number;
  xp: number;
  avatarUrl: string;
  achievements: string[];
  stats: UserStats;
  history?: any[];
}
