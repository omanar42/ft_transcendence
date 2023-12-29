import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
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
  @Get('Rooms')
  async getRooms(@Req() req) {
    console.log(req.user.sub);
    return await this.chatService.getRooms();
  }
  @Post('CreateRoom')
  async createRoom() {
  }
}