import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ID } from 'src/types/id';
import { User, UserDocument } from './schemas/user.schema';
import { IUser } from './typing/interfaces/IUser';
import { IUserService } from './typing/interfaces/IUserService';
import { UserDto } from './typing/interfaces/UserDto';

@Injectable()
export class UsersService implements IUserService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) {}

  async create(data: Partial<User>): Promise<User> {
    const user = new this.UserModel(data);
    return user.save();
  }

  findAll(): Promise<User[]> {
    throw new Error('Method not implemented.');
  }

  findById(id: ID): Promise<User> {
    throw new Error('Method not implemented.');
  }

  findByEmail(email: string): Promise<User> {
    throw new Error('Method not implemented.');
  }
}
