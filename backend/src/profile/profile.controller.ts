import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ProfileService } from './profile.service';
import { AtGuard } from 'src/auth/guards';
import { ApiBody, ApiOkResponse, ApiTags } from '@nestjs/swagger';

@Controller('profile')
@ApiTags('profile')
@UseGuards(AtGuard)
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getRelations(
    @Req() req: any,
    @Res() res: Response,
    @Param('username') profile: string,
  ) {
    const relations = await this.profileService.getRelations(req.user, profile);
    if (!relations) res.status(404).json({ message: 'User profile not found' });
    else res.json(relations);
  }

  @Get(':username/info')
  async getProfile(
    @Req() req: any,
    @Res() res: Response,
    @Param('username') username: string,
  ) {
    const profile = await this.profileService.getProfile(username);
    if (!profile) res.status(404).json({ message: 'User profile not found' });
    else res.json(profile);
  }

  @Get(':username/stats')
  async getStats(
    @Req() req: any,
    @Res() res: Response,
    @Param('username') username: string,
  ) {
    const stats = await this.profileService.getStats(username);
    if (!stats) res.status(404).json({ message: 'User profile not found' });
    else res.json(stats);
  }

  @Get(':username/friends')
  async getFriends(
    @Req() req: any,
    @Res() res: Response,
    @Param('username') username: string,
  ) {
    const friends = await this.profileService.getFriends(username);
    if (!friends) res.status(404).json({ message: 'User profile not found' });
    else res.json(friends);
  }
}
