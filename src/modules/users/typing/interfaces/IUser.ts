import { ID } from 'src/types/id';
import { Roles } from '../enums/roles.enum';

export interface IUser {
  _id: ID;
  email: string;
  passwordHash: string;
  name: string;
  contactPhone?: string;
  role: Roles;
}
