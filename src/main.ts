/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ExtendedException } from './helpers/exception.filter';
import { resolve } from 'path';
import * as cookieParser from 'cookie-parser';
import { SessionAdapter } from './modules/auth/session-adapter';
import { JwtAuthGuard } from './modules/auth/guards/jwt.auth.guard';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // TODO: Почитай документацию на счет того, что это невзрослый подход, не продакшен - https://docs.nestjs.com/techniques/session
  // А тут по сессиям в целом:
  // Добавляет куку connect.sid?
  const sessionMiddleware = session({
    secret: process.env.SESSION_SECRET,
    resave: true,
    saveUninitialized: true,
});

  app
    .use(cookieParser())
    .setGlobalPrefix('api')
    .useGlobalGuards(new JwtAuthGuard())
    .useGlobalFilters(new ExtendedException())
    .useStaticAssets(resolve(__dirname, "../public"))
    // Вот это поворот. В какой момент стало работать без вас?
    // Странности, но и без следующих трех прекрасно работает. Но пасспорт сешн и инициализ похоже не будут раотать без экспресс-сешн
    .use(sessionMiddleware)
    .use(passport.initialize())
    .use(passport.session())
    .useWebSocketAdapter(new SessionAdapter(sessionMiddleware, app))
    .enableCors({
      credentials: true,
      origin: 'http://localhost:3001', // Если бы фронтенд был на 3001 порту (в итоге он у меня в серв-статике). Если без этого параметра - выключит CORS везде.
    });

  await app.listen(process.env.AGGREGATOR_INTERNAL_PORT || 3000); // TODO: А интернал-ли? Это же тот порт, который наружу торчит. Побалуйся.
}
bootstrap();
