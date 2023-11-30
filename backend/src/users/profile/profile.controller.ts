import { Controller, Get, Param, Req, Res } from '@nestjs/common';
import { ProfileService } from './profile.service';

@Controller('profile')
export class ProfileController {
  constructor(private readonly profileService: ProfileService) {}

  @Get(':username/profile')
  async getProfile(@Req() req, @Res() res, @Param('username') username : string){
    const profile = await this.profileService.getProfile(req.user, username);
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
 