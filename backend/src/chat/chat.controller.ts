import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Response, Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from './chat.service';
import { AtGuard } from 'src/auth/guards';

@Controller('chat')
@UseGuards(AtGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private prisma: PrismaService,
  ) {}
  @Get('Messages')
  async getMessages(@Req() req) {
    try {
      return await this.chatService.GetMessagesByRoomId(
        parseInt(req.query.roomId),
        req.user.sub.toString(),
      );
    } catch (error) {
      console.log(error);
    }
  }
  @Get('rooms')
  async getRooms(@Req() req) {
    try {
      return await this.chatService.getRooms(req.user.sub.toString());
    } catch (error) {
      console.log(error);
    }
  }
  @Post('CreateRoom')
  async createRoom() {}
}
