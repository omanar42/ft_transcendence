import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { Response } from 'express';
import { AtGuard } from 'src/auth/guards';

@Controller('users')
@ApiTags('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  create(@Body() user: UserEntity) {
    return this.usersService.create(user);
  }

  @UseGuards(AtGuard)
  @Get()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findAll() {
    return this.usersService.findAll();
  }

  @UseGuards(AtGuard)
  @Get(':id')
  @ApiOkResponse({ type: UserEntity })
  async findOneById(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User '${id}' not found`);
    }
    return user;
  }

  @UseGuards(AtGuard)
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
  @UseGuards(AtGuard)
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
	@UseGuards(AtGuard)
	@Post('logout')
	async logout(@Req() req, @Res() res: Response) {
    const user = req.user;
		res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return this.usersService.logout(user.oauthId) 
	}
}
