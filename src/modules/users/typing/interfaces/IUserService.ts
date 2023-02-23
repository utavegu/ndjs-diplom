import { ID } from 'src/types/id';
import { ISearchUserParams } from './ISearchUserParams';
import { IUser } from './IUser';

export interface IUserService {
  create(data: Partial<IUser>): Promise<IUser>;
  findById(id: ID): Promise<IUser>;
  findByEmail(email: string): Promise<IUser>;
  findAll(params: ISearchUserParams): Promise<IUser[]>;
}
