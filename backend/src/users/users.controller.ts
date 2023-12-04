import { Controller, Get, UseGuards, Req, Res, Post, Body } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AtGuard } from 'src/auth/guards';

@Controller('users')
@ApiTags('users')
@UseGuards(AtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("info")
  async getInfo(@Req() req, @Res() res: Response) {
    const infos = await this.usersService.getInfo(req.user);
    return res.json(infos);
  }

  @Get("status")
  async getStatus(@Req() req, @Res() res: Response) {
    const status = await this.usersService.getStatus(req.user);
    return res.json(status);
  }

  @Get("level")
  async getLevel(@Req() req, @Res() res: Response) {
    const level = await this.usersService.getLevel(req.user);
    return res.json(level);
  }

  @Get("stats")
  async getStats(@Req() req, @Res() res: Response) {
    const stats = await this.usersService.getStats(req.user);
    return res.json(stats);
  }

  @Post("add")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        friendUser: {
          type: 'string',
        },
      },
    },
  })
  async addFriend(@Req() req, @Res() res: Response, @Body("friendUser") friendUser: string) {
    const message = await this.usersService.addFriend(req.user.sub, friendUser);
    return res.json(message);
  }

  @Post("remove")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        friendUser: {
          type: 'string',
        },
      },
    },
  })
  async removeFriend(@Req() req, @Res() res: Response, @Body("friendUser") friendUser: string) {
    const message = await this.usersService.removeFriend(req.user.sub, friendUser);
    return res.json(message);
  }

  @Post("accept")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        friendUser: {
          type: 'string',
        },
      },
    },
  })
  async acceptFriend(@Req() req, @Res() res: Response, @Body("friendUser") friendUser: string) {
    const message = await this.usersService.acceptFriend(req.user.sub, friendUser);
    return res.json(message);
  }

  @Post("reject")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        friendUser: {
          type: 'string',
        },
      },
    },
  })
  async rejectFriend(@Req() req, @Res() res: Response, @Body("friendUser") friendUser: string) {
    const message = await this.usersService.rejectFriend(req.user.sub, friendUser);
    return res.json(message);
  }

  @Post("revoke")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        friendUser: {
          type: 'string',
        },
      },
    },
  })
  async revokeFriend(@Req() req, @Res() res: Response, @Body("friendUser") friendUser: string) {
    const message = await this.usersService.revokeFriend(req.user.sub, friendUser);
    return res.json(message);
  }

  @Post("block")
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        friendUser: {
          type: 'string',
        },
      },
    },
  })
  async blockFriend(@Req() req, @Res() res: Response, @Body("friendUser") friendUser: string) {
    const message = await this.usersService.blockFriend(req.user.sub, friendUser);
    return res.json(message);
  }

}
