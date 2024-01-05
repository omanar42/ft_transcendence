import { Body, Controller, Get, Post, Req, Res, UseGuards } from '@nestjs/common';
// eslint-disable-next-line @typescript-eslint/no-unused-vars
import { Response, Request } from 'express';
import { PrismaService } from 'src/prisma/prisma.service';
import { ChatService } from './chat.service';
import { AtGuard } from 'src/auth/guards';
import { CacheService } from './cache.service';
import { ApiBody, ApiTags } from '@nestjs/swagger';
import { Console } from 'console';

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
  @Post('leaveroom')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        roomId: { type: 'number' },
        newOwner: { type: 'string' },
      },
    },
  })
  async leaveRoom(@Req() req, @Res() res: Response, @Body() body) {
    try {
      const data = {
        roomId: parseInt(body.roomId),
        newOwner: body.newOwner,
      };
      const response = await this.chatService.Leaveroom(
        req.user.sub.toString(),
        data,
      );
      return res.json(response);
    } catch (error) {
      console.log(error);
    }
  }
  @Post('kick_user')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        roomid: { type: 'number' },
        target_username: { type: 'string' },
      },
    },
  })
  async kickUser(@Req() req, @Res() res: Response, @Body() body) {
    try {
      // console.log(body.target_username);
      const response = await this.chatService.KickUserFromRoom(
        parseInt(body.roomid),
        req.user.sub.toString(),
        body.target_username,
      );
      return res.json(response);
    } catch (error) {
      console.log(error);
    }
  }
  @Post('ban_user')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        roomid: { type: 'number' },
        target_username: { type: 'string' },
      },
    },
  })
  async banUser(@Req() req, @Res() res: Response, @Body() body) {
    try {
      const response = await this.chatService.BanUserFromRoom(
        parseInt(body.roomid),
        req.user.sub.toString(),
        body.target_username,
      );
      console.log(response);
      return res.json(response);
    } catch (error) {
      console.log(error);
    }
  }
  @Post('joinRoom')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        roomId: { type: 'number' },
        userotherId: { type: 'string' },
      },
    },
  })
  async joinRoom(@Req() req, @Res() res: Response, @Body() body) {
    try {
      const response = await this.chatService.joinRoom(
        req.user.sub.toString(),
        parseInt(body.roomId),
      );
      console.log(response);
      return res.json(response);
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
}
