import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Query,
  Request,
  UseGuards,
  UsePipes,
} from '@nestjs/common';
import { ReservationService } from './reservation.service';
import { Roles } from '../users/typing/enums/roles.enum';
import { Role } from 'src/helpers/decorators/role.decorator';
import { LoginedUsersGuard } from '../auth/guards/logined-users.guard';
import { RoleGuard } from '../auth/guards/role.guard';
import {
  ReservationDto,
  ReservationSearchOptions,
} from './reservation.interfaces';
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
  @UseGuards(LoginedUsersGuard, RoleGuard)
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
  @UseGuards(LoginedUsersGuard, RoleGuard)
  getClientReservations(
    @Request() request: RequestType & { user: User & { id: ID } },
    @Query() { dateStart, dateEnd }: Omit<ReservationSearchOptions, 'userId'>,
  ) {
    return this.reservationService.getReservations({
      userId: validateId(request?.user.id),
      dateStart,
      dateEnd,
    });
  }

  // Просмотр мэнеджером списка броней конкретного пользователя.
  @Get('manager/reservations/:userId')
  @Role(Roles.MANAGER)
  @UseGuards(LoginedUsersGuard, RoleGuard)
  getManagerReservations(
    @Param('userId') userId: ID,
    @Query() { dateStart, dateEnd }: Omit<ReservationSearchOptions, 'userId'>,
  ) {
    return this.reservationService.getReservations({
      userId: validateId(userId),
      dateStart,
      dateEnd,
    });
  }

  // Отмена бронирования клиентом. Отменяет бронь пользователя.
  @Delete('client/reservations/:id')
  @Role(Roles.CLIENT)
  @UseGuards(LoginedUsersGuard, RoleGuard)
  clientReservationCancel(
    @Param('id') id: ID,
    @Request() request: RequestType & { user: User & { id: ID } },
  ) {
    return this.reservationService.removeReservation(
      validateId(id),
      request.user,
    );
  }

  // Отмена бронирования менеджером. Отменяет бронь пользователя по id брони.
  @Delete('manager/reservations/:id')
  @Role(Roles.MANAGER)
  @UseGuards(LoginedUsersGuard, RoleGuard)
  managerReservationCancel(
    @Param('id') id: ID,
    @Request() request: RequestType & { user: User & { id: ID } },
  ) {
    return this.reservationService.removeReservation(
      validateId(id),
      request.user,
    );
  }
}
