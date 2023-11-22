import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { User } from '@prisma/client';
import { UserEntity } from './entities/user.entity';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(user: UserEntity) {
    return await this.prisma.user.create({ data: user });
  }

  async findAll() {
    return await this.prisma.user.findMany();
  }

  async findOne(user : User) {
    const found = await this.prisma.user.findUnique({
      where: { oauthId: user.oauthId },
    });
    if (!found) {
      return false;
    }
    return true;
  }

  async findOneById(id: string) {
    return await this.prisma.user.findUnique({
      where: { oauthId: id },
    });
  }

  async update(id: string, updateUser: UserEntity) {
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
}
