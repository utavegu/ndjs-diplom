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

  createToken(payload: {
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
      // TODO: А что на счёт выставления куки?
      const user = await this.usersService.findByEmail(body.email);
      if (user) {
        const isValidPassword = await comparePasswords(
          body.password,
          user.passwordHash,
        );
        if (isValidPassword) {
          // Перенес в контроллер
          // this.createToken({
          //   email: user.email,
          //   name: user.name,
          //   role: user.role,
          // });
          return user;
        } else {
          throw new UnauthorizedException('Неверный пароль!');
        }
      } else {
        throw new UnauthorizedException(
          'Такой пользователь не зарегистрирован!',
          // Почему опять в консоль пуляешь, а не в ответ?.. ты как-то через раз это делаешь...
        );
      }
    } catch (err) {
      throw new HttpException(err.message, err.status);
    }
  }

  /*
  async logout(request, session) {
    // console.log(request.isAuthenticated());
    // console.log(session);
    // TODO: А что на счёт удаления куки?
    // request.logout(); эээмм... ну тогда надо повникать будет
    // Читай то, что у тебя в закладках JWT и 3 статьи документации неста. Сейчас самое время в эту тему поврубаться и сделать всё максимально красиво (увы, пока без клиента). Видео Улбика по продвинутой JWT-авторизации
  }
  */
}
