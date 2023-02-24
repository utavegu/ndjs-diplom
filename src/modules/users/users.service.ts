/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEFAULT_USERS_LIMIT, DEFAULT_USERS_OFFSET } from 'src/constants';
import { ID } from 'src/types/id';
import { User, UserDocument } from './schemas/user.schema';
import { ISearchUserParams } from './typing/interfaces/ISearchUserParams';
import { IUserService } from './typing/interfaces/IUserService';

@Injectable()
export class UsersService implements IUserService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) { }

  async create(data: Partial<User>): Promise<User> {
    try {
      return await new this.UserModel(data).save();
    } catch (err) {
      console.error(err);
    }
  }

  async findById(id: ID): Promise<User> {
    try {
      // eslint-disable-next-line prettier/prettier
      const user = await this.UserModel.findById(id).select('-__v -passwordHash');
      if (user) {
        return user;
      }
      // TODO: иначе выкинуть кастомное исключение, что такого пользователя нет
    } catch (err) {
      console.error(err);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      // eslint-disable-next-line prettier/prettier
      const user = await this.UserModel.findOne({ email }).select('-__v -passwordHash');
      if (user) {
        return user;
      }
      // TODO: иначе выкинуть кастомное исключение, что такого пользователя нет
    } catch (err) {
      console.error(err);
    }
  }

  async findAll(params: ISearchUserParams): Promise<User[]> {
    const {
      limit = DEFAULT_USERS_LIMIT,
      offset = DEFAULT_USERS_OFFSET,
    } = params;

    // TODO: Сделать большую коллекцию юзеров через "монго шел -> инсерт мэни" и потестить разные кейсы
    const selectionCriteria = {
      email: params.email && { $regex: params.email },
      name: params.name && { $regex: params.name },
      contactPhone: params.contactPhone && { $regex: params.contactPhone },
    };

    for (const param in selectionCriteria) {
      if (!selectionCriteria[param]) {
        delete selectionCriteria[param];
      }
    }

    // TODO: По хорошему я бы ещё длину массива, пожалуй, возвращал в ответе, в формате { data: users, length: *, status: sucess }, но в задании такого нет. На будущее себе пометь.
    return await this.UserModel
      .find(selectionCriteria)
      .limit(limit)
      .skip(offset)
      .select('-__v -passwordHash -role');
  }
}
