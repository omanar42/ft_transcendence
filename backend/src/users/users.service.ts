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

  async findAll() {
    return await this.prisma.user.findMany();
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

  async update(id: string, updateUser: UpdateUserDto) {
    return await this.prisma.user.update({
      where: { oauthId: id },
      data: updateUser,
    });
  }

  async updateRtHash(oauthId: string, rt: string) {
    const saltOrRounds = 10;
    const hash = await bcrypt.hash(rt, saltOrRounds);
    await this.prisma.user.update({
      where: {
        oauthId: oauthId,
      },
      data: {
        hashedRt: hash,
      },
    });
  }

  async remove(id: string) {
    return await this.prisma.user.delete({
      where: { oauthId: id },
    });
  }

  async logout(oauthId: string) {
		await this.prisma.user.updateMany({
      where: {
        oauthId: oauthId,
        hashedRt: {
          not: null,
        },
      },
      data: {
        hashedRt: null,
        status: 'Offline',
      },
    });
    return true;
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

  
}
