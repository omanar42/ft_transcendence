import { Injectable } from '@nestjs/common';
import { GameState } from './gameState';
import { Player } from './player';
import { GameMapService } from './gamemap.service';

@Injectable()
export class GameService {
  constructor(
    private gameMapService: GameMapService,
    private gameState: GameState,
  ) {}

  update = (gameState: GameState) => {
    gameState.update();
  };
  PushOnWaitingList = (oauthId: string) => {
    const key = 'waitingList';
    const value = this.gameMapService.get(key);
    value.push(oauthId);
    this.gameMapService.set(key, value);
  };
  GetTwoPlayersWaitingList = () => {
    const key = 'waitingList';
    const value = this.gameMapService.get(key);
    if (value.length >= 2) {
      const player1 = value.shift();
      const player2 = value.shift();
      return [player1, player2];
    }
    return null;
  };
  SaveSocket = (oauthId: string, socket: any) => {
    const key = `socket:${oauthId}`;
    this.gameMapService.set(key, socket);
    this.gameMapService.set(`socket:${socket.id}`, oauthId);
  };
  GetSocket = (oauthId: string) => {
    const key = `socket:${oauthId}`;
    return this.gameMapService.get(key);
  };
  GetoauthId = (socket: any) => {
    const key = `socket:${socket.id}`;
    return this.gameMapService.get(key);
  };
  DeleteSocket = (socket: any) => {
    const key = `socket:${socket.id}`;
    const oauthId = this.gameMapService.get(key);
    this.gameMapService.delete(`socket:${oauthId}`);
    this.gameMapService.delete(key);
  };
  CreateRoom = (oauthId1: string, oauthId2: string) => {
    const key = `room:${oauthId1}${oauthId2}`;
    const player1 = new Player(oauthId1, 1);
    const player2 = new Player(oauthId2, 2);
    const value = {
      gameState: new GameState(player1, player2),
    };
    this.gameMapService.set(key, value);
  };
  GetRoom = (roomId: string) => {
    const key = roomId;
    return this.gameMapService.get(key);
  };
  DeleteRoom = (roomId: string) => {
    const key = roomId;
    this.gameMapService.delete(key);
  };
}
