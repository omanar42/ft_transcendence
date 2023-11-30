import { Controller, Get, Post, Body, Patch, Param, Delete, NotFoundException, UseGuards, Req, Res } from '@nestjs/common';
import { UsersService } from './users.service';
import { ApiCreatedResponse, ApiOkResponse, ApiOperation, ApiTags } from '@nestjs/swagger';
import { UserEntity } from './entities/user.entity';
import { Response } from 'express';
import { AtGuard } from 'src/auth/guards';

@Controller('users')
@ApiTags('users')
@UseGuards(AtGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  @ApiCreatedResponse({ type: UserEntity })
  create(@Body() user: UserEntity) {
    return this.usersService.create(user);
  }

  @Get()
  @ApiOkResponse({ type: UserEntity, isArray: true })
  findAll() {
    return this.usersService.findAll();
  }

  // @Get(':id')
  // @ApiOkResponse({ type: UserEntity })
  // async findOneById(@Param('id') id: string) {
  //   const user = await this.usersService.findOneById(id);
  //   if (!user) {
  //     throw new NotFoundException(`User '${id}' not found`);
  //   }
  //   return user;
  // }

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
  @Delete(':id')
  async remove(@Param('id') id: string) {
    const user = await this.usersService.findOneById(id);
    if (!user) {
      throw new NotFoundException(`User '${id}' not found`);
    }
    return this.usersService.remove(id);
  }

	
	@Post('logout')
	async logout(@Req() req, @Res() res: Response) {
    const user = req.user;
		res.clearCookie('access_token');
    res.clearCookie('refresh_token');
    return this.usersService.logout(user.oauthId) 
	}

  @Get("info")
  async getInfo(@Req() req, @Res() res) {
    const infos = await this.usersService.getInfo(req.user);
    res.json(infos);
  }

  @Get("status")
  async getStatus(@Req() req)
  {
      return await this.usersService.getStatus(req.user);
  }

  @Get("level")
  async getLevel(@Req() req)
  {
      return await this.usersService.getLevel(req.user);
  }

  @Get("stats")
  async getStats(@Req() req)
  {
      return await this.usersService.getStats(req.user);
  }
}
