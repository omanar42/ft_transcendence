import { Controller, Get, Post, Body, Patch, Param, Delete, ParseIntPipe } from '@nestjs/common';
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

  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  async findOne(@Param('id', ParseIntPipe) id: number) {
    const user = await this.usersService.findOne(id);

    if (!user) {
      throw new Error('User not found');
    }

    return user;
  }

  @Patch(':id')
  @ApiOkResponse({ type: UserEntity })
  update(@Param('id', ParseIntPipe) id: number, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(id, updateUserDto);
  }

  @Delete(':id')
  @ApiOkResponse({ type: UserEntity })
  remove(@Param('id', ParseIntPipe) id: number) {
    return this.usersService.remove(id);
  }
}
