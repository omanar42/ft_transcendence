import { BadRequestException, ForbiddenException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { generateFromEmail } from 'unique-username-generator';
import { JwtPayload } from './types';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
	constructor (
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) {}

  async getTokens(oauthId: string, email: string) {
    const jwtPayload: JwtPayload = {
      sub: oauthId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.AT_SECRET,
        expiresIn: '15m',
      }),
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.RT_SECRET,
        expiresIn: '7d',
      }),
    ]);

    return {
      access_token: at,
      refresh_token: rt,
    };
  }

  async refresh(req, res) {
    const user = await this.usersService.findOneById(req.user.oauthId);
    if (!user || !user.hashedRt) throw new ForbiddenException();

    const isMatch = await bcrypt.compare(req.cookies.refresh_token, user.hashedRt);
    if (!isMatch) throw new ForbiddenException();

    const tokens = await this.getTokens(user.oauthId, user.email);
    await this.usersService.updateRtHash(user.oauthId, tokens.refresh_token);

    res.cookie('access_token', tokens.access_token, { httpOnly: true, secure : true});
    res.cookie('refresh_token', tokens.refresh_token, { httpOnly: true, secure : true});

    return res.status(HttpStatus.OK).json(tokens);
  }

  async registerUser(user: User) {
    try {
			const username = generateFromEmail(user.email, 5);
			user.username = username;
      const newUser = await this.usersService.create(user);
      return newUser;
    } catch {
      throw new InternalServerErrorException();
    }
  }

	async login(req, res) {
    const user = req.user;
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    let found = await this.usersService.findOneByEmail(user.email);

    if (!found)
      found = await this.registerUser(user);

    const tokens = await this.getTokens(found.oauthId, found.email);
    await this.usersService.updateRtHash(found.oauthId, tokens.refresh_token);

    res.cookie('access_token', tokens.access_token, { httpOnly: true, secure : true});
    res.cookie('refresh_token', tokens.refresh_token, { httpOnly: true, secure : true});

		return res.redirect('/');
	}
}
