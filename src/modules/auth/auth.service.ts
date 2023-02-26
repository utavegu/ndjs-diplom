import { Injectable } from '@nestjs/common';
import { User } from '../users/schemas/user.schema';
import { UserDto } from '../users/typing/interfaces/user.dto';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import { comparePasswords } from 'src/helpers/encrypting';

@Injectable()
// TODO: А должен ли сервис авторизации наследоваться от какого-то интерфейса, также как и юзер?
export class AuthService {
  constructor(
    private readonly usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  createToken(payload: { email: User['email']; name: User['name'] }) {
    return this.jwtService.sign(payload);
  }

  async login(
    body: Omit<UserDto, 'name' | 'contactPhone' | 'role'>,
  ): Promise<User> {
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
        });
        console.log(token);
        return user;
      } else {
        // TODO: эксепшн, что такой пароль не верный
      }
    } else {
      // TODO: эксепшн, что такой пользователь не зарегистрирован
    }
  }
}
