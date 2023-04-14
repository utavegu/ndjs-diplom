/* eslint-disable prettier/prettier */
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
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

    // TODO: Всё-таки потести, если тут пустой массив придёт
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

    // TODO: Как иначе проверять существование номера или отеля я не знаю, раз мне нельзя по ТЗ их дёргать из этого модуля
    if (!newReservation.roomId) {
      // TODO: И сразу удаляй эту резервацию (когда метод будет), потому что как сделать иначе, я хз
      // Также нужно проверять, что номер не отключён
      throw new HttpException(
        'НЕСУЩЕСТВУЮЩИЙ НОМЕР!',
        HttpStatus.BAD_REQUEST,
      );
    };

    if (!newReservation.hotelId) {
      // TODO: И сразу удаляй эту резервацию (когда метод будет), потому что как сделать иначе, я хз
      throw new HttpException(
        'НЕСУЩЕСТВУЮЩИЙ ОТЕЛЬ!',
        HttpStatus.BAD_REQUEST,
      );
    }

    return newReservation;
  }

  removeReservation(id: ID): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getReservations(filter: ReservationSearchOptions): Promise<Reservation[]> {
    throw new Error('Method not implemented.');
  }
}
