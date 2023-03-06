/* eslint-disable prettier/prettier */
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

import * as session from 'express-session'; // Почитай документацию на счет того, что это не взрослый подход, не продакшен - https://docs.nestjs.com/techniques/session
import * as passport from 'passport';
import { MyExceptionFilter } from './helpers/exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app
    // .use(cookieParser())
    .setGlobalPrefix('api')
    .useGlobalFilters(new MyExceptionFilter())
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
    

  await app.listen(3000);
}
bootstrap();
