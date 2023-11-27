import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';

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

  async remove(id: string) {
    return await this.prisma.user.delete({
      where: { oauthId: id },
    });
  }

  async logout(user: User) {
		const userFound = await this.findOneById(user.oauthId);
		userFound.status = 'Offline';
		try {
			this.update(userFound.oauthId, userFound);
		} catch (e) {
			console.log(e)
			throw new InternalServerErrorException()
		}
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
