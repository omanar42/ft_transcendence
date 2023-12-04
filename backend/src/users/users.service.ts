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

  async getFriends(user: any) {
    const friends = await this.prisma.user.findUnique({
      where: {
        oauthId: user.oauthId,
      },
      select: {
        friends: true,
      },
    });
    return friends;
  }

  async addFriend(userId: string, friendUser: string) {
    const user = await this.findOneById(userId);
    const friend = await this.findOneByUsername(friendUser);
    if (!user || !friend) {
      return "User not found";
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
      return "Already friends";
    }

    await this.prisma.friend.create({
      data: {
        user: {
          connect: {
            oauthId: user.oauthId
          },
        },
        friendId: friend.oauthId,
        status: FriendStatus["PENDING"],
        actions: [FriendActions['REVOKE']],
      },
    });

    await this.prisma.friend.create({
      data: {
        user: {
          connect: {
            oauthId: friend.oauthId
          },
        },
        friendId: user.oauthId,
        status: FriendStatus["PENDING"],
        actions: [FriendActions['ACCEPT'], FriendActions['REJECT']],
      },
    });
    return "Friend request sent";
  }

  async removeFriend(userId: string, friendUser: string) {
    const user = await this.findOneById(userId);
    const friend = await this.findOneByUsername(friendUser);
    if (!user || !friend) {
      return "User not found";
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
    if (!existingFriend) {
      return "Not friends";
    }

    await this.prisma.friend.deleteMany({
      where: {
        user: {
          oauthId: user.oauthId
        },
        friendId: friend.oauthId,
      },
    });

    await this.prisma.friend.deleteMany({
      where: {
        user: {
          oauthId: friend.oauthId
        },
        friendId: user.oauthId,
      },
    });

    return "Friend removed";
  }

  async acceptFriend(userId: string, friendUser: string) {
    const user = await this.findOneById(userId);
    const friend = await this.findOneByUsername(friendUser);
    if (!user || !friend) {
      return "User not found";
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
    if (!existingFriend) {
      return "No friend request to accept";
    }

    await this.prisma.friend.updateMany({
      where: {
        user: {
          oauthId: user.oauthId
        },
        friendId: friend.oauthId,
      },
      data: {
        status: FriendStatus["FRIENDS"],
        actions: [FriendActions['REMOVE'], FriendActions['BLOCK']],
      },
    });

    await this.prisma.friend.updateMany({
      where: {
        user: {
          oauthId: friend.oauthId
        },
        friendId: user.oauthId,
      },
      data: {
        status: FriendStatus["FRIENDS"],
        actions: [FriendActions['REMOVE'], FriendActions['BLOCK']],
      },
    });

    return "Friend accepted";
  }

  async rejectFriend(userId: string, friendUser: string) {
    const user = await this.findOneById(userId);
    const friend = await this.findOneByUsername(friendUser);
    if (!user || !friend) {
      return "User not found";
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
    if (!existingFriend) {
      return "No friend request to reject";
    }

    await this.prisma.friend.deleteMany({
      where: {
        user: {
          oauthId: user.oauthId
        },
        friendId: friend.oauthId,
      },
    });

    await this.prisma.friend.deleteMany({
      where: {
        user: {
          oauthId: friend.oauthId
        },
        friendId: user.oauthId,
      },
    });

    return "Friend rejected";
  }

  async revokeFriend(userId: string, friendUser: string) {
    const user = await this.findOneById(userId);
    const friend = await this.findOneByUsername(friendUser);
    if (!user || !friend) {
      return "User not found";
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
    if (!existingFriend) {
      return "No friend request to revoke";
    }

    await this.prisma.friend.deleteMany({
      where: {
        user: {
          oauthId: user.oauthId
        },
        friendId: friend.oauthId,
      },
    });

    await this.prisma.friend.deleteMany({
      where: {
        user: {
          oauthId: friend.oauthId
        },
        friendId: user.oauthId,
      },
    });

    return "Friend request revoked";
  }

  async blockFriend(userId: string, friendUser: string) {
    const user = await this.findOneById(userId);
    const friend = await this.findOneByUsername(friendUser);
    if (!user || !friend) {
      return "User not found";
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
    if (!existingFriend) {
      return "Not friends";
    }

    await this.prisma.friend.updateMany({
      where: {
        user: {
          oauthId: user.oauthId
        },
        friendId: friend.oauthId,
      },
      data: {
        status: FriendStatus["BLOCKED"],
      },
    });

    await this.prisma.friend.updateMany({
      where: {
        user: {
          oauthId: friend.oauthId
        },
        friendId: user.oauthId,
      },
      data: {
        status: FriendStatus["BLOCKED"],
      },
    });

    return "Friend blocked";
  }
}
