import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UserFriends } from './entities/UserFriends.entity';
import {
  FriendActions,
  FriendStatus,
  Match,
  RoomType,
  Status,
  User,
  UserStatusInRoom,
} from '@prisma/client';
import * as otplib from 'otplib';

interface PlayerState {
  id: string;
  username: string;
  avatar: string;
  score: number;
}

@Injectable()
export class UsersService {
  findUnique(arg0: { where: { id: any }; include: { rooms: boolean } }) {
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
        email: true,
        status: true,
        twoFactor: true,
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

  async CreateUserFriends(friendsList: any) {
    const friends = [];
    for (const friend of friendsList) {
      const UserModle = await this.findOneById(friend.friendId);
      const new_f = new UserFriends(UserModle);
      new_f.id = friend.id;
      new_f.userId = friend.userId;
      new_f.status = friend.status;
      new_f.actions = friend.actions;
      friends.push(new_f);
    }
    return friends;
  }

  async getFriends(id: string) {
    const friends = await this.getAllFriends(id);
    const friendsList = friends.filter(
      (f) => f.status === FriendStatus['FRIENDS'],
    );
    return await this.CreateUserFriends(friendsList);
  }

  async getOneFriend(id: string, friendId: string) {
    const friends = await this.getAllFriends(id);

    const friend = friends.find((f) => f.friendId === friendId);
    return friend;
  }

  async getRequests(id: string) {
    const friends = await this.getAllFriends(id);
    const requests = friends.filter((f) =>
      f.actions.includes(FriendActions['ACCEPT']),
    );
    return await this.CreateUserFriends(requests);
  }

  async getInvitations(id: string) {
    const friends = await this.getAllFriends(id);
    const invitations = friends.filter((f) =>
      f.actions.includes(FriendActions['REVOKE']),
    );
    return await this.CreateUserFriends(invitations);
  }

  async getBlocked(id: string) {
    const friends = await this.getAllFriends(id);
    const blocks = friends.filter((f) =>
      f.actions.includes(FriendActions['UNBLOCK']),
    );
    return await this.CreateUserFriends(blocks);
  }

  async addFriend(userId: string, friendUser: string) {
    const user = await this.findOneById(userId);
    const friend = await this.findOneByUsername(friendUser);
    if (!user || !friend) {
      return 'User not found';
    }

    if (user.oauthId === friend.oauthId) {
      return 'Cannot add yourself';
    }

    const friends = await this.getAllFriends(user.oauthId);

    const existingFriend = friends.find((f) => f.friendId === friend.oauthId);
    if (existingFriend) {
      return 'Cannot add twice';
    }

    await this.prisma.friend.create({
      data: {
        user: {
          connect: {
            oauthId: user.oauthId,
          },
        },
        friendId: friend.oauthId,
        status: FriendStatus['PENDING'],
        actions: [FriendActions['REVOKE']],
      },
    });

    await this.prisma.friend.create({
      data: {
        user: {
          connect: {
            oauthId: friend.oauthId,
          },
        },
        friendId: user.oauthId,
        status: FriendStatus['PENDING'],
        actions: [FriendActions['ACCEPT'], FriendActions['REJECT']],
      },
    });
    return 'Friend request sent';
  }

  async removeFriend(userId: string, friendUser: string) {
    const user = await this.findOneById(userId);
    const friend = await this.findOneByUsername(friendUser);
    if (!user || !friend) {
      return 'User not found';
    }

    if (user.oauthId === friend.oauthId) {
      return 'Cannot remove yourself';
    }

    const friends = await this.getAllFriends(user.oauthId);

    const existingFriend = friends.find(
      (f) =>
        f.friendId === friend.oauthId &&
        f.actions.includes(FriendActions['REMOVE']),
    );
    if (!existingFriend) {
      return 'Cannot remove this user';
    }

    await this.prisma.friend.deleteMany({
      where: {
        user: {
          oauthId: user.oauthId,
        },
        friendId: friend.oauthId,
      },
    });

    await this.prisma.friend.deleteMany({
      where: {
        user: {
          oauthId: friend.oauthId,
        },
        friendId: user.oauthId,
      },
    });

    return 'Friend removed';
  }

  async directMessage(userName: string, username_target: string) {
    // use this function directly after accept friend request
    const user_1 = await this.findOneByUsername(userName);
    const user_2 = await this.findOneByUsername(username_target);
    const existingRoom = await this.prisma.room.findFirst({
      where: {
        AND: [
          { roomuser: { some: { userId: user_1.oauthId } } },
          { roomuser: { some: { userId: user_2.oauthId } } },
          { type: RoomType['DIRECT_MESSAGE'] },
        ],
      },
    });
    if (existingRoom) {
      return existingRoom;
    }
    const room = await this.prisma.room.create({
      data: {
        name: 'direct_message' + user_1.username + user_2.username,
        type: RoomType['DIRECT_MESSAGE'],
        ownerId: user_1.oauthId,
        roomuser: {
          create: [
            { userId: user_1.oauthId, status: UserStatusInRoom['DM'] },
            { userId: user_2.oauthId, status: UserStatusInRoom['DM'] },
          ],
        },
      },
    });
    return room;
  }

  async acceptFriend(userId: string, friendUser: string) {
    const user = await this.findOneById(userId);
    const friend = await this.findOneByUsername(friendUser);
    if (!user || !friend) {
      return 'User not found';
    }

    if (user.oauthId === friend.oauthId) {
      return 'Cannot accept yourself';
    }

    const friends = await this.getAllFriends(user.oauthId);

    const existingFriend = friends.find(
      (f) =>
        f.friendId === friend.oauthId &&
        f.actions.includes(FriendActions['ACCEPT']),
    );
    if (!existingFriend) {
      return 'No friend request to accept';
    }

    await this.prisma.friend.updateMany({
      where: {
        user: {
          oauthId: user.oauthId,
        },
        friendId: friend.oauthId,
      },
      data: {
        status: FriendStatus['FRIENDS'],
        actions: [FriendActions['REMOVE'], FriendActions['BLOCK']],
      },
    });

    await this.prisma.friend.updateMany({
      where: {
        user: {
          oauthId: friend.oauthId,
        },
        friendId: user.oauthId,
      },
      data: {
        status: FriendStatus['FRIENDS'],
        actions: [FriendActions['REMOVE'], FriendActions['BLOCK']],
      },
    });

    this.directMessage(user.username, friend.username);
    return 'Friend accepted';
  }

  async rejectFriend(userId: string, friendUser: string) {
    const user = await this.findOneById(userId);
    const friend = await this.findOneByUsername(friendUser);
    if (!user || !friend) {
      return 'User not found';
    }

    if (user.oauthId === friend.oauthId) {
      return 'Cannot reject yourself';
    }

    const friends = await this.getAllFriends(user.oauthId);

    const existingFriend = friends.find(
      (f) =>
        f.friendId === friend.oauthId &&
        f.actions.includes(FriendActions['REJECT']),
    );
    if (!existingFriend) {
      return 'No friend request to reject';
    }

    await this.prisma.friend.deleteMany({
      where: {
        user: {
          oauthId: user.oauthId,
        },
        friendId: friend.oauthId,
      },
    });

    await this.prisma.friend.deleteMany({
      where: {
        user: {
          oauthId: friend.oauthId,
        },
        friendId: user.oauthId,
      },
    });

    return 'Friend rejected';
  }

  async revokeFriend(userId: string, friendUser: string) {
    const user = await this.findOneById(userId);
    const friend = await this.findOneByUsername(friendUser);
    if (!user || !friend) {
      return 'User not found';
    }

    if (user.oauthId === friend.oauthId) {
      return 'Cannot revoke yourself';
    }

    const friends = await this.getAllFriends(user.oauthId);

    const existingFriend = friends.find(
      (f) =>
        f.friendId === friend.oauthId &&
        f.actions.includes(FriendActions['REVOKE']),
    );
    if (!existingFriend) {
      return 'No friend request to revoke';
    }

    await this.prisma.friend.deleteMany({
      where: {
        user: {
          oauthId: user.oauthId,
        },
        friendId: friend.oauthId,
      },
    });

    await this.prisma.friend.deleteMany({
      where: {
        user: {
          oauthId: friend.oauthId,
        },
        friendId: user.oauthId,
      },
    });

    return 'Friend request revoked';
  }

  async blockFriend(userId: string, friendUser: string) {
    const user = await this.findOneById(userId);
    const friend = await this.findOneByUsername(friendUser);
    if (!user || !friend) {
      return 'User not found';
    }

    if (user.oauthId === friend.oauthId) {
      return 'Cannot block yourself';
    }

    const friends = await this.getAllFriends(user.oauthId);

    const existingFriend = friends.find(
      (f) =>
        f.friendId === friend.oauthId &&
        f.actions.includes(FriendActions['BLOCK']),
    );
    if (!existingFriend) {
      return 'Cannot block this user';
    }

    await this.prisma.friend.updateMany({
      where: {
        user: {
          oauthId: user.oauthId,
        },
        friendId: friend.oauthId,
      },
      data: {
        status: FriendStatus['BLOCKED'],
        actions: ['UNBLOCK'],
      },
    });

    await this.prisma.friend.updateMany({
      where: {
        user: {
          oauthId: friend.oauthId,
        },
        friendId: user.oauthId,
      },
      data: {
        status: FriendStatus['BLOCKED'],
        actions: [],
      },
    });

    return 'Friend blocked';
  }

  async unblockFriend(userId: string, friendUser: string) {
    const user = await this.findOneById(userId);
    const friend = await this.findOneByUsername(friendUser);
    if (!user || !friend) {
      return 'User not found';
    }

    if (user.oauthId === friend.oauthId) {
      return 'Cannot unblock yourself';
    }

    const friends = await this.getAllFriends(user.oauthId);

    const existingFriend = friends.find(
      (f) =>
        f.friendId === friend.oauthId &&
        f.actions.includes(FriendActions['UNBLOCK']),
    );
    if (!existingFriend) {
      return 'Cannot unblock this user';
    }

    await this.prisma.friend.updateMany({
      where: {
        user: {
          oauthId: user.oauthId,
        },
        friendId: friend.oauthId,
      },
      data: {
        status: FriendStatus['FRIENDS'],
        actions: [FriendActions['REMOVE'], FriendActions['BLOCK']],
      },
    });

    await this.prisma.friend.updateMany({
      where: {
        user: {
          oauthId: friend.oauthId,
        },
        friendId: user.oauthId,
      },
      data: {
        status: FriendStatus['FRIENDS'],
        actions: [FriendActions['REMOVE'], FriendActions['BLOCK']],
      },
    });

    return 'Friend unblocked';
  }

  async verify2FA(id: string, token: string) {
    const user = await this.findOneById(id);
    if (!user) return 'User not found';
    if (!user.twoFaSec) return '2FA not enabled';

    const isValid = otplib.authenticator.check(token, user.twoFaSec);
    if (!isValid) return 'Invalid code';

    await this.prisma.user.update({
      where: { oauthId: id },
      data: {
        twoFactor: true,
      },
    });

    return '2FA verified successfully';
  }

  async getMatchHistory(id: string) {
    const matches = await this.prisma.user.findUnique({
      where: {
        oauthId: id,
      },
      select: {
        matches: true,
      },
    });
    return matches.matches;
  }

  async HandleEndGame(winner: PlayerState, loser: PlayerState) {
    const winnerStats = await this.getStats(winner.id);
    const loserStats = await this.getStats(loser.id);

    winnerStats.level += ((winner.score * 10) / 100) * 4.2;
    loserStats.level += ((loser.score * 10) / 100) * 4.2;

    winnerStats.wins += 1;
    loserStats.losses += 1;

    const winnerAchievementsToPush = [];
    const loserAchievementsToPush = [];

    if (
      winner.score === 12 &&
      loser.score === 0 &&
      !winnerStats.achievements.includes('PERFECT_WIN')
    )
      winnerAchievementsToPush.push('PERFECT_WIN');

    if (!loserStats.achievements.includes('FIRST_LOSE'))
      loserAchievementsToPush.push('FIRST_LOSE');

    if (
      winnerStats.wins >= 1 &&
      !winnerStats.achievements.includes('WIN_1_GAMES')
    )
      winnerAchievementsToPush.push('WIN_1_GAMES');

    if (
      winnerStats.wins >= 5 &&
      !winnerStats.achievements.includes('WIN_5_GAMES')
    )
      winnerAchievementsToPush.push('WIN_5_GAMES');

    if (
      winnerStats.wins >= 10 &&
      !winnerStats.achievements.includes('WIN_10_GAMES')
    )
      winnerAchievementsToPush.push('WIN_10_GAMES');

    if (
      loserStats.wins >= 1 &&
      !loserStats.achievements.includes('WIN_1_GAMES')
    )
      loserAchievementsToPush.push('WIN_1_GAMES');

    if (
      loserStats.wins >= 5 &&
      !loserStats.achievements.includes('WIN_5_GAMES')
    )
      loserAchievementsToPush.push('WIN_5_GAMES');

    if (
      loserStats.wins >= 10 &&
      !loserStats.achievements.includes('WIN_10_GAMES')
    )
      loserAchievementsToPush.push('WIN_10_GAMES');

    if (
      winnerStats.level >= 10 &&
      !winnerStats.achievements.includes('LEVEL_10')
    )
      winnerAchievementsToPush.push('LEVEL_10');
    if (
      winnerStats.level >= 50 &&
      !winnerStats.achievements.includes('LEVEL_50')
    )
      winnerAchievementsToPush.push('LEVEL_50');
    if (
      winnerStats.level >= 100 &&
      !winnerStats.achievements.includes('LEVEL_100')
    )
      winnerAchievementsToPush.push('LEVEL_100');
    if (loserStats.level >= 10 && !loserStats.achievements.includes('LEVEL_10'))
      loserAchievementsToPush.push('LEVEL_10');
    if (loserStats.level >= 50 && !loserStats.achievements.includes('LEVEL_50'))
      loserAchievementsToPush.push('LEVEL_50');
    if (
      loserStats.level >= 100 &&
      !loserStats.achievements.includes('LEVEL_100')
    )
      loserAchievementsToPush.push('LEVEL_100');

    await this.prisma.match.create({
      data: {
        user: {
          connect: {
            oauthId: winner.id,
          },
        },
        userScore: winner.score,
        opponentId: loser.id,
        opponentScore: loser.score,
        win: true,
        xpGain: winner.score * 10 * 5,
      },
    });

    await this.prisma.match.create({
      data: {
        user: {
          connect: {
            oauthId: loser.id,
          },
        },
        userScore: loser.score,
        opponentId: winner.id,
        opponentScore: winner.score,
        win: false,
        xpGain: loser.score * 10 * 5,
      },
    });

    await this.prisma.stats.update({
      where: {
        userId: winner.id,
      },
      data: {
        level: winnerStats.level,
        wins: winnerStats.wins,
        achievements: {
          push: winnerAchievementsToPush,
        },
      },
    });

    await this.prisma.stats.update({
      where: {
        userId: loser.id,
      },
      data: {
        level: loserStats.level,
        losses: loserStats.losses,
        achievements: {
          push: loserAchievementsToPush,
        },
      },
    });
  }
}
