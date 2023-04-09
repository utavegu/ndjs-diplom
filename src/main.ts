/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from './app.module';
import * as session from 'express-session';
import * as passport from 'passport';
import { ExtendedException } from './helpers/exception.filter';
import { resolve } from 'path';
import * as cookieParser from 'cookie-parser'; // Куда куки парсер опять пропал с типами? И почему ты вообще работаешь, если пакет не установлен?

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  // TODO: Почитай документацию на счет того, что это невзрослый подход, не продакшен - https://docs.nestjs.com/techniques/session
  /*
  const sessionConfig = { 
    secret: 'z73Sah701Jaxf3', // В ЕНВ (и порты-хосты тоже)
    resave: false,
    saveUninitialized: false,
  }
  */

  app
    .use(cookieParser())
    .setGlobalPrefix('api')
    .useStaticAssets(resolve(__dirname, "../public"))
    .useGlobalFilters(new ExtendedException())
    // Вот это поворот. В какой момент стало работать без вас?
    // .use(session(sessionConfig))
    // Лишнее вроде, но еще поэкспериментирую:
    // .use(passport.initialize())
    // .use(passport.session())
    .enableCors({
      credentials: true,
      origin: 'http://localhost:3001', // Если бы фронтенд был на 3001 порту (в итоге он у меня в серв-статике). Если без этого параметра - выключит CORS везде.
    });

    // TODO: Неплохую помойку развел... часть в сетап напрашивается. "@nestjs/config" ? https://docs.nestjs.com/techniques/configuration. Если успеешь, конечно.
    

  await app.listen(3000);
}
bootstrap();
