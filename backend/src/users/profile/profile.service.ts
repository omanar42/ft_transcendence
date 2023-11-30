import { Injectable } from '@nestjs/common';

@Injectable()
export class ProfileService {
	constructor() {}

	async getProfile(user: any, username: string) {
		return { username: username };
	}
}
