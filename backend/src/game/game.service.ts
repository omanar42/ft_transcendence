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
    const user = await this.usersService.findOneById(oauthId);
    if (!friend_user || !user) {
      throw new Error('this user is not exist');
    }
    if (friend_user.status === 'INGAME' || user.status === 'INGAME') {
      throw new Error(
        "you can't invite this user because he is on another game",
      );
    }
    const friendSocket = this.GetSocket(friend_user.oauthId);
    if (friendSocket) {
      const data = {
        status: 'req',
        roomId: `room:${oauthId}${friend_user.oauthId}`,
      };
      await this.CreateRoom(oauthId, friend_user.oauthId);
      client.join(`room:${oauthId}${friend_user.oauthId}`);
      friendSocket.join(`room:${oauthId}${friend_user.oauthId}`);
      friendSocket.emit('invitation', data);
      // const data2 = {
      // meslalla9082062
      //   status: 'waiting',
      //   roomId: `room:${oauthId}${friend_user.oauthId}`,
      // };
      // client.emit('invitation', data2);
    } else {
      client.emit('invitation', 'this user is offline');
      throw new Error('this user is offline');
    }
  };
  update = (gameState: GameState) => {
    gameState.update();
  };

  PushOnWaitingList = async (oauthId: string) => {
    const key = 'waitingList';
    const value = this.gameMapService.get(key);
    const user = await this.usersService.findOneById(oauthId);
    if (user.status === 'INGAME' || value.includes(oauthId)) {
      console.log(user.status);
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

  SaveSocket = (oauthId: string, socket: any, server: any) => {
    const key = `socket:${oauthId}`;
    if (this.gameMapService.get(key)) {
      const game = this.GetRoom(this.gameMapService.get(oauthId));
      if (game) {
        if (game.playerOne.id === oauthId) {
          game.winner = 'playerTwo';
          this.HandleEndGame(game, server);
        }
        if (game.playerTwo.id === oauthId) {
          game.winner = 'playerOne';
          this.HandleEndGame(game, server);
        }
      }
    }
    if (this.gameMapService.get(key)) {
      this.GetSocket(oauthId).disconnect(true);
    }
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
  set_offline = async (oauthId: string) => {
    this.usersService.setStatus(oauthId, Status['OFFLINE']);
  };
  set_online = async (oauthId: string) => {
    this.usersService.setStatus(oauthId, Status['ONLINE']);
  }
  checkoffline = async (gamestate: GameState) => {
    const player1 = await this.usersService.findOneById(gamestate.playerOne.id);
    const player2 = await this.usersService.findOneById(gamestate.playerTwo.id);
    if (player1.status === 'OFFLINE') {
      console.log('player1 offline');
      gamestate.winner = 'playerTwo';
      return true;
    }
    if (player2.status === 'OFFLINE') {
      console.log('player2 offline');
      gamestate.winner = 'playerOne';
      return true;
    }
    return false;
  };
  Ingame = async (gamestate: GameState) => {
    const player1 = await this.usersService.findOneById(gamestate.playerOne.id);
    const player2 = await this.usersService.findOneById(gamestate.playerTwo.id);
    await this.usersService.setStatus(player1.oauthId, Status['INGAME']);
    await this.usersService.setStatus(player2.oauthId, Status['INGAME']);
  };
  HandleEndGame = async (gameState: GameState, server: any) => {
    let winner: PlayerState;
    let loser: PlayerState;
    // console.log(gameState);
    if (!this.GetRoom(gameState.roomId)) {
      return;
    }
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
    console.log('winner', winner);
    server.to(gameState.roomId).emit('gameOver', winner.username);
    // just the online player will leave the room
    const user1 = await this.usersService.findOneById(winner.id);
    const user2 = await this.usersService.findOneById(loser.id);
    if (user1.status !== 'OFFLINE') {
      // this.GetSocket(winner.id).leave(gameState.roomId);
      await this.usersService.setStatus(user1.oauthId, Status['ONLINE']);
    }
    if (user2.status !== 'OFFLINE') {
      // this.GetSocket(loser.id).leave(gameState.roomId);
      await this.usersService.setStatus(user2.oauthId, Status['ONLINE']);
    }
    //delete room from server
    // server.delete(gameState.roomId);
  };
}
