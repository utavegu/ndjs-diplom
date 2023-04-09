import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtModule } from '@nestjs/jwt';
import { JwtStrategy } from './jwt.strategy';
import { UsersModule } from '../users/users.module';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';

@Module({
  imports: [
    /*
    Почему вообще работает? И с какого момента?
    PassportModule.register({
      // session: true, // списал из инета, хз что значит. РАЗБЕРИСЬ. И может можно будет без экспресс-сессии обойтись, если тут поставлю тру, а в мэйне верну то, что связано с пасспортом?
    }),
    */
    JwtModule.register({
      secret: 'asd79kmr', // TODO: в енв (и узнать откуда берется по нормальному) - побольше абракадабры сюда для безопасности - разный регистр и символы типа _ $ # > ? ^ (если все из них допустимы)
      // По-хорошему секрет берется из некоего AppConfig().jwtSecret
      signOptions: { expiresIn: `${30}s` }, // В ЕНВ, можно указывать в днях - '7d'
    }),
    UsersModule,
  ],
  providers: [AuthService, JwtStrategy],
  controllers: [AuthController],
})
export class AuthModule {}
