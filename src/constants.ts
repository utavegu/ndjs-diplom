/* eslint-disable prettier/prettier */
export const DEFAULT_LIMIT = 10;
export const DEFAULT_OFFSET = 0;
export const ERROR_MESSAGES = {
  USER_IS_NOT_REGISTERED: 'Такой пользователь не зарегистрирован!',
  USER_IS_ALREADY_REGISTERED: 'Такой пользователь уже зарегистрирован!',
  ONLY_AVAILABLE_NON_AUTHENTICATED_USERS: 'Доступно только неаутентифицированным пользователям',
  ONLY_AVAILABLE_AUTHENTICATED_USERS: 'Доступно только аутентифицированным пользователям',
  INVALID_ID: 'Ошибка ввода ID!',
  DO_NOT_ACCESS_RIGHTS: 'У вас недостаточно прав доступа!',
};
export const SALT_ROUNDS = 7;
export const JWT_TOKEN_EXPIRES = 9000; // в секундах