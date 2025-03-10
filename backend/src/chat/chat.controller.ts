import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
} from '@nestjs/common';
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
      return await this.chatService.GetMessagesByRoomId(
        parseInt(req.query.roomId),
        req.user.sub.toString(),
      );
    } catch (error) {
      throw error;
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
      throw error;
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
      const response = await this.chatService.KickUserFromRoom(
        parseInt(body.roomid),
        req.user.sub.toString(),
        body.target_username,
      );
      return res.json(response);
    } catch (error) {
      throw error;
    }
  }
  @Post('mute_user')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        roomId: { type: 'number' },
        target_username: { type: 'string' },
      },
    },
  })
  async muteUser(@Req() req, @Res() res: Response, @Body() body) {
    try {
      const response = await this.chatService.MuteUserFromRoom(
        req.user.sub.toString(),
        body,
        'MUTE',
      );
      return res.json(response);
    } catch (error) {
      throw error;
    }
  }
  @Post('unmute_user')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        roomId: { type: 'number' },
        target_username: { type: 'string' },
      },
    },
  })
  async unmuteUser(@Req() req, @Res() res: Response, @Body() body) {
    try {
      const response = await this.chatService.MuteUserFromRoom(
        req.user.sub.toString(),
        body,
        'UNMUTE',
      );
      return res.json(response);
    } catch (error) {
      throw error;
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
        'BANNED',
      );
      return res.json(response);
    } catch (error) {
      throw error;
    }
  }
  @Post('unban_user')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        roomid: { type: 'number' },
        target_username: { type: 'string' },
      },
    },
  })
  async unbanUser(@Req() req, @Res() res: Response, @Body() body) {
    try {
      const response = await this.chatService.BanUserFromRoom(
        parseInt(body.roomid),
        req.user.sub.toString(),
        body.target_username,
        'MEMBER',
      );
      return res.json(response);
    } catch (error) {
      throw error;
    }
  }
  @Post('add_user')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        roomId: { type: 'number' },
        username: { type: 'string' },
      },
    },
  })
  async addUser(@Req() req, @Res() res: Response, @Body() body) {
    try {
      const response = await this.chatService.AddUserToRoom(
        req.user.sub.toString(),
        body,
      );
      return res.json(response);
    } catch (error) {
      throw error;
    }
  }
  @Post('setadmin')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        roomId: { type: 'number' },
        username: { type: 'string' },
      },
    },
  })
  async setAdmin(@Req() req, @Res() res: Response, @Body() body) {
    try {
      const response = await this.chatService.setAdminForRoom(
        body.roomId,
        req.user.sub.toString(),
        body.username,
      );
      return res.json(response);
    } catch (error) {
      throw error;
    }
  }
  @Post('updateRoom')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        roomId: { type: 'number' },
        roomName: { type: 'string' },
        type: { type: 'string' },
        password: { type: 'string' },
      },
    },
  })
  async updateRoom(@Req() req, @Res() res: Response, @Body() body) {
    try {
      const response = await this.chatService.UpdateRoom(
        req.user.sub.toString(),
        body,
      );
      return res.json(response);
    } catch (error) {
      throw error;
    }
  }
  @Post('joinRoom')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        roomId: { type: 'number' },
        password: { type: 'string' },
      },
    },
  })
  async joinRoom(@Req() req, @Res() res: Response, @Body() body) {
    try {
      const response = await this.chatService.joinRoom(
        req.user.sub.toString(),
        parseInt(body.roomId),
        body.password,
      );
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
  @Get('dms')
  async GetDms(@Req() req, @Res() res: Response) {
    try {
      const response = await this.chatService.getDms(req.user.sub.toString());
      return res.json(response);
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
