import { Module } from '@nestjs/common';
import { GameService } from './game.service';
import { GameGateway } from './game.gateway';
import { GameController } from './game.controller';
import { UsersModule } from 'src/users/users.module';
import { AuthModule } from 'src/auth/auth.module';
import { GameMapService } from './gamemap.service';
import { GameState } from './gameState';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  imports: [UsersModule, AuthModule],
  controllers: [GameController],
  providers: [
    GameService,
    GameGateway,
    GameMapService,
    GameState,
    PrismaService,
  ],
})
export class GameModule {}
