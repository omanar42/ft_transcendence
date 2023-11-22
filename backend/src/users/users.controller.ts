import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  create(@Body() user: UserEntity) {
    return this.usersService.create(user);
  }

  @Get()
  @ApiOkResponse({ type: [UserEntity] })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  async findOneById(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User '${id}' not found`);
    }
    return user;
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserEntity })
  async update(@Param('id') id: string, @Body() updateUser: UserEntity) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User '${id}' not found`);
    }
    return this.usersService.update(id, updateUser);
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserEntity })
  async remove(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User '${id}' not found`);
    }
    return this.usersService.remove(id);
  }
}
