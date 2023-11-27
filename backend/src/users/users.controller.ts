import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Response } from 'express';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  create(@Body() user: UserEntity) {
    return this.usersService.create(user);
  }

  @UseGuards(JwtAuthGuard)
  @Get()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(JwtAuthGuard)
  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  async findOneById(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User '${id}' not found`);
    }
    return user;
  }

  @UseGuards(JwtAuthGuard)
  @Patch(':id')
  @ApiOkResponse({ type: UserEntity })
  async update(@Param('id') id: string, @Body() updateUser: UserEntity) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User '${id}' not found`);
    }
    return this.usersService.update(id, updateUser);
  }

  @ApiOkResponse({ type: UserEntity })
  @UseGuards(JwtAuthGuard)
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User '${id}' not found`);
    }
    return this.usersService.remove(id);
  }

  @ApiOperation({
		summary: 'Logs out the user.',
	})
	@UseGuards(JwtAuthGuard)
	@Delete('logout')
	async logout(@Req() req, @Res() res: Response) {
    const user = req.user;
		res.clearCookie('access_token');
    return this.usersService.logout(user) 
	}
}
