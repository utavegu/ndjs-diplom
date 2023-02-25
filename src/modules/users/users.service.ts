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
    console.log(data);
    // хэширование пароля password -> passwordHash. В таком виде модель юзера уже дату не схавает, так как там необходимо поле именно пассвордХэш
    try {
      return await new this.UserModel(data).save();
    } catch (err) {
      console.error(err);
    }
  }

  async findById(id: ID): Promise<User> {
    // TODO: Вот это у меня по-моему шляпа с разделением перехвата ошибок на контроллер и сервис, но лучше пока не придумал. Кэтч тут мало шансов имеет сработать, ибо ненайденный пользователь ошибкой не считается - просто налл.
    try {
      return await this.UserModel.findById(id).select('-__v -passwordHash');
    } catch (err) {
      console.error(err);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      return await this.UserModel.findOne({ email }).select('-__v -passwordHash');
    } catch (err) {
      console.error(err);
    }
  }

  // TODO: тоже трай-кэтч!
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
