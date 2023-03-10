/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEFAULT_LIMIT, DEFAULT_OFFSET, ERROR_MESSAGES } from 'src/constants';
import { encryptPassword } from 'src/helpers/encrypting';
import { ID } from 'src/types/id';
import { User, UserDocument } from './schemas/user.schema';
import { ISearchUserParams } from './typing/interfaces/ISearchUserParams';
import { IUserService } from './typing/interfaces/IUserService';
import { UserDto } from './typing/interfaces/user.dto';
import { Roles } from './typing/enums/roles.enum';
import { CreateReturnedUserType } from './typing/types/returned-user.type';

@Injectable()
export class UsersService implements IUserService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) { }

  async create(data: Partial<UserDto>, loggedUser?: User): Promise<CreateReturnedUserType> {
    try {
      const { password, ...other } = data;
      const passwordHash = await encryptPassword(password);
      const newUser = await this.UserModel.create({
        ...other, passwordHash,
        role: loggedUser?.role === Roles.ADMIN ? data.role : Roles.CLIENT
      });
      // TODO: Пожалуй, правильнее это было сделать на уровне контроллера. Но пока оставлю так, это уже косметика
      const returnedUser: CreateReturnedUserType = {
        id: newUser._id,
        email: newUser.email,
        name: newUser.name,
      }
      if (loggedUser && loggedUser.role === Roles.ADMIN) {
        returnedUser.contactPhone = newUser.contactPhone;
        returnedUser.role = newUser.role;
      }
      // TODO: Однако, неплохо бы найти способ через Монгуз, наподобии .select (читай по create и save). Тогда Partial уберешь.
      return returnedUser;
    } catch (err) {
      // TODO: выглядит не очень надежно, вероятно, есть способы лучше. Как вариант, можно было дернуть юзера в базе, но тогда:
      // 1) Лишний запрос в базу (на сколько это плохо?)
      // 2) Нужно будет в методе поиска юзера по емэйлу возвращать налл, а не эксепшн (что в целом логично)
      if (err.code === 11000 && String(err.keyPattern) === String({ email: 1 })) {
        throw new BadRequestException(ERROR_MESSAGES.USER_IS_ALREADY_REGISTERED);
      }
      throw new HttpException(err.message, err.status);
    }
  }

  async findById(id: ID): Promise<User> {
    try {
      const user = await this.UserModel.findById(id).select('-__v -passwordHash');
      if (user) {
        return user
      }
      else {
        throw new NotFoundException(ERROR_MESSAGES.USER_IS_NOT_REGISTERED);
      }
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async findByEmail(email: string): Promise<User> {
    try {
      const user = await this.UserModel.findOne({ email }).select('-__v'); // Тут еще пассворд хэш был, но мне он нужен в аутх.логин
      if (user) {
        return user
      }
      else {
        throw new NotFoundException(ERROR_MESSAGES.USER_IS_NOT_REGISTERED);
      }
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  async findAll(params: ISearchUserParams): Promise<User[]> {
    try {
      const {
        limit = DEFAULT_LIMIT,
        offset = DEFAULT_OFFSET,
      } = params;

      // TODO: Сделать большую коллекцию юзеров через "монго шел -> инсерт мэни" и потестить разные кейсы
      // TODO2: Тоже как-то типизировать надо, наверное?
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

      // TODO: По хорошему я бы ещё длину массива, пожалуй, возвращал в ответе, в формате { data: users, length: *, status: sucess }, но в задании такого нет. На будущее себе пометь. Ну и соответствующий тип, что-то вроде "ЮзерФайндОлРеспонс"
      return await this.UserModel
        .find(selectionCriteria)
        .limit(limit)
        .skip(offset)
        .select('-__v -passwordHash -role');
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
