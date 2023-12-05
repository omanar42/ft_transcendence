import { Injectable } from '@nestjs/common';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProfileService {
	constructor(private readonly usersService: UsersService) {}

	async getProfile(user: any, username: string) {
		const requester = await this.usersService.findOneById(user.sub);
		const requested = await this.usersService.findOneByUsername(username);
		if (!requester || !requested) return null;

		return await this.usersService.getInfo(requested.oauthId);
	}

	async getStatuses(user: any, username: string) {
		const requester = await this.usersService.findOneById(user.sub);
		const requested = await this.usersService.findOneByUsername(username);
		if (!requester || !requested) return null;
		
		if (requester.oauthId == requested.oauthId)
			return {
				"status": "Self",
				"actions": ["EDIT"],
			};
		
		const friend = await this.usersService.getOneFriend(requester.oauthId, requested.oauthId);
		if (!friend) {
			return {
				"status": "Not friends",
				"actions": ["ADD"],
			};
		}

		if (friend.status == "BLOCKED") {
			return null;
		}

		return {
			"status": friend.status,
			"actions": friend.actions,
		};
	}
}
