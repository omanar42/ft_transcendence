import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { FriendActions, FriendStatus } from '@prisma/client';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(user: CreateUserDto) {
    return await this.prisma.user.create({ data: user });
  }

  async findOneById(id: string) {
    return await this.prisma.user.findUnique({
      where: { oauthId: id },
    });
  }

  async findOneByUsername(username: string) {
    return await this.prisma.user.findUnique({
      where: { username: username },
    });
  }

  async findOneByEmail(email: string) {
    return await this.prisma.user.findUnique({
      where: { email: email },
    });
  }

  async remove(id: string) {
    return await this.prisma.user.delete({
      where: { oauthId: id },
    });
  }

  async setStatus(id: string, status: string) {
    return await this.prisma.user.update({
      where: { oauthId: id },
      data: {
        status: status,
      },
    });
  }

  async getInfo(user: any) {
		const infos = await this.prisma.user.findUnique({
			where: {
				oauthId: user.sub,
			},
			select: {
				avatar: true,
				username: true,
				email: true,
        fullname: true,
			},
		});
		return infos;
	}

  async getStatus(user: any) {
		const status = await this.prisma.user.findUnique({
			where: {
				oauthId: user.sub,
			},
			select: {
				status: true,
			},
		});
		return status;
	}

  async getLevel(user: any) {
    const level = await this.prisma.user.findUnique({
      where: {
        oauthId: user.sub,
      },
      select: {
        level: true,
      },
    });
    return level;
  }

  async getStats(user: any) {
    const stats = await this.prisma.user.findUnique({
      where: {
        oauthId: user.sub,
      },
      select: {
        wins: true,
        losses: true,
      },
    });
    return stats;
  }

  async updateFriends(userId: string, friendId: string) {
    const user = await this.findOneById(userId);
    const friend = await this.findOneById(friendId);
    if (!user || !friend) {
      return false;
    }

    const friends = await this.prisma.friend.create({
      data: {
        user: {
          connect: {
            oauthId: userId,
          },
        },
        friendId: friendId,
        status: FriendStatus["PENDING"],
        actions: [FriendActions['REVOKE']],
      },
    });

    await this.prisma.user.update({
      where: {
        oauthId: userId,
      },
      data: {
        friends: {
          connect: {
            id: friends.id,
          },
        },
      },
    });
    return true;
  }

  async addFriend(userId: string, friendUser: string) {
    const user = await this.findOneById(userId);
    const friend = await this.findOneByUsername(friendUser);
    if (!user || !friend) {
      return false;
    }

    const friends = await this.prisma.user.findUnique({
      where: {
        oauthId: user.oauthId
      },
      select: {
        friends: true,
      },
    });

    const existingFriend = friends.friends.find(f => f.friendId === friend.oauthId);
    if (existingFriend) {
      return false;
    }

    await this.updateFriends(user.oauthId, friend.oauthId);
    return true;
  }

  async removeFriend(userId: string, friendUser: string) {

  }

  async acceptFriend(userId: string, friendUser: string) {

  }

  async rejectFriend(userId: string, friendUser: string) {

  }

  async revokeFriend(userId: string, friendUser: string) {

  }

  async blockFriend(userId: string, friendUser: string) {

  }
}
