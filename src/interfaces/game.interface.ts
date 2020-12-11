import { IPlayer } from "./player.interface";

export interface IGame {
  id: string;
  players: IPlayer[];
  addPlayer(player: IPlayer): void;
  removePlayer(id: string): void;
  findPlayer(id: string): IPlayer;
  allPlayersMadeChoice(): boolean;
  restorePlayersChoice(): void;
  determineWinner(): string;
}