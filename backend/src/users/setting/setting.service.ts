import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SettingService {
	constructor(private prisma: PrismaService) {}

	async updateUsername(id: string, username: string) {
		if (!username)
			return	"Username cannot be empty";
		console.log(id, username);
		const exist = await this.prisma.user.findUnique({
			where: {
				username: username,
			},
		});
		if (exist) return "Username already taken";
	
		await this.prisma.user.update({
			where: {
				oauthId: id,
			},
			data: {
				username: username,
			},
		});
		return "Username updated";
	}

	async updateAvatar(file: any, user: any) {
		await this.prisma.user.update({
			where: {
				oauthId: user.sub,
			},
			data: {
				avatar: file.filename,
			},
		});
		return true;
	}
}
