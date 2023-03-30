import { ID } from 'src/types/id';
import { Reservation } from './reservation.model';

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
  // Метод IReservation.addReservation должен проверять, доступен ли номер на заданную дату.
  addReservation(data: ReservationDto): Promise<Reservation>;
  removeReservation(id: ID): Promise<void>;
  getReservations(
    filter: ReservationSearchOptions,
  ): Promise<Array<Reservation>>;
}

export { ReservationDto, ReservationSearchOptions, IReservation };