import { Player } from './player';

export class Room {
  id: string;
  players: Player[];

  constructor(id: string) {
    this.id = id;
    this.players = [];
  }
}
