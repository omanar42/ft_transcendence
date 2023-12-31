import { BadRequestException, ForbiddenException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Status, User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { generateFromEmail } from 'unique-username-generator';
import { JwtPayload } from './types';
import * as bcrypt from 'bcrypt';
import { stat } from 'fs';

@Injectable()
export class AuthService {
	constructor (
    private prisma: PrismaService,
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) {}

  async updateRtHash(oauthId: string, rt: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(rt, saltOrRounds);
    await this.prisma.user.update({
      where: {
        oauthId: oauthId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async getTokens(oauthId: string, email: string) {
    const jwtPayload: JwtPayload = {
      sub: oauthId,
      email: email,
    };

    const [at, rt] = await Promise.all([
      this.jwtService.signAsync(jwtPayload, {
        secret: process.env.AT_SECRET,
        expiresIn: '1d',
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
    const user = req.user;
    if (!user) throw new ForbiddenException();
    const found = await this.usersService.findOneById(user.sub);
    if (!found || !found.hashedRt) throw new ForbiddenException();

    const isMatch = await bcrypt.compare(req.cookies.refresh_token, found.hashedRt)
    if (!isMatch) throw new ForbiddenException();

    const tokens = await this.getTokens(found.oauthId, found.email);
    await this.updateRtHash(found.oauthId, tokens.refresh_token);

    res.cookie('access_token', tokens.access_token, { httpOnly: true, secure : true});
    res.cookie('refresh_token', tokens.refresh_token, { httpOnly: true, secure : true});

    return res.status(HttpStatus.OK).json(tokens);
  }

  async createDefaultStats(user: User) {
    const defaultStats = await this.prisma.stats.create({
      data: {
        user: {
          connect: {
            oauthId: user.oauthId
          },
        },
      },
    });
    return defaultStats;
  }

  async registerUser(user: User) {
    try {
			const username = generateFromEmail(user.email, 5);
			user.username = username;
      const newUser = await this.usersService.create(user);
      await this.createDefaultStats(newUser);
      return newUser;
    } catch {
      throw new InternalServerErrorException();
    }
  }

    async login(req, res) {
      let redirectUrl: string;
      const user = req.user;
      if (!user) {
        throw new BadRequestException('Unauthenticated');
      }

      let found = await this.usersService.findOneByEmail(user.email);
      redirectUrl = process.env.FRONTEND_URL + '/home';
    
      if (!found) {
        found = await this.registerUser(user);
        redirectUrl = process.env.FRONTEND_URL + '/welcome';
      }

      const tokens = await this.getTokens(found.oauthId, found.email);
      await this.updateRtHash(found.oauthId, tokens.refresh_token);

      res.cookie('access_token', tokens.access_token, { httpOnly: true, secure : true});
      res.cookie('refresh_token', tokens.refresh_token, { httpOnly: true, secure : true});

      this.usersService.setStatus(found.oauthId, Status["ONLINE"]);
      
      if (found.twoFactor)
        redirectUrl = process.env.FRONTEND_URL + '/two-factor';

      return res.redirect(redirectUrl);
    }

  async logout(oauthId: string) {
		await this.prisma.user.updateMany({
      where: {
        oauthId: oauthId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
        status: Status["OFFLINE"],
      },
    });
    return true;
	}

  token = (req) =>  {
    let token = null;
    if (req && req.cookies) {
      token = req.cookies['access_token'];
    }
    return token;
  }
}
