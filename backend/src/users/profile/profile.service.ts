import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class ProfileService {
	constructor(private readonly prisma: PrismaService) {}

	async getProfile(user: any, username: string) {
		return await this.prisma.user.findUnique({
			where: {
				username: username,
			},
			select: {
				avatar: true,
				username: true,
				email: true,
				fullname: true,
			},
		});
	}

	async getStatuses(user: any, username: string) {
		const requester = await this.prisma.user.findUnique({
			where: {
				oauthId: user.sub,
			},
			select: {
				username: true,
			},
		});
		const requested = await this.prisma.user.findUnique({
			where: {
				username: username,
			},
			select: {
				username: true,
			},
		});
		if (!requester || !requested) return null;
		return {
			isOwner: requester.username === username,
			status: 'online',
			isFriend: true,
			isBlocked: false,
		};
	}
}
