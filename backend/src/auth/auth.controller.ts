import { Controller, Get, Req, Res, UseGuards } from '@nestjs/common';
import { AuthService } from './auth.service';
import { FortyTwoGuard } from './guards/FortyTwo.guard';
import { GoogleOauthGuard } from './guards/google-oauth.guard';
import { ApiOperation, ApiTags } from '@nestjs/swagger';

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
		return this.authService.fortyTwoLogin(req, res);
	}

	@Get('google')
	@UseGuards(GoogleOauthGuard)
	async googleAuth() {
		return;
	}

	@Get('google/callback')
  @UseGuards(GoogleOauthGuard)
  async googleAuthCallback(@Req() req, @Res() res: Response) {
		return this.authService.googleLogin(req, res);
  }
}
