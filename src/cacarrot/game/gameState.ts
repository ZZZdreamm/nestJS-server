import { GameTemplate } from './gameTemplate';
import { Player } from './player';

export interface GameState {
  gameTemplate: GameTemplate;
  players: Player[];
  gamecode: string;
  started: string; // need to check states on frontend
  currentQuestion: number;
  time: number;
  gamePhase: number;
  startingTime: number;
  winners: Player[];
  hostConnection: boolean;
  hostId: string;
}
