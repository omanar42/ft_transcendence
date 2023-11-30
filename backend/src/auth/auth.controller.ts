import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { FortyTwoGuard, GoogleGuard, RtGuard } from './guards';

@ApiTags('auth')
@Controller('auth')
export class AuthController {
	constructor(private readonly authService: AuthService) {}

	@ApiOperation({
    summary:
      "Redirects to the 42 OAuth2 provider's login page.",
  })
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

	@UseGuards(RtGuard)
	@Get('refresh')
	async refresh(@Req() req, @Res() res: Response) {
		return this.authService.refresh(req, res);
	}
}
