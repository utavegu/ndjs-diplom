import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ExtractJwt, Strategy } from 'passport-jwt';
import { UsersService } from '../users/users.service';
import { Request as RequestType } from 'express';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private userService: UsersService) {
    super({
      // jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(), // Вариант для забирания через заголовок Authorization: Bearer ...
      jwtFromRequest: ExtractJwt.fromExtractors([
        JwtStrategy.extractJWT,
        // ExtractJwt.fromAuthHeaderAsBearerToken(), // Видимо, если нужно разрешить оба варианта извлечения токена - и через заголовок, и из кукисов
      ]),
      // ignoreExpiration: false, // TODO: Разберись в этом параметре
      secretOrKey: process.env.SECRET_OR_KEY, // В идеале должен браться из некоего constructor(private readonly configService: ConfigService), import { ConfigService } from '@nestjs/config';
    });
  }

  private static extractJWT(request: RequestType): string | null {
    if (
      request.cookies &&
      'token' in request.cookies
      // && request.cookies.user_token.length > 0
    ) {
      return request.cookies.token;
    }
    return null;
  }

  public async validate(payload: any) {
    const user = await this.userService.findByEmail(payload.sub);
    if (!user) {
      throw new UnauthorizedException();
    }
    return user;
  }
}

/*
Можно валидэйт чутка перепилить:
 async validate(payload: any) {
    // validating payload here
		if (<user is authenticated>) {
			return <user data here>
		}

		// return 401 Unauthorized error
    return null;
  }
*/
