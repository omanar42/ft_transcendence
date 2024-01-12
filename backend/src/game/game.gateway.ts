import { Logger } from '@nestjs/common';
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

  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    try {
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
      this.gameService.SaveSocket(id.sub.toString(), client);
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
      await this.gameService.invatefriend(client, data_in.friend);
      const oauthId = this.gameService.GetoauthId(client);
      const friend_user = await this.userService.findOneByUsername(
        data_in.friend,
      );
      const friendSocket = this.gameService.GetSocket(friend_user.oauthId);
      await this.gameService.CreateRoom(oauthId, friend_user.oauthId);
      client.join(`room:${oauthId}${friend_user.oauthId}`);
      friendSocket.join(`room:${oauthId}${friend_user.oauthId}`);
      //demo
      const data = {
        // status: 'waiting',
        status: 'start',
        roomId: `room:${oauthId}${friend_user.oauthId}`,
        gameState: this.gameService.GetRoom(
          `room:${oauthId}${friend_user.oauthId}`,
        ),
      };
      this.server
        .to(`room:${oauthId}${friend_user.oauthId}`)
        .emit('start', data);
    } catch (error) {
      this.logger.log(error);
    }
  }
  @SubscribeMessage('addToRoom')
  async handlePlayRandom(@ConnectedSocket() client: Socket) {
    try {
      const oauthId = this.gameService.GetoauthId(client);
      this.gameService.PushOnWaitingList(oauthId);
      const randomPlayers = this.gameService.GetTwoPlayersWaitingList();
      if (randomPlayers) {
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
      await this.prismaService.user.update({
        where: { oauthId: oauthId },
        data: { status: 'INGAME' },
      });
      const gamestate = await this.gameService.GetRoom(roomId);
      if (gamestate) {
        gamestate.paddleMove(oauthId, data.position);
        gamestate.update();
        if (gamestate.winner) {
          this.gameService.HandleEndGame(gamestate);
          return;
        }
        this.server.to(roomId).emit('gameState', gamestate.toJSON());
      }
    } catch (error) {
      console.log(error);
      this.logger.log(error);
    }
  }
}
