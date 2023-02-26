import {
  HttpException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/schemas/user.schema';
import { UserDto } from '../users/typing/interfaces/user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords } from 'src/helpers/encrypting';

@Injectable()
// TODO: А должен ли сервис авторизации наследоваться от какого-то интерфейса, также как и юзер? Наверное, хороший тон, как минимум, потому лучше допили.
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  protected createToken(payload: {
    email: User['email'];
    name: User['name'];
    role: User['role'];
  }) {
    return this.jwtService.sign(payload);
  }

  async login(
    body: Omit<UserDto, 'name' | 'contactPhone' | 'role'>,
  ): Promise<User> {
    try {
      const user = await this.usersService.findByEmail(body.email);
      if (user) {
        const isValidPassword = await comparePasswords(
          body.password,
          user.passwordHash,
        );
        if (isValidPassword) {
          const token = this.createToken({
            email: user.email,
            name: user.name,
            role: user.role,
          });
          console.log(token);
          return user;
        } else {
          throw new UnauthorizedException('Неверный пароль!');
        }
      } else {
        throw new NotFoundException('Такой пользователь не зарегистрирован!');
      }
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }
}
