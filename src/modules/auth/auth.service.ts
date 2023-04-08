import {
  HttpException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { User } from '../users/schemas/user.schema';
import { UserDto } from '../users/typing/interfaces/user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords } from 'src/helpers/encrypting';
import { ERROR_MESSAGES } from 'src/constants';

@Injectable()
// TODO: А должен ли сервис авторизации наследоваться от какого-то интерфейса, также как и юзер? Наверное, хороший тон, как минимум, потому лучше допили.
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  createToken(payload: {
    sub: User['email']; // TODO: или им может быть только айдишник?
    name: User['name'];
    role: User['role'];
  }) {
    const fullPayload = {
      ...payload,
      // TODO: С полями, которые принято передавать в пэйлоад JWT-токена поразбирайся уже после диплома
      // iat: Date.now(), // Вот из-за этого поля токен протухать перестал, видимо неправильно настроил
      // exp: '120s', // TODO: env. И не уверен, что именно в таком формате это делается тут... Да, по хорошему должно быть в Unix Time (iat + exp)
    };
    return this.jwtService.sign(fullPayload);
  }

  async login(body: Pick<UserDto, 'email' | 'password'>): Promise<User> {
    try {
      const user = await this.usersService.findByEmail(body.email);
      if (user) {
        const isValidPassword = await comparePasswords(
          body.password,
          user.passwordHash,
        );
        if (isValidPassword) {
          // криейт токен был тут, но переехал в контроллер
          return user;
        } else {
          throw new UnauthorizedException('Неверный пароль!');
        }
      } else {
        throw new UnauthorizedException(ERROR_MESSAGES.USER_IS_NOT_REGISTERED);
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
