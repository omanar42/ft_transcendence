import { Controller, ForbiddenException, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Response } from 'express';
import { AtGuard, FortyTwoGuard, GoogleGuard, RtGuard } from './guards';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get('42')
	@UseGuards(FortyTwoGuard)
	async fortyTwoAuth() {
		return;
	}

	@Get('42/callback')
	@UseGuards(FortyTwoGuard)
	async fortyTwoAuthCallback(@Req() req, @Res() res: Response) {
		return this.authService.login(req, res);
	}

	@Get('google')
	@UseGuards(GoogleGuard)
	async googleAuth() {
		return;
	}

	@Get('google/callback')
  @UseGuards(GoogleGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
		return this.authService.login(req, res);
  }

	@UseGuards(AtGuard)
	@UseGuards(RtGuard)
	@Get('logout')
	async logout(@Req() req, @Res() res: Response) {
    const user = req.user;
    res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    const ret = this.authService.logout(user.sub);
    if (!ret) throw new ForbiddenException();
    return res.json({message: "logout success"});
	}

	@UseGuards(RtGuard)
	@Get('refresh')
	async refresh(@Req() req, @Res() res: Response) {
		return this.authService.refresh(req, res);
	}
}
