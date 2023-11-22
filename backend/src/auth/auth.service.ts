import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class AuthService {
	constructor (private readonly usersService: UsersService) {}

	async fortyTwoLogin(req, res) {
		// if user exists in database
		// 	- generate JWT token
		// 	- create cookie with token
		// 	- redirect to frontend
		// else
		// 	- create user in database
		// 	- generate JWT token
		// 	- create cookie with token
		// 	- redirect to frontend
		
		const found = await this.usersService.findOne(req.user);
		if (!found) {
			this.usersService.create(req.user);
			// res.send("User Created Successfully");
		}
		else {
			// res.send("User already exists");
		}
		res.redirect('/');
	}

	async validateUser(user: any) {
	}
}
