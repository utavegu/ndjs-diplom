import { Controller, Delete, Get, Post } from '@nestjs/common';
import { ReservationService } from './reservation.service';

@Controller()
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  // Бронирование номера клиентом. Создаёт бронь на номер на выбранную дату для текущего пользователя.
  @Post('client/reservations')
  clientCreateReservation() {
    return this.reservationService.addReservation;
  }

  // Список броней текущего пользователя.
  @Get('client/reservations')
  getClientReservations() {
    return this.reservationService.getReservations;
  }

  // Просмотр мэнеджером списка броней конкретного пользователя.
  @Get('manager/reservations/:userId')
  getManagerReservations() {
    return this.reservationService.getReservations;
  }

  // Отмена бронирования клиентом. Отменяет бронь пользователя.
  @Delete('client/reservations/:id')
  clientReservationCancel() {
    return this.reservationService.removeReservation;
  }

  // Отмена бронирования менеджером. Отменяет бронь пользователя по id брони.
  @Delete('manager/reservations/:id')
  managerReservationCancel() {
    return this.reservationService.removeReservation;
  }
}
