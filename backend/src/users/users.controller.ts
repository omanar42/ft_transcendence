import { Controller, Get, UseGuards, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiTags } from '@nestjs/swagger';
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
}
