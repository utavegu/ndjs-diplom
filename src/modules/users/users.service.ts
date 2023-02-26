/* eslint-disable prettier/prettier */
import { BadRequestException, HttpException, Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { DEFAULT_USERS_LIMIT, DEFAULT_USERS_OFFSET, ERROR_MESSAGES } from 'src/constants';
import { encryptPassword } from 'src/helpers/encrypting';
import { ID } from 'src/types/id';
import { User, UserDocument } from './schemas/user.schema';
import { ISearchUserParams } from './typing/interfaces/ISearchUserParams';
import { IUserService } from './typing/interfaces/IUserService';
import { UserDto } from './typing/interfaces/user.dto';
import { Roles } from './typing/enums/roles.enum';

@Injectable()
export class UsersService implements IUserService {
  constructor(@InjectModel(User.name) private UserModel: Model<UserDocument>) { }

  // ПРОМИС ЮЗЕР должен возвращать, НО! + _id и - passwordHash и role
  async create(data: Omit<UserDto, 'role'>): Promise<User> {
    try {
      const user = this.findByEmail(data.email);
      if (!user) {
        const { password, ...other } = data;
        const passwordHash = await encryptPassword(password);
        // TODO: Возвращаю слишком много полей. Надо придумать, как возвращать только имя, почту и айдишник, которого, внимание, нет в User! (читай по create и save, а также как расширить юзер прямо тут)
        return await this.UserModel.create({ ...other, passwordHash, role: Roles.CLIENT });
      } else {
        throw new BadRequestException(ERROR_MESSAGES.USER_IS_ALREADY_USER_IS_NOT_REGISTERED);
      }
    } catch (err) {
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
        limit = DEFAULT_USERS_LIMIT,
        offset = DEFAULT_USERS_OFFSET,
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
