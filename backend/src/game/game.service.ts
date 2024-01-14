import { Injectable } from '@nestjs/common';
import { GameState } from './gameState';
import { GameMapService } from './gamemap.service';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { use } from 'passport';
import { Status } from '@prisma/client';

interface PlayerState {
  id: string;
  username: string;
  avatar: string;
  score: number;
}

@Injectable()
export class GameService {
  constructor(
    private gameMapService: GameMapService,
    private usersService: UsersService,
    private gameState: GameState,
    private prisma: PrismaService,
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

  PushOnWaitingList = async (oauthId: string) => {
    const key = 'waitingList';
    const arr = [];
    const value = this.gameMapService.get(key);
    const user = await this.usersService.findOneById(oauthId);
    if (user.status === 'INGAME' || value.includes(oauthId)) {
      console.log(this.GetSocket(oauthId).id);
      throw new Error("you can't play because you are on another game");
    }
    // if (value.includes(oauthId)) {
    //   return;
    // }
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
    value.playerOne.avatar = user1.avatar;
    const user2 = await this.usersService.findOneById(oauthId2);
    value.playerTwo.username = user2.username;
    value.playerTwo.avatar = user2.avatar;
    this.gameMapService.set(oauthId1, key);
    this.gameMapService.set(oauthId2, key);
    this.gameMapService.set(key, value);
  };

  // handelDisconnect = async (socket: any) => {
  // };

  GetRoom = (roomId: string) => {
    const key = roomId;
    // console.log(this.gameMapService.get(key));
    return this.gameMapService.get(key);
  };

  GetRoomIdByOauthId = (oauthId: string) => {
    return this.gameMapService.get(oauthId);
  };

  DeleteRoom = (roomId: string) => {
    const key = roomId;
    this.gameMapService.delete(key);
  };
  // offline = async (oauthId: string) => {

  HandleEndGame = async (gameState: GameState, server: any) => {
    let winner: PlayerState;
    let loser: PlayerState;
    this.DeleteRoom(gameState.roomId);
    if (gameState.winner === 'playerOne') {
      winner = {
        id: gameState.playerOne.id,
        username: gameState.playerOne.username,
        avatar: gameState.playerOne.avatar,
        score: gameState.playerOne.score,
      };
      loser = {
        id: gameState.playerTwo.id,
        username: gameState.playerTwo.username,
        avatar: gameState.playerTwo.avatar,
        score: gameState.playerTwo.score,
      };
    } else if (gameState.winner === 'playerTwo') {
      winner = {
        id: gameState.playerTwo.id,
        username: gameState.playerTwo.username,
        avatar: gameState.playerTwo.avatar,
        score: gameState.playerTwo.score,
      };
      loser = {
        id: gameState.playerOne.id,
        username: gameState.playerOne.username,
        avatar: gameState.playerOne.avatar,
        score: gameState.playerOne.score,
      };
    }
    // await this.usersService.setStatus(winner.id, Status['ONLINE']);
    // await this.usersService.setStatus(loser.id, Status['ONLINE']);
    // await this.prisma.user.update({
    //   where: { oauthId: winner.id },
    //   data: { status: 'ONLINE' },
    // });
    // await this.prisma.user.update({
    //   where: { oauthId: loser.id },
    //   data: { status: 'ONLINE' },
    // });
    // console.log(
    //   await this.usersService.findOneById(winner.id).then((user) => user.status),
    // );
    // console.log(
    //   await this.usersService.findOneById(winner.id).then((user) => user.username),
    // );
    // console.log(
    //   await this.usersService.findOneById(loser.id).then((user) => user.status),
    // );
    // console.log(
    //   await this.usersService.findOneById(loser.id).then((user) => user.username),
    // );
    this.gameMapService.delete(winner.id);
    this.gameMapService.delete(loser.id);
    this.usersService.HandleEndGame(winner, loser);
    server.to(gameState.roomId).emit('gameOver', winner.username);
  };
}
