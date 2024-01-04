import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import * as bcrypt from 'bcrypt';
import { FriendActions, FriendStatus, Status, User } from '@prisma/client';
import * as otplib from 'otplib';

@Injectable()
export class UsersService {
  findUnique(arg0: { where: { id: any; }; include: { rooms: boolean; }; }) {
    throw new Error('Method not implemented.');
  }
  constructor(private prisma: PrismaService) {}

  async create(user: User) {
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

  async setStatus(id: string, _status: Status) {
    return await this.prisma.user.update({
      where: { oauthId: id },
      data: {
        status: _status,
      },
    });
  }

  async getInfo(id: string) {
		const infos = await this.prisma.user.findUnique({
			where: {
				oauthId: id,
			},
			select: {
				avatar: true,
				username: true,
        fullname: true,
        status: true,
			},
		});
		return infos;
	}

  async getStats(id: string) {
    const stats = await this.prisma.user.findUnique({
      where: {
        oauthId: id,
      },
      select: {
        stats: {
          select: {
            wins: true,
            losses: true,
            level: true,
            achievements: true,
          },
        },
      },
    });
    return stats.stats;
  }

  async getMatches(id: string) {
    const matches = await this.prisma.user.findUnique({
      where: {
        oauthId: id,
      },
      select: {
        matches: true,
      },
    });
    return matches;
  }

  async getAllFriends(id: string) {
    const friends = await this.prisma.user.findUnique({
      where: {
        oauthId: id,
      },
      select: {
        friends: true,
      },
    });
    return friends.friends;
  }

  async getFriends(id: string) {
    const friends = await this.getAllFriends(id);
    const friendsList = friends.filter(f => f.status === FriendStatus["FRIENDS"]);
    return friendsList;
  }

  async getOneFriend(id: string, friendId: string) {
    const friends = await this.getAllFriends(id);

    const friend = friends.find(f => f.friendId === friendId);
    return friend;
  }

  async getRequests(id: string) {
    const friends = await this.getAllFriends(id);
    const requests = friends.filter(f => f.actions.includes(FriendActions['ACCEPT']));
    return requests;
  }

  async getInvitations(id: string) {
    const friends = await this.getAllFriends(id);
    const invitations = friends.filter(f => f.actions.includes(FriendActions['REVOKE']));
    return invitations;
  }

  async getBlocked(id: string) {
    const friends = await this.getAllFriends(id);
    const blocks = friends.filter(f => f.actions.includes(FriendActions['UNBLOCK']));
    return blocks;
  }

  async addFriend(userId: string, friendUser: string) {
    const user = await this.findOneById(userId);
    const friend = await this.findOneByUsername(friendUser);
    if (!user || !friend) {
      return "User not found";
    }

    const friends = await this.getAllFriends(user.oauthId);

    const existingFriend = friends.find(f => f.friendId === friend.oauthId);
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
        frUser: friend.username,
        frAvatar: friend.avatar,
        ftStatus: friend.status,
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
        frUser: user.username,
        frAvatar: user.avatar,
        ftStatus: user.status,
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

    const friends = await this.getAllFriends(user.oauthId);

    const existingFriend = friends.find(f => f.friendId === friend.oauthId);
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

    const friends = await this.getAllFriends(user.oauthId);

    const existingFriend = friends.find(f => f.friendId === friend.oauthId);
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

    const friends = await this.getAllFriends(user.oauthId);

    const existingFriend = friends.find(f => f.friendId === friend.oauthId);
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

    const friends = await this.getAllFriends(user.oauthId);

    const existingFriend = friends.find(f => f.friendId === friend.oauthId);
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

    const friends = await this.getAllFriends(user.oauthId);

    const existingFriend = friends.find(f => f.friendId === friend.oauthId);
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
        actions: ["UNBLOCK"],
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
        actions: [],
      },
    });

    return "Friend blocked";
  }

  async unblockFriend(userId: string, friendUser: string) {
    const user = await this.findOneById(userId);
    const friend = await this.findOneByUsername(friendUser);
    if (!user || !friend) {
      return "User not found";
    }

    const friends = await this.getAllFriends(user.oauthId);

    const existingFriend = friends.find(f => f.friendId === friend.oauthId);
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

    return "Friend unblocked";
  }

  async verify2FA(id: string, token: string) {
    const user = await this.findOneById(id);
    if (!user) return "User not found";
    if (!user.twoFactor) return "2FA not enabled";

    const isValid = otplib.authenticator.check(token, user.twoFaSec);
    if (!isValid) return "Invalid code";

    return "2FA verified successfully";
  }
}
