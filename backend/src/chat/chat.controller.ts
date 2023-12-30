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
  @Get('rooms')
  async getRooms(@Req() req) {
    return await this.chatService.getRooms(req.user.sub.toString());
  }
  @Post('CreateRoom')
  async createRoom() {}
}
