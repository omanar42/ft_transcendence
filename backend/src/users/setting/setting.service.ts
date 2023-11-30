import { ConflictException, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class SettingService {
	constructor(private prisma: PrismaService) {}

	async updateUsername(newUsername: string, user: any) {
		const exist = await this.prisma.user.findUnique({
			where: {
				username: newUsername,
			},
		});
		if (exist) throw new ConflictException('Username already exist');
		await this.prisma.user.update({
			where: {
				oauthId: user.oauthId,
			},
			data: {
				username: newUsername,
			},
		});
		return true;
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
