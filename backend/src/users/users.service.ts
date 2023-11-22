import { Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { PrismaService } from 'src/prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  create(createUserDto: CreateUserDto) {
    return this.prisma.user.create({ data: createUserDto });
  }

  findAll() {
    return this.prisma.user.findMany();
  }

  async findOne(username: string) {
    return this.prisma.user.findUnique({
      where: { username: username },
    });
  }

  update(username: string, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { username: username },
      data: updateUserDto,
    });
  }

  remove(username: string) {
    return this.prisma.user.delete({
      where: { username: username },
    });
  }

  async signIn(username: string, password: string) {
    const user = await this.prisma.user.findUnique({ where: { username: username } });
    if (!user) {
      throw new Error('User not found');
    }
    if (user.password !== password) {
      throw new Error('Password incorrect');
    }
    return user;
  }
}
