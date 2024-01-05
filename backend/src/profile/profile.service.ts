import { Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/auth/types';
import { UsersService } from 'src/users/users.service';

@Injectable()
export class ProfileService {
  constructor(private readonly usersService: UsersService) {}

  async getRelations(user: JwtPayload, username: string) {
    const requester = await this.usersService.findOneById(user.sub);
    const requested = await this.usersService.findOneByUsername(username);
    if (!requester || !requested) return null;

    if (requester.oauthId == requested.oauthId)
      return {
        status: 'Self',
        actions: ['EDIT'],
      };

    const friend = await this.usersService.getOneFriend(
      requester.oauthId,
      requested.oauthId,
    );
    if (!friend) {
      return {
        status: 'Not friends',
        actions: ['ADD'],
      };
    }

    if (friend.status == 'BLOCKED') {
      return null;
    }

    return {
      status: friend.status,
      actions: friend.actions,
    };
  }

  async getProfile(username: string) {
    const requested = await this.usersService.findOneByUsername(username);
    if (!requested) return null;

    return await this.usersService.getInfo(requested.oauthId);
  }

  async getStats(username: string) {
    const requested = await this.usersService.findOneByUsername(username);
    if (!requested) return null;

    return await this.usersService.getStats(requested.oauthId);
  }

  async getFriends(username: string) {
    const requested = await this.usersService.findOneByUsername(username);
    if (!requested) return null;

    return await this.usersService.getFriends(requested.oauthId);
  }
}
