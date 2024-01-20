import { Injectable } from '@nestjs/common';
import { GameState } from './gameState';
import { GameMapService } from './gamemap.service';
import { UsersService } from 'src/users/users.service';
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
  ) {}

  invatefriend = async (client: any, data_in: any) => {
    const oauthId = this.GetoauthId(client);
    const friend_user = await this.usersService.findOneByUsername(
      data_in.friend,
    );
    const user = await this.usersService.findOneById(oauthId);
    if (!friend_user || !user)
      throw new Error('User not found');
    if (this.gameMapService.get(oauthId))
      throw new Error('You are already in game');
    if (this.gameMapService.get(friend_user.oauthId))
      throw new Error('This user is already in game');
    if (friend_user.status === 'INGAME' || user.status === 'INGAME')
      throw new Error('This user is already in game');
    if (data_in.friend === user.username)
      throw new Error("You can't invite yourself");
    const friendSocket = this.GetSocket(friend_user.oauthId);
    if (friendSocket) {
      const data = {
        status: 'req',
        roomId: `room:${oauthId}${friend_user.oauthId}`,
      };
      await this.CreateRoom(oauthId, friend_user.oauthId, data_in.gameMode);
      client.join(`room:${oauthId}${friend_user.oauthId}`);
      friendSocket.join(`room:${oauthId}${friend_user.oauthId}`);
      friendSocket.emit('invitation', data);
    } else {
      client.emit('gameError', 'Can not play with offline user');
    }
  };
  update = (gameState: GameState) => {
    gameState.update();
  };
  handledisconnect = async (client: any, server: any) => {
    const oauthId = this.GetoauthId(client);
    let waitingList = this.gameMapService.get('waitingList');
    if (waitingList.includes(oauthId)) {
      waitingList = waitingList.filter((item) => item !== oauthId);
      this.gameMapService.set('waitingList', waitingList);
    }
    const game = this.GetRoom(this.gameMapService.get(oauthId));
    if (game) {
      if (game.playerOne.id === oauthId) {
        game.winner = 'playerTwo';
      }
      if (game.playerTwo.id === oauthId) {
        game.winner = 'playerOne';
      }
      this.HandleEndGame(game, server);
    }
    this.set_offline(oauthId);
    this.DeleteSocket(client);
  };
  PushOnWaitingList = async (oauthId: string) => {
    const key = 'waitingList';
    const value = this.gameMapService.get(key);
    const user = await this.usersService.findOneById(oauthId);
    if (user.status === 'INGAME' || value.includes(oauthId)) {
      throw new Error("You can't play now");
    }
    value.push(oauthId);
    this.gameMapService.set(key, value);
  };
  Deletegamesatate = (oauthId: string, server: any) => {
    const key = this.gameMapService.get(oauthId);
    if (key) {
      const game = this.gameMapService.get(key);
      if (game) {
        if (game.playerOne.id === oauthId) {
          server
            .to(this.GetSocket(game.playerTwo.id).id)
            .emit('gameError', { message: 'Request rejected' });
        }
        if (game.playerTwo.id === oauthId) {
          server.to(this.GetSocket(game.playerOne.id).id).emit('gameError', {
            message: 'Request rejected',
          });
        }
        this.gameMapService.delete(game.playerOne.id);
        this.gameMapService.delete(game.playerTwo.id);
        this.gameMapService.delete(key);
      }
    }
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

  CreateRoom = async (oauthId1: string, oauthId2: string, gameMode: string) => {
    const key = `room:${oauthId1}${oauthId2}`;
    const value = new GameState();
    value.init(oauthId1, oauthId2);
    const user1 = await this.usersService.findOneById(oauthId1);
    value.playerOne.username = user1.username;
    value.playerOne.avatar = user1.avatar;
    value.gameMode = gameMode;
    const user2 = await this.usersService.findOneById(oauthId2);
    value.playerTwo.username = user2.username;
    value.playerTwo.avatar = user2.avatar;
    this.gameMapService.set(oauthId1, key);
    this.gameMapService.set(oauthId2, key);
    this.gameMapService.set(key, value);
  };

  GetRoom = (roomId: string) => {
    const key = roomId;
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
    await this.usersService.setStatus(oauthId, Status['OFFLINE']);
  };
  set_online = async (oauthId: string) => {
    await this.usersService.setStatus(oauthId, Status['ONLINE']);
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
    this.gameMapService.delete(winner.id);
    this.gameMapService.delete(loser.id);
    this.usersService.HandleEndGame(winner, loser);
    server.to(gameState.roomId).emit('gameOver', { winner: winner.username });
    const user1 = await this.usersService.findOneById(winner.id);
    const user2 = await this.usersService.findOneById(loser.id);
    if (user1.status !== 'OFFLINE') {
      await this.usersService.setStatus(user1.oauthId, Status['ONLINE']);
    }
    if (user2.status !== 'OFFLINE') {
      await this.usersService.setStatus(user2.oauthId, Status['ONLINE']);
    }
  };
}
