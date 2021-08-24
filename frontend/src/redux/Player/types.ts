export interface User {
  email: string;
}

export interface Player {
  name: string;
  uuid: string;
  color: string;
  user?: null | User;
  avatar_url: string | null;
  avatar?: string | null;
  total_score: number;
  rank?: number;
}
