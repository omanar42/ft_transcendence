import { Controller, Get, Param, Req, Res, UseGuards } from '@nestjs/common';
import { Response } from 'express';
import { ProfileService } from './profile.service';
import { AtGuard } from 'src/auth/guards';

@UseGuards(AtGuard)
@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username')
  async getStatuses(@Req() req, @Res() res: Response, @Param('username') username : string){
    const statuses = await this.profileService.getStatuses(req.user, username);
    if (!statuses)
      res.status(404).json({message: 'User profile not found'});
    else
      res.json(statuses);
  }

  @Get(':username/info')
  async getProfile(@Req() req, @Res() res: Response, @Param('username') username : string){
    const profile = await this.profileService.getProfile(req.user, username);
    if (!profile)
      res.status(404).json({message: 'User profile not found'});
    else
      res.json(profile);
  }

	// @Get(':username/Friends')
	// async getFriends(@Req() req, @Res() res, @Param('username') username : string)
	// {
	// 	const user = await this.
	// 	if (!user)
	// 		throw new NotFoundException('User profile not found');
	// 	const friends = await this.profileService.userFriends(user, req.user);
	// 	res.json(friends);
	// }

  // @Get('Achievements')
  // async GetAchievements(@Req() req)
  // {
  //     return await this.profileService.getAchievements(req.user);
  // }
}
 