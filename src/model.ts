export interface Cell {
  position: string;
  value: string | null;
  default: boolean;
  error: boolean;
}

export interface Stat {
  difficulty: string;
  date: string;
  duration: number;
}

export interface GameStats {
  [key: string]: Stat[];
}
