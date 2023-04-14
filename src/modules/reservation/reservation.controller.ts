import {
  Body,
  Controller,
  Delete,
  Get,
  Post,
  Request,
  UseGuards,
  UsePipes,
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
import { createReservationValidationSchema } from './validation/create.reservation.validation.schema';
import { ValidationPipe } from 'src/helpers/validation.pipe';
import { validateId } from 'src/helpers/idValidator';

@Controller()
export class ReservationController {
  constructor(private readonly reservationService: ReservationService) {}

  // Бронирование номера клиентом. Создаёт бронь на номер на выбранную дату для текущего пользователя.
  @Post('client/reservations')
  @Role(Roles.CLIENT)
  @UsePipes(new ValidationPipe(createReservationValidationSchema))
  @UseGuards(JwtAuthGuard, LoginedUsersGuard, RoleGuard)
  clientCreateReservation(
    // eslint-disable-next-line prettier/prettier
    @Body() { hotelId, roomId, dateStart, dateEnd }: Omit<ReservationDto, 'userId'>,
    @Request() request: RequestType & { user: User & { id: ID } },
  ) {
    return this.reservationService.addReservation({
      userId: validateId(request.user.id),
      hotelId: validateId(hotelId),
      roomId: validateId(roomId),
      dateStart,
      dateEnd,
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
