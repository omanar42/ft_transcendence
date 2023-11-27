import { BadRequestException, ForbiddenException, HttpStatus, Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { User } from '@prisma/client';
import { UsersService } from 'src/users/users.service';
import { generateFromEmail } from 'unique-username-generator';

@Injectable()
export class AuthService {
	constructor (
		private readonly usersService: UsersService,
		private readonly jwtService: JwtService
	) {}
	
	generateJwt(payload) {
		return this.jwtService.sign(payload);
	}

	async signIn(user: User) {
    if (!user) {
      throw new BadRequestException('Unauthenticated');
    }

    const userExists = await this.usersService.findOneByEmail(user.email);

    if (!userExists) {
      return this.registerUser(user);
    }

    return this.generateJwt({
      sub: userExists.oauthId,
      email: userExists.email,
    });
  }

	async registerUser(user: User) {
    try {
			const username = generateFromEmail(user.email, 5);
			user.username = username;
      const newUser = await this.usersService.create(user);

      return this.generateJwt({
        sub: newUser.oauthId,
        email: newUser.email,
      });
    } catch {
      throw new InternalServerErrorException();
    }
  }

	async fortyTwoLogin(req, res) {
		const token = await this.signIn(req.user);

		if (!token) {
			throw new ForbiddenException();
		}
	
		res.cookie('access_token', token, {
      maxAge: 2592000000,
      sameSite: true,
      secure: false,
    });

		res.redirect('/');
	}

	async googleLogin(req, res) {
		const token = await this.signIn(req.user);

		if (!token) {
			throw new ForbiddenException();
		}

    res.cookie('access_token', token, {
      maxAge: 2592000000,
      sameSite: true,
      secure: false,
    });

    return res.redirect('/');
	}
}
