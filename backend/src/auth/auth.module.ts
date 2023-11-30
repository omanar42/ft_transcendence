import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from 'src/users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { FortyTwoStrategy, GoogleStrategy, AtStrategy, RtStrategy } from './strategies';

@Module({
  imports: [
    UsersModule,
    JwtModule.register({}),
  ],
  controllers: [AuthController],
  providers: [
    AuthService,
    FortyTwoStrategy,
    GoogleStrategy,
    AtStrategy,
    RtStrategy,
  ]
})
export class AuthModule {}
