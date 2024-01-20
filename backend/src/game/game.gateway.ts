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
import { disconnect, emit } from 'process';
import { Status } from '@prisma/client';
import e from 'express';

@WebSocketGateway({
  port: 3000,
  cors: {
    origin: process.env.FRONTEND_URL,
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
      this.gameService.handledisconnect(client, this.server);
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
      if (id.sub) {
        this.gameService.SaveSocket(id.sub.toString(), client, this.server);
        this.gameService.set_online(id.sub.toString());
      }
    } catch (error) {
      this.logger.log(error);
    }
  }

  afterInit(@ConnectedSocket() client: Socket) {
    this.logger.log('Initialized!');
  }
  @SubscribeMessage('PlayWithFriend')
  async handlePlayWithFriend(
    @ConnectedSocket() client: Socket,
    @MessageBody() data_in,
  ) {
    try {
      if (data_in.status === 'request') {
        await this.gameService.invatefriend(client, data_in);
      } else if (data_in.status === 'reject') {
        this.gameService.Deletegamesatate(
          this.gameService.GetoauthId(client),
          this.server,
        );
        return;
      } else if (data_in.status === 'accept') {
        const data = {
          status: 'start',
          roomId: data_in.roomId,
          gameState: this.gameService.GetRoom(data_in.roomId),
        };
        if (!data.gameState) throw new Error('Game not found');
        await this.gameService.Ingame(data.gameState);
        this.server.to(data_in.roomId).emit('start', data);
      }
    } catch (error) {
      this.server.to(client.id).emit('gameError', { message: error.message });
    }
  }
  @SubscribeMessage('addToRoom')
  async handlePlayRandom(@ConnectedSocket() client: Socket) {
    try {
      const oauthId = this.gameService.GetoauthId(client);
      await this.gameService.PushOnWaitingList(oauthId);
      const randomPlayers = this.gameService.GetTwoPlayersWaitingList();
      if (randomPlayers) {
        await this.gameService.CreateRoom(
          randomPlayers[0],
          randomPlayers[1],
          'Easy',
        );
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
        await this.gameService.Ingame(data.gameState);
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
