import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { ReservationController } from './reservation.controller';
import { Reservation, ReservationSchema } from './reservation.model';
import { ReservationService } from './reservation.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: Reservation.name, schema: ReservationSchema },
    ]),
  ],
  providers: [ReservationService],
  controllers: [ReservationController],
})
export class ReservationModule {}

/*
TODO: Потом удалить, а пока чтобы не забыть:

Модуль «Брони» предназначен для хранения и получения броней гостиниц конкретного пользователя.

Модуль «Брони» не должен использовать модуль «Пользователи» и модуль «Гостиницы» для получения данных.
- Видимо не импортировать их сюда. Но вроде такой необходимости и нет.

Модуль «Брони» не должен хранить данные пользователей и гостиниц.
- Видимо, имеется в виду ничего, кроме айдишников.
*/
