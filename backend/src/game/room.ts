import { Player } from './player';

export class Room {
  id: string;
  players: Player[];

  constructor(id) {
    this.id = id;
    this.players = [];
  }
  addPlayer(player) {
    this.players.push(player);
  }
  isFull() {
    return this.players.length === 2;
  }
  isAvailable() {
    return this.players.length === 1;
  }
}
