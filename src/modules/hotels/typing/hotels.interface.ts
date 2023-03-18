import { ID } from 'src/types/id';
import { HotelRoom } from '../schemas/hotel-room.schema';
import { Hotel } from '../schemas/hotel.schema';

interface SearchHotelParams {
  limit: number;
  offset: number;
  title: string;
}

interface UpdateHotelParams {
  title: string;
  description: string;
}

interface IHotelService {
  create(data: any): Promise<Hotel>;
  findById(id: ID): Promise<Hotel>;
  search(params: SearchHotelParams): Promise<Hotel[]>;
  update(id: ID, data: UpdateHotelParams): Promise<Hotel>;
}

interface SearchRoomsParams {
  limit: number;
  offset: number;
  hotel: ID;
  isEnabled?: boolean;
}

interface HotelRoomService {
  create(data: Partial<HotelRoom>): Promise<HotelRoom>;
  findById(id: ID): Promise<HotelRoom>;
  // В методе search флаг isEnabled может принимать только boolean значения или может быть не передан, тогда должны вернутся все записи:
  // true — флаг должен использоваться в фильтрации;
  // undefined — если не передан параметр, флаг должен игнорироваться.
  search(params: SearchRoomsParams): Promise<HotelRoom[]>;
  update(id: ID, data: Partial<HotelRoom>): Promise<HotelRoom>;
}

export {
  SearchHotelParams,
  UpdateHotelParams,
  IHotelService,
  SearchRoomsParams,
  HotelRoomService,
};
