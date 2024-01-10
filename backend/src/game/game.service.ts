import { Injectable } from '@nestjs/common';
import { GameState } from './gameState';
import { Player } from './player';
import { GameMapService } from './gamemap.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class GameService {
  constructor(
    private gameMapService: GameMapService,
    private usersService: UsersService,
    private gameState: GameState,
  ) {}

  invatefriend = async (client: any, friend: string) => {
    const oauthId = this.GetoauthId(client);
    const friend_user = await this.usersService.findOneByUsername(friend);
    if (friend_user.status === 'INGAME') {
      client.emit(
        'invate',
        "you can't invite this user because he is on another game",
      );
      throw new Error(
        "you can't invite this user because he is on another game",
      );
    }
    const friendSocket = this.GetSocket(friend_user.oauthId);
    if (friendSocket) {
      const data = {
        status: 'invate',
        roomId: `room:${oauthId}${friend_user.oauthId}`,
      };
      friendSocket.emit('invate', data);
      const data2 = {
        status: 'waiting',
        roomId: `room:${oauthId}${friend_user.oauthId}`,
      };
      client.emit('invate', data2);
    } else {
      client.emit('invate', 'this user is offline');
      throw new Error('this user is offline');
    }
  };
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
  CreateRoom = async (oauthId1: string, oauthId2: string) => {
    const key = `room:${oauthId1}${oauthId2}`;
    const value = new GameState();
    value.init(oauthId1, oauthId2);
    const user1 = await this.usersService.findOneById(oauthId1);
    value.playerOne.username = user1.username;
    const user2 = await this.usersService.findOneById(oauthId2);
    value.playerTwo.username = user2.username;
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
