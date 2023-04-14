import { ID } from 'src/types/id';
import { Reservation } from './reservation.model';
import { User } from '../users/schemas/user.schema';

interface ReservationDto {
  userId: ID;
  hotelId: ID;
  roomId: ID;
  dateStart: Date;
  dateEnd: Date;
}

interface ReservationSearchOptions {
  userId: ID;
  dateStart: Date;
  dateEnd: Date;
}

interface IReservation {
  addReservation(data: ReservationDto): Promise<Reservation>;
  removeReservation(id: ID, user: User): Promise<void>;
  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>>;
}

export { ReservationDto, ReservationSearchOptions, IReservation };
