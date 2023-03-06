import { ID } from 'src/types/id';
import { User } from '../../schemas/user.schema';

export type CreateReturnedUserType = Partial<User> & { id: ID };

export type ClientReturnedUserType = Pick<
  CreateReturnedUserType,
  'id' | 'email' | 'name'
>;

export type AdminReturnedUserType = Pick<
  CreateReturnedUserType,
  'id' | 'email' | 'name' | 'contactPhone' | 'role'
>;
