import { Roles } from '../enums/roles.enum';

export interface UserDto {
  email: string;
  passwordHash: string;
  name: string;
  contactPhone?: string;
  role: Roles;
}
