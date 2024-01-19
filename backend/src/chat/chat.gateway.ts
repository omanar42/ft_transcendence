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
import { CreateMessageDto, CreateRoomDto } from './dto/create-message.dto';
import * as jwt from 'jsonwebtoken';

@WebSocketGateway({
  port: 3000,
  cors: {
    origin: process.env.FRONTEND_URL,
  },
  namespace: 'chat',
})
export class ChatGateway
  implements OnGatewayInit, OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer()
  server: Server;
  constructor(private readonly messagesService: ChatService) {}
  private logger: Logger = new Logger('ChatGateway');
  handleDisconnect(client: Socket) {
    this.logger.log(`Client disconnected: ${client.id}`);
  }

  async handleConnection(@ConnectedSocket() client: Socket, ...args: any[]) {
    this.logger.log(`Client connected: ${client.id}`);
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
}
