export interface IPlayer {
  id: string;
  choice: string;
  setChoice(choice: string): void;
}