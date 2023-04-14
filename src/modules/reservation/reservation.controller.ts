import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Roles } from '../users/typing/enums/roles.enum';
import { Role } from 'src/helpers/decorators/role.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt.auth.guard';
import { LoginedUsersGuard } from '../auth/guards/logined-users.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import { ReservationDto } from './reservation.interfaces';
import { Request as RequestType } from 'express';
import { User } from '../users/schemas/user.schema';
import { ID } from 'src/types/id';

@Controller()
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  // Бронирование номера клиентом. Создаёт бронь на номер на выбранную дату для текущего пользователя.
  @Post('client/reservations')
  @Role(Roles.CLIENT)
  // TODO: ВАЛИДАЦИЯ - Дату, скорее всего, буду ожидать в формате 2019-01-30T00:00:00.000Z (НЕТ)
  @UseGuards(JwtAuthGuard, LoginedUsersGuard, RoleGuard)
  clientCreateReservation(
    @Body() body: Omit<ReservationDto, 'userId'>,
    @Request() request: RequestType & { user: User & { id: ID } },
  ) {
    // mockHotelId - 641589634be330baf5eeca70
    // mockHotelRoomId - 641c3cebb73342a63a37e7dc
    // mockDateStart - '2023-04-21T00:00:00.000Z' (уже не актуально)
    // mockDateEnd - '2023-04-30T00:00:00.000Z' (уже не актуально)
    // дефолтный дэйтпикер отдает вот в таком виде: гггг-мм-дд (строка). И валидатор, вроде, также валидирует. Но на будущее будь осторожен с разными браузерами. Сафари, вроде, такое может не схавать.
    return this.reservationService.addReservation({
      userId: request.user.id,
      ...body,
    });
  }

  // Список броней текущего пользователя.
  @Get('client/reservations')
  @Role(Roles.CLIENT)
  @UseGuards(JwtAuthGuard, LoginedUsersGuard, RoleGuard)
  getClientReservations() {
    return this.reservationService.getReservations;
  }

  // Просмотр мэнеджером списка броней конкретного пользователя.
  @Get('manager/reservations/:userId')
  @Role(Roles.MANAGER)
  @UseGuards(JwtAuthGuard, LoginedUsersGuard, RoleGuard)
  getManagerReservations() {
    return this.reservationService.getReservations;
  }

  // Отмена бронирования клиентом. Отменяет бронь пользователя.
  @Delete('client/reservations/:id')
  @Role(Roles.CLIENT)
  @UseGuards(JwtAuthGuard, LoginedUsersGuard, RoleGuard)
  clientReservationCancel() {
    return this.reservationService.removeReservation;
  }

  // Отмена бронирования менеджером. Отменяет бронь пользователя по id брони.
  @Delete('manager/reservations/:id')
  @Role(Roles.MANAGER)
  @UseGuards(JwtAuthGuard, LoginedUsersGuard, RoleGuard)
  managerReservationCancel() {
    return this.reservationService.removeReservation;
  }
}
