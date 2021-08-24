import { Player } from 'redux/Player/types';

export interface Vote {
  player_id: string;
  score: Score | null;
}

export interface Story {
  uuid: string;
  name: string;
  players: Player[];
  votes: Vote[];
}

export type Score = number | '?' | '-' | 'Infinity';
