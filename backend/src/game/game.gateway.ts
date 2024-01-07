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
// import { verify } from 'jsonwebtoken';
import { AuthService } from 'src/auth/auth.service';
import * as jwt from 'jsonwebtoken';
import { GameService } from './game.service';
import { GameState } from './gameState';

@WebSocketGateway({
  port: 3000,
  cors: {
    origin: 'http://127.0.0.1:5173',
    // method: ['GET', 'POST'],
  },
  namespace: 'game',
})
export class GameGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(private gameService: GameService) {}
  private logger: Logger = new Logger('GameGateway');
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    try {
      this.gameService.DeleteSocket(client);
    } catch (error) {
      this.logger.log(error);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    try {
      const id = await jwt.verify(
        client.handshake.query.token.toString(),
        process.env.AT_SECRET,
      );
      this.gameService.SaveSocket(id.sub.toString(), client);
      // this.messagesService.SetOauthIdSocket(id.sub.toString(), client);
    } catch (error) {
      this.logger.log(error);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(@ConnectedSocket() client: Socket) {
    this.logger.log('Initialized!');
  }
  // @SubscribeMessage('startgame')
  @SubscribeMessage('playrandom')
  async handlePlayRandom(@ConnectedSocket() client: Socket) {
    try {
      const oauthId = this.gameService.GetoauthId(client);
      this.gameService.PushOnWaitingList(oauthId);
      const randomPlayers = this.gameService.GetTwoPlayersWaitingList();
      if (randomPlayers) {
        this.gameService.CreateRoom(randomPlayers[0], randomPlayers[1]);
        const gamestate = this.gameService.GetRoom(
          `room:${randomPlayers[0]}${randomPlayers[1]}`,
        );
        const client_1 = this.gameService.GetSocket(randomPlayers[0]);
        client_1.join(`room:${randomPlayers[0]}${randomPlayers[1]}`);
        const client_2 = this.gameService.GetSocket(randomPlayers[1]);
        client_2.join(`room:${randomPlayers[0]}${randomPlayers[1]}`);
        this.server.to(gamestate.roomId).emit('startgame', gamestate);
      }
    } catch (error) {
      this.logger.log(error);
    }
  }
  @SubscribeMessage('paddlemove')
  async handleMessage(@ConnectedSocket() client: Socket, data: any) {
    try {
      const roomId = data.roomId;
      const oauthId = this.gameService.GetoauthId(client);
      const gamestate = this.gameService.GetRoom(roomId);
      gamestate.paddleMove(oauthId, data.position);
      this.server.to(roomId).emit('paddlemove', gamestate);
    } catch (error) {
      this.logger.log(error);
    }
  }
}
