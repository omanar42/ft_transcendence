import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { PrismaModule } from 'src/prisma/prisma.module';
import { AtStrategy } from 'src/auth/strategies';
import { SettingModule } from './setting/setting.module';

@Module({
  imports: [PrismaModule, SettingModule],
  controllers: [UsersController],
  providers: [UsersService, AtStrategy],
  exports: [UsersService],
})
export class UsersModule {}
