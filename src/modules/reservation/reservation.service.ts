import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
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
  ) {}

  addReservation(data: ReservationDto): Promise<Reservation> {
    throw new Error('Method not implemented.');
  }

  removeReservation(id: ID): Promise<void> {
    throw new Error('Method not implemented.');
  }

  getReservations(filter: ReservationSearchOptions): Promise<Reservation[]> {
    throw new Error('Method not implemented.');
  }
}
