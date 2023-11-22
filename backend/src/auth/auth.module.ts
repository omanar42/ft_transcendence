import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PassportModule } from '@nestjs/passport';
import { FortyTwoStrategy } from './42/FortyTwo.strategy';
import { UsersModule } from 'src/users/users.module';

@Module({
  imports: [PassportModule, UsersModule],
  controllers: [AuthController],
  providers: [AuthService, FortyTwoStrategy]
})
export class AuthModule {}
