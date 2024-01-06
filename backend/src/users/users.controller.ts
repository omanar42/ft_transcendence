import {
  Controller,
  Get,
  UseGuards,
  Req,
  Res,
  Post,
  Body,
  Param,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AtGuard } from 'src/auth/guards';

@Controller('users')
@ApiTags('users')
@UseGuards(AtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('info')
  async getInfo(@Req() req: any, @Res() res: Response) {
    if (!req.user.sub)
      return res.status(400).json({ message: 'Invalid token' });
    const infos = await this.usersService.getInfo(req.user.sub);
    return res.json(infos);
  }

  @Get('stats')
  async getStats(@Req() req: any, @Res() res: Response) {
    const stats = await this.usersService.getStats(req.user.sub);
    return res.json(stats);
  }

  @Get('allFriends')
  async getAllFriends(@Req() req: any, @Res() res: Response) {
    const friends = await this.usersService.getAllFriends(req.user.sub);
    return res.json(friends);
  }

  @Get('friends')
  async getFriends(@Req() req: any, @Res() res: Response) {
    const friends = await this.usersService.getFriends(req.user.sub);
    return res.json(friends);
  }

  @Get('requests')
  async getRequests(@Req() req: any, @Res() res: Response) {
    const requests = await this.usersService.getRequests(req.user.sub);
    return res.json(requests);
  }

  @Get('invitations')
  async getInvitations(@Req() req: any, @Res() res: Response) {
    const invitations = await this.usersService.getInvitations(req.user.sub);
    return res.json(invitations);
  }

  @Get('blocked')
  async getBlocked(@Req() req: any, @Res() res: Response) {
    const blocks = await this.usersService.getBlocked(req.user.sub);
    return res.json(blocks);
  }

  @Get('avatar/:filename')
  async getPicture(
    @Req() req: any,
    @Res() res: Response,
    @Param('filename') filename: string,
  ) {
    return res.sendFile(filename, { root: './uploads' });
  }

  @Post('add')
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
  async addFriend(
    @Req() req: any,
    @Res() res: Response,
    @Body('friendUser') friendUser: string,
  ) {
    const message = await this.usersService.addFriend(req.user.sub, friendUser);
    return res.json(message);
  }

  @Post('remove')
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
  async removeFriend(
    @Req() req: any,
    @Res() res: Response,
    @Body('friendUser') friendUser: string,
  ) {
    const message = await this.usersService.removeFriend(
      req.user.sub,
      friendUser,
    );
    return res.json(message);
  }

  @Post('accept')
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
  async acceptFriend(
    @Req() req: any,
    @Res() res: Response,
    @Body('friendUser') friendUser: string,
  ) {
    const message = await this.usersService.acceptFriend(
      req.user.sub,
      friendUser,
    );
    return res.json(message);
  }

  @Post('reject')
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
  async rejectFriend(
    @Req() req: any,
    @Res() res: Response,
    @Body('friendUser') friendUser: string,
  ) {
    const message = await this.usersService.rejectFriend(
      req.user.sub,
      friendUser,
    );
    return res.json(message);
  }

  @Post('revoke')
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
  async revokeFriend(
    @Req() req: any,
    @Res() res: Response,
    @Body('friendUser') friendUser: string,
  ) {
    const message = await this.usersService.revokeFriend(
      req.user.sub,
      friendUser,
    );
    return res.json(message);
  }

  @Post('block')
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
  async blockFriend(
    @Req() req: any,
    @Res() res: Response,
    @Body('friendUser') friendUser: string,
  ) {
    const message = await this.usersService.blockFriend(
      req.user.sub,
      friendUser,
    );
    return res.json(message);
  }

  @Post('unblock')
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
  async unblockFriend(
    @Req() req: any,
    @Res() res: Response,
    @Body('friendUser') friendUser: string,
  ) {
    const message = await this.usersService.unblockFriend(
      req.user.sub,
      friendUser,
    );
    return res.json(message);
  }

  @Post('verify2fa')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        token: {
          type: 'string',
        },
      },
    },
  })
  async verify2FA(
    @Req() req: any,
    @Res() res: Response,
    @Body('token') token: string,
  ) {
    const message = await this.usersService.verify2FA(req.user.sub, token);
    return res.json(message);
  }
}
