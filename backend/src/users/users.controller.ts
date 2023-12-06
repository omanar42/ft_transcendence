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
    const infos = await this.usersService.getInfo(req.user.sub);
    return res.json(infos);
  }

  @Get("stats")
  async getStats(@Req() req, @Res() res: Response) {
    const stats = await this.usersService.getStats(req.user.sub);
    return res.json(stats);
  }

  @Get("allFriends")
  async getAllFriends(@Req() req, @Res() res: Response) {
    const friends = await this.usersService.getAllFriends(req.user.sub);
    return res.json(friends);
  }

  @Get("friends")
  async getFriends(@Req() req, @Res() res: Response) {
    const friends = await this.usersService.getFriends(req.user.sub);
    return res.json(friends);
  }

  @Get("requests")
  async getRequests(@Req() req, @Res() res: Response) {
    const requests = await this.usersService.getRequests(req.user.sub);
    return res.json(requests);
  }

  @Get("invitations")
  async getInvitations(@Req() req, @Res() res: Response) {
    const invitations = await this.usersService.getInvitations(req.user.sub);
    return res.json(invitations);
  }

  @Get("blocked")
  async getBlocked(@Req() req, @Res() res: Response) {
    const blocks = await this.usersService.getBlocked(req.user.sub);
    return res.json(blocks);
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

  @Post("unblock")
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
  async unblockFriend(@Req() req, @Res() res: Response, @Body("friendUser") friendUser: string) {
    const message = await this.usersService.unblockFriend(req.user.sub, friendUser);
    return res.json(message);
  }

}
