import { Module } from '@nestjs/common';
import { ChatGateway } from './chat.gateway';
import { ChatService } from './chat.service';
import { PrismaModule } from 'src/prisma/prisma.module';
import { UsersModule } from 'src/users/users.module';
import { ChatController } from './chat.controller';
import { CacheService } from './cache.service';
import { AuthModule } from 'src/auth/auth.module';

@Module({
  imports: [PrismaModule, UsersModule, AuthModule],
  controllers: [ChatController],
  providers: [ChatGateway, ChatService, CacheService],
})
export class ChatModule {}
