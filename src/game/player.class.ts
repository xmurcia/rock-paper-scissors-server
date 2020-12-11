import { IPlayer } from "../interfaces";

export class Player implements IPlayer {
  public id: string;
  public choice: string;

  constructor(options: { [key: string]: string}) {
    this.id = options.id;
    this.choice = null;
  }

  public setChoice(choice: string): void {
    this.choice = choice;
  }
}