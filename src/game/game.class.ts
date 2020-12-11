import { IGame } from "../interfaces/game.interface";
import { IPlayer } from "../interfaces/player.interface";

export class Game implements IGame {
  public id: string;
  public players: IPlayer[];

  constructor(options: { [key: string]: any }) {
    this.id = options.id;
    this.players = [options.player];
  }

  public addPlayer(player): void {
    this.players = [ ...this.players, player];
  }

  public removePlayer(id: string): void {
    const playerIndex = this.players.findIndex((player) => player.id === id);

    if (playerIndex !== -1) {
      this.players = [ ...this.players.slice(0, playerIndex), ...this.players.slice(playerIndex + 1)];
    }
  }

  public findPlayer(id: string): IPlayer {
    return this.players.find(player => player.id === id);
  }

  public allPlayersMadeChoice(): boolean {
    return this.players.every(player => player.choice);
  }

  public restorePlayersChoice(): void {
    this.players.forEach(player => player.choice = null);
  }

  public determineWinner(): string {
    const resultMap = {
      scissors: { scissors: -1, paper: 0, rock: 1 },
      paper: { scissors: 1, paper: -1, rock: 0 },
      rock: { scissors: 0, paper: 1, rock: -1 },
    }

    const result = resultMap[this.players[0].choice][this.players[1].choice];

    return result === -1 ? 'TIE' : this.players[result].id;
  };
}