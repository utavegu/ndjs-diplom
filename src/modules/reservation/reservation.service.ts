/* eslint-disable prettier/prettier */
import { BadRequestException, ForbiddenException, HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { determineRelevanceOfDate, findArraysMatchingElements, getAllBookedDates, getDatesRange, getPrettyDatesString } from 'src/helpers/utils';
import { ID } from 'src/types/id';
import {
  IReservation,
  ReservationDto,
  ReservationSearchOptions,
} from './reservation.interfaces';
import { Reservation, ReservationDocument } from './reservation.model';
import { User } from '../users/schemas/user.schema';
import { Roles } from '../users/typing/enums/roles.enum';

@Injectable()
export class ReservationService implements IReservation {
  constructor(
    @InjectModel(Reservation.name)
    private ReservationModel: Model<ReservationDocument>,
  ) { }

  async addReservation(body: ReservationDto): Promise<Reservation> 
  {
    const { dateStart: stringDateStart, dateEnd: stringDateEnd, roomId, hotelId } = body;

    const dateStart = new Date(stringDateStart);
    const dateEnd = new Date(stringDateEnd);

    determineRelevanceOfDate(dateStart, dateEnd)

    const roomReservations = await this.ReservationModel.find({ hotelId, roomId });
 
    const allRoomReservationsDates = roomReservations?.map((reservation) => ({
      dateStart: reservation.dateStart,
      dateEnd: reservation.dateEnd,
    }));

    const allBookedDates = getAllBookedDates(allRoomReservationsDates)

    const clientDesiredDates = getDatesRange(dateStart, dateEnd)

    const intersectDates = findArraysMatchingElements(allBookedDates, clientDesiredDates)
      .map((date) => getPrettyDatesString(date))
      .join(', ');

    if (intersectDates) {
      throw new HttpException(
        `Даты ${intersectDates} недоступны для бронирования`, // TODO: тут ещё можно склонялку прикрутить множественного или единственного числа, в зависимости от количества занятых дат
        HttpStatus.BAD_REQUEST,
      );
    }

    const newReservation = await (
      await (
        await this.ReservationModel.create({ ...body, dateStart, dateEnd })
      ).populate({
        path: 'hotelId',
        select: 'title description',
      })
    ).populate({
      path: 'roomId',
      select: 'description images',
    });

    // TODO: Как иначе проверять существование номера или отеля я не знаю, раз мне нельзя по ТЗ их дёргать из этого модуля. Однако это дичь и есть баги. Когда вопрос задашь, сделай нормально, дергая отель или номер в самом начале метода. И изЕнаблед можно будет нормально проверять
    if (!newReservation.roomId) {
      await this.ReservationModel.deleteOne({ id: newReservation.id })
      // Также нужно проверять, что номер не отключён (isEnabled)
      throw new HttpException(
        'НЕСУЩЕСТВУЮЩИЙ НОМЕР!',
        HttpStatus.BAD_REQUEST,
      );
    };

    if (!newReservation.hotelId) {
      await this.ReservationModel.deleteOne({ id: newReservation.id })
      throw new HttpException(
        'НЕСУЩЕСТВУЮЩИЙ ОТЕЛЬ!',
        HttpStatus.BAD_REQUEST,
      );
    }

    return newReservation;
  }

  async removeReservation(id: ID, user: User & { id: ID }): Promise<void> {
    const targetReservation = await this.ReservationModel.findById(id);
    if (!targetReservation) {
      throw new BadRequestException('Такой брони не существует')
    }
    if (user.role === Roles.CLIENT) {
      if (user.id.toString() === String(targetReservation.userId)) {
        await this.ReservationModel.deleteOne({ id })
      } else {
        throw new ForbiddenException('Объявление может удалить только тот же пользователь, который его создал!')
      }
    } else if (user.role === Roles.MANAGER) {
      await this.ReservationModel.deleteOne({ id })
    }
  }

  async getReservations({ userId, dateStart, dateEnd }: ReservationSearchOptions): Promise<Reservation[]> {
    const selectionCriteria = { userId, dateStart, dateEnd };

    for (const param in selectionCriteria) {
      if (!selectionCriteria[param]) {
        delete selectionCriteria[param];
      }
    }
      
    return await this.ReservationModel
      .find(selectionCriteria)
      .select('-__v -_id -userId')
      .populate({
        path: 'hotelId', // только'hotel'
        select: 'title description -_id',
      })
      .populate({
        path: 'roomId', // под именем hotelRoom
        select: 'description images -_id',
      });
  }
}
