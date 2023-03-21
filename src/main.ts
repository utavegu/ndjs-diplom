/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { NestExpressApplication } from "@nestjs/platform-express";
import { AppModule } from './app.module';
import * as session from 'express-session'; // Почитай документацию на счет того, что это не взрослый подход, не продакшен - https://docs.nestjs.com/techniques/session
import * as passport from 'passport';
import { ExtendedException } from './helpers/exception.filter';
import { resolve } from 'path';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule);

  app
    // .use(cookieParser()) // TODO: Вероятно понадобится после прикручивания фронта
    .setGlobalPrefix('api')
    .useStaticAssets(resolve(__dirname, "../public")) // Ещё потом статику туда сунешь для теста сокетов и авторизации, не забудь установить пакет @nestjs/serve-static
    .useGlobalFilters(new ExtendedException())
    .use(session({
      secret: 'z73Sah701Jaxf3', // В ЕНВ
      resave: false,
      saveUninitialized: false,
    }))
    .use(passport.initialize()) // Похоже и без вас ок работает... А не, если гарду убрать, то изАунтификейтед не опознает и прочее.. логаут.
    .use(passport.session())
    .enableCors({
      credentials: true,
      origin: 'http://localhost:3001', // Реакт обычно разворачивает на 3000. TODO: Если успею, накидаю несложный фронт для нормального тестирования. Вообще это желательно для лучшего понимания сокетов и авторизации. Можно, кстати, просто без параметров передать, тогда можно будет и прямо с примитивной формочки популять, не разворачивая микросервисы.
    });

    // TODO: Неплохую помойку развел... часть в сетап напрашивается. "@nestjs/config" ? https://docs.nestjs.com/techniques/configuration. Если успеешь, конечно.
    

  await app.listen(3000);
}
bootstrap();
