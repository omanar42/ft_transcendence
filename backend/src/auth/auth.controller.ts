import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@Get('42')
	@UseGuards(AuthGuard('42'))
	async fortyTwoAuth() {
		return;
	}

	@Get('42/callback')
	@UseGuards(AuthGuard('42'))
	async fortyTwoAuthRedirect(@Req() req, @Res() res) {
		return this.authService.fortyTwoLogin(req, res);
	}
}
