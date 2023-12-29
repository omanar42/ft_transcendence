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
import { ChatService } from './chat.service';
import {
  CreateMessageDto,
  CreateRoomDto,
  JoinRoomDto,
} from './dto/create-message.dto';
import { PrismaService } from 'src/prisma/prisma.service';
// import { log } from 'console';
// const port = process.env.PORT || 3000;

@WebSocketGateway({
  port: 3000,
  cors: {
    origin: 'http://127.0.0.1:5173',
    method: ["GET", "POST"],
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
    private prisma: PrismaService,
  ) {}
  RoomsTosockets = new Map();
  private logger: Logger = new Logger('ChatGateway');
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`); // todo : remove socketId from user
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
    try {
      await this.prisma.user.update({
        where: {
          username: client.handshake.headers.username.toString(),
        },
        data: {
          socketId: client.id,
        },
      });
    } catch (error) {
      this.logger.log(error);
    }
  }
  afterInit() {
    this.logger.log('Initialized!');
  }

  @SubscribeMessage('message')
  async handleMessage(
    @ConnectedSocket() client: Socket,
    @MessageBody() createMessageDto: CreateMessageDto,
  ) {
    try {
      await this.messagesService.createMessage(client, createMessageDto);
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
      // this.server.to(room.id.toString()).emit('roomCreated', room);
      const room_front = await this.messagesService.convertRoomToRoom_Front(
        createRoomDto,
        room,
      );
      console.log(room_front);
      this.server.emit('roomCreated', room_front);
    } catch (error) {
      this.logger.log(error);
    }
  }
  @SubscribeMessage('joinRoom')
  async handleJoinRoom(
    @ConnectedSocket() client: Socket,
    @MessageBody() createRoomDto: JoinRoomDto,
  ) {
    try {
      const room = await this.messagesService.joinRoom(client, createRoomDto);
      this.server.emit('roomJoined', room);
    } catch (error) {
      this.logger.log(error);
    }
  }
}
