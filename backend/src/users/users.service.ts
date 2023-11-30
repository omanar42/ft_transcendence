import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';

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

  // async addFriend(id: string, friendId: string) {
  //   return await this.prisma.user.update({
  //     where: { oauthId: id },
  //     data: {
  //       friends: {
  //         connect: {
  //           oauthId: friendId,
  //         },
  //       },
  //     },
  //   });
  // }

}
