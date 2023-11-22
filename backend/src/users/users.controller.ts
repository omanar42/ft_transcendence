import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { ApiCreatedResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  // @Post('register')
  // @ApiCreatedResponse({ type: UserEntity })
  // register(@Body() createUserDto: CreateUserDto) {
  //   return this.usersService.create(createUserDto);
  // }

  @Post('login')
  @ApiCreatedResponse({ type: UserEntity })
  login(@Body() createUserDto: CreateUserDto) {
    return this.usersService.signIn(createUserDto.username, createUserDto.password);
  }

  @Get()
  @ApiOkResponse({ type: [UserEntity] })
  findAll() {
    return this.usersService.findAll();
  }

  @Get(':username')
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('username') username: string) {
    const user = await this.usersService.findOne(username);

    if (!user) {
      throw new NotFoundException(`User #${username} not found`);
    }

    return user;
  }

  @Patch(':username')
  @ApiOkResponse({ type: UserEntity })
  update(@Param('username') username: string, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(username, updateUserDto);
  }

  @Delete(':username')
  @ApiOkResponse({ type: UserEntity })
  remove(@Param('username') username: string) {
    return this.usersService.remove(username);
  }
}
