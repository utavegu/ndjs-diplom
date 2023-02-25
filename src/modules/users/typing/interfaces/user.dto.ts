import { Roles } from '../enums/roles.enum';

export interface UserDto {
  email: string;
  password: string;
  name: string;
  contactPhone?: string;
  role: Roles;
}
