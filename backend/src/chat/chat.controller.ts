import { Controller, Get, Post, Req, UseGuards } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Response, Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from './chat.service';
import { AtGuard } from 'src/auth/guards';
import { CacheService } from './cache.service';
import { ApiTags } from '@nestjs/swagger';

@Controller('chat')
@ApiTags('chat')
@UseGuards(AtGuard)
export class ChatController {
  constructor(
    private readonly chatService: ChatService,
    private prisma: PrismaService,
    private cacheService: CacheService,
  ) {}
  @Get('Messages')
  async getMessages(@Req() req) {
    try {
      // this.cacheService.delete(
      //   `messages:${req.query.roomId.toString()}${req.user.sub.toString()}`,
      // );
      return await this.chatService.GetMessagesByRoomId(
        parseInt(req.query.roomId),
        req.user.sub.toString(),
      );
    } catch (error) {
      console.log(error);
    }
  }
  @Get('explore')
  async explore(@Req() req) {
    try {
      return await this.chatService.explore(req.user.sub.toString());
    } catch (error) {
      console.log(error);
    }
  }
  @Get(`roomUsers`)
  async getRoomUsers(@Req() req) {
    try {
      return await this.chatService.GetRoomUsers(parseInt(req.query.roomId));
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
