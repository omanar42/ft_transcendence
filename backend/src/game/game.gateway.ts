import { Get, Logger } from '@nestjs/common';
import {
  ConnectedSocket,
  MessageBody,
  OnGatewayConnection,
  OnGatewayDisconnect,
  OnGatewayInit,
  SubscribeMessage,
  WebSocketGateway,
  WebSocketServer,
} from '@nestjs/websockets';
import { Server, Socket } from 'socket.io';
import { PrismaService } from 'src/prisma/prisma.service';
import * as jwt from 'jsonwebtoken';
import { GameService } from './game.service';
import { GameState } from './gameState';
import { stat } from 'fs';
import { subscribe } from 'diagnostics_channel';
import { UsersService } from 'src/users/users.service';
import { emit } from 'process';
import { Status } from '@prisma/client';

@WebSocketGateway({
  port: 3000,
  cors: {
    origin: 'http://127.0.0.1:5173',
    method: ['GET', 'POST'],
  },
  namespace: 'game',
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(
    private gameService: GameService,
    private userService: UsersService,
    private prismaService: PrismaService,
  ) {}
  private logger: Logger = new Logger('GameGateway');

  async handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    try {
      const oauthId = this.gameService.GetoauthId(client);
      const gameState = this.gameService.GetRoom(
        this.gameService.GetRoomIdByOauthId(oauthId),
      );
      if (gameState) {
        if (gameState.playerOne.id === oauthId) {
          gameState.winner = 'playerTwo';
        } else if (gameState.playerTwo.id === oauthId) {
          gameState.winner = 'playerOne';
        }
        this.gameService.HandleEndGame(gameState, this.server);
      }
      await this.prismaService.user.update({
        where: { oauthId: oauthId },
        data: { status: Status['OFFLINE'] },
      });
      this.gameService.DeleteSocket(client);
    } catch (error) {
      this.logger.log(error);
    }
  }

  async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    try {
      const id = await jwt.verify(
        client.handshake.query.token.toString(),
        process.env.AT_SECRET,
      );
      // the expered token
      if (!id.sub) {
        // client.disconnect(true);
        throw new Error('invalid token');
      }
      this.gameService.SaveSocket(id.sub.toString(), client);
      if (id.sub) {
        await this.prismaService.user.update({
          where: { oauthId: id.sub.toString() },
          data: { status: Status['ONLINE'] },
        });
      }
    } catch (error) {
      this.logger.log(error);
    }
  }

  afterInit(@ConnectedSocket() client: Socket) {
    this.logger.log('Initialized!');
  }
  // @SubscribeMessage('addToRoom')
  // async handleAddToRoom(@ConnectedSocket() client: Socket){
  //   console.log('add to room');
  //   try {
  //   } catch (error) {
  //     this.logger.log(error);
  //   }
  // }
  // @SubscribeMessage('startgame')
  // @SubscribeMessage('playrandom')
  @SubscribeMessage('PlayWithFriend')
  async handlePlayWithFriend(
    @ConnectedSocket() client: Socket,
    @MessageBody() data_in,
  ) {
    try {
      // console.log(data_in);
      console.log(data_in);
      if (data_in.status === 'request') {
        console.log('request');
        await this.gameService.invatefriend(client, data_in.friend);
        const oauthId = this.gameService.GetoauthId(client);
        const friend_user = await this.userService.findOneByUsername(
          data_in.friend,
        );
        const friendSocket = this.gameService.GetSocket(friend_user.oauthId);
        await this.gameService.CreateRoom(oauthId, friend_user.oauthId);
        console.log(friend_user.oauthId);
        client.join(`room:${oauthId}${friend_user.oauthId}`);
        friendSocket.join(`room:${oauthId}${friend_user.oauthId}`);
      }
      //demo
      else if (data_in.status === 'accept') {
        console.log('accept');
        const data = {
          // status: 'waiting',
          status: 'start',
          roomId: data_in.roomId,
          gameState: this.gameService.GetRoom(data_in.roomId),
        };
        this.server.to(data_in.roomId).emit('start', data);
      }
    } catch (error) {
      this.logger.log(error);
    }
  }
  @SubscribeMessage('addToRoom')
  async handlePlayRandom(@ConnectedSocket() client: Socket) {
    try {
      const oauthId = this.gameService.GetoauthId(client);
      await this.gameService.PushOnWaitingList(oauthId);
      const randomPlayers = this.gameService.GetTwoPlayersWaitingList();
      if (randomPlayers) {
        await this.prismaService.user.update({
          where: { oauthId: oauthId },
          data: { status: Status['INGAME'] },
        });
        await this.gameService.CreateRoom(randomPlayers[0], randomPlayers[1]);
        const client_1 = this.gameService.GetSocket(randomPlayers[0]);
        client_1.join(`room:${randomPlayers[0]}${randomPlayers[1]}`);
        const client_2 = this.gameService.GetSocket(randomPlayers[1]);
        client_2.join(`room:${randomPlayers[0]}${randomPlayers[1]}`);
        const data = {
          status: 'start',
          roomId: `room:${randomPlayers[0]}${randomPlayers[1]}`,
          gameState: await this.gameService.GetRoom(
            `room:${randomPlayers[0]}${randomPlayers[1]}`,
          ),
        };
        this.server
          .to(`room:${randomPlayers[0]}${randomPlayers[1]}`)
          .emit('start', data);
      }
    } catch (error) {
      this.logger.log(error);
    }
  }

  @SubscribeMessage('paddlePosition')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() data: any,
  ) {
    try {
      const roomId = data.roomId;
      const oauthId = this.gameService.GetoauthId(client);
      const gamestate = await this.gameService.GetRoom(roomId);
      if (gamestate) {
        gamestate.paddleMove(oauthId, data.position);
        gamestate.update();
        if (gamestate.winner) {
          this.gameService.HandleEndGame(gamestate, this.server);
          return;
        }
        this.server.to(roomId).emit('gameState', gamestate.toJSON());
      }
    } catch (error) {
      this.logger.log(error);
    }
  }
}
