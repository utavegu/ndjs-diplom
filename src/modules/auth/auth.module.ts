import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionSerializer } from './session-serializer';
import { JWT_TOKEN_EXPIRES } from 'src/constants';

@Module({
  imports: [
    // Почему вообще работает? И с какого момента? (закомменчивал и всё равно работало)
    PassportModule.register({
      session: true,
    }),
    JwtModule.register({
      secret: process.env.SECRET_OR_KEY, // TODO: узнать откуда берется по нормальному
      // По-хорошему секрет берется из некоего AppConfig().jwtSecret
      signOptions: { expiresIn: `${JWT_TOKEN_EXPIRES}s` }, // можно указывать и в днях - '7d'
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy, SessionSerializer],
  controllers: [AuthController],
  exports: [PassportModule, AuthService, JwtStrategy, SessionSerializer],
})
export class AuthModule {}
