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

  async findOne(id: number) {
    return this.prisma.user.findUnique({
      where: { id: id },
    });
  }

  update(id: number, updateUserDto: UpdateUserDto) {
    return this.prisma.user.update({
      where: { id: id },
      data: updateUserDto,
    });
  }

  remove(id: number) {
    return this.prisma.user.delete({
      where: { id: id },
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
