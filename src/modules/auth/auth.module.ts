import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { SessionSerializer } from './session-serializer';

@Module({
  imports: [
    // Почему вообще работает? И с какого момента? (закомменчивал и всё равно работало)
    PassportModule.register({
      session: true,
    }),
    JwtModule.register({
      secret: 'asd79kmr', // TODO: в енв (и узнать откуда берется по нормальному) - побольше абракадабры сюда для безопасности - разный регистр и символы типа _ $ # > ? ^ (если все из них допустимы)
      // По-хорошему секрет берется из некоего AppConfig().jwtSecret
      signOptions: { expiresIn: `${9000}s` }, // В ЕНВ, можно указывать в днях - '7d'
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy, SessionSerializer],
  controllers: [AuthController],
  exports: [PassportModule, AuthService, JwtStrategy, SessionSerializer],
})
export class AuthModule {}
