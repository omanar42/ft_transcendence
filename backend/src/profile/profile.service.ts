import { Injectable } from '@nestjs/common';
import { JwtPayload } from 'src/auth/types';
import { UsersService } from 'src/users/users.service';

interface ProfilePage {
  relation: string;
  actions: string[];
  username: string;
  fullname: string;
  status: string;
  avatar: string;
  level: number;
  wins: number;
  losses: number;
  achievements: string[];
  friends?: {
    username: string;
    avatar: string;
    status: string;
  }[];
}

@Injectable()
export class ProfileService {
  constructor(private readonly usersService: UsersService) {}

  async getRelations(id: string, username: string) {
    const requester = await this.usersService.findOneById(id);
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

  async getProfilePage(id: string, username: string): Promise<ProfilePage> {
    const profile = await this.usersService.findOneByUsername(username);
    if (!profile) return null;

    const relations = await this.getRelations(id, username);
    if (!relations) return null;

    const info = await this.getProfile(username);
    if (!info) return null;

    const stats = await this.getStats(username);
    if (!stats) return null;

    const friends = await this.getFriends(username);
    if (!friends) return null;

    return {
      relation: relations.status,
      actions: relations.actions,
      username: info.username,
      fullname: info.fullname,
      status: info.status,
      avatar: info.avatar,
      level: stats.level,
      wins: stats.wins,
      losses: stats.losses,
      achievements: stats.achievements,
      friends: friends.map((friend) => ({
        username: friend.frUser,
        avatar: friend.frAvatar,
        status: friend.frStatus,
      })),
    };
  }
}
