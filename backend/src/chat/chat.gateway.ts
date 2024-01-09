import { Logger, UseGuards } from '@nestjs/common';
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
import { ChatService } from './chat.service';
import {
  CreateMessageDto,
  CreateRoomDto,
  JoinRoomDto,
} from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
// import { verify } from 'jsonwebtoken';
import { AuthService } from 'src/auth/auth.service';
import * as jwt from 'jsonwebtoken';
import { CacheService } from './cache.service';

// import { AtGuard } from 'src/auth/guards';
// import { log } from 'console';

@WebSocketGateway({
  port: 3000,
  cors: {
    origin: 'http://127.0.0.1:5173',
    method: ['GET', 'POST'],
  },
  namespace: 'chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(
    private readonly messagesService: ChatService,
    private prisma: PrismaService, // private AuthService: AuthService,
    private cacheService: CacheService,
  ) {}
  // RoomsTosockets = new Map();
  private logger: Logger = new Logger('ChatGateway');
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
    try {
      this.messagesService.DeleteOauthIdSocket(client);
    } catch (error) {
      this.logger.log(error);
    }
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    // if (!client.handshake.query.token) {
    //   this.logger.log(
    //     `Client disconnected no token: ${client.id} : token ${client.handshake.query.token}`,
    //   ); // todo : add this to the logger
    //   client.disconnect();
    //   console.log(client.id);
    //   return;
    // }
    // console.log(`==========>${client.handshake.query.token}`);
    try {
      const id = await jwt.verify(
        client.handshake.query.token.toString(),
        process.env.AT_SECRET,
      );
      this.messagesService.SetOauthIdSocket(id.sub.toString(), client);
    } catch (error) {
      this.logger.log(error);
    }
  }
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  afterInit(@ConnectedSocket() client: Socket) {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    try {
      await this.messagesService.createMessage(this.server, createMessageDto);
    } catch (error) {
      this.logger.log(error);
    }
  }
  // @SubscribeMessage('blocke_user')
  // async handleBlockUser(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() createMessageDto: CreateMessageDto,
  // ) {
  //   try {
  //     await this.prisma.block.create({
  //       data: {
  //         blockedUserName: createMessageDto.username,
  //       },
  //     });
  //   } catch (error) {
  //     this.logger.log(error);
  //   }
  // } //demo
  @SubscribeMessage('createRoom')
  async handleCreateRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() createRoomDto: CreateRoomDto, // todo : add this decorator to all functions
  ) {
    try {
      const room = await this.messagesService.createRoom(client, createRoomDto);
      this.messagesService.GetUserByUsername(createRoomDto.userName);
      const user = await this.messagesService.GetUserByUsername(
        createRoomDto.userName,
      );
      const _client = await this.messagesService.GetOauthIdSocket(user.oauthId);
      // this.cacheService.delete(`user:${user.oauthId}`);
      // this.cacheService.delete(`user:${user.username}`);
      this.server
        .to(_client.id)
        .emit(
          'roomCreated',
          await this.messagesService.convertRoomToRoom_Front(room),
        );
    } catch (error) {
      this.logger.log(error);
    }
  }
  // @SubscribeMessage('joinRoom')
  // async handleJoinRoom(
  //   @ConnectedSocket() client: Socket,
  //   @MessageBody() createRoomDto: JoinRoomDto,
  // ) {
  //   try {
  //     // const room = await this.messagesService.joinRoom(client, createRoomDto);
  //     this.server.emit('roomJoined', room);
  //   } catch (error) {
  //     this.logger.log(error);
  //   }
  // }
}
