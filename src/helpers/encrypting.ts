import * as bcrypt from 'bcrypt';

const encryptPassword = async (password: string): Promise<string> => {
  const saltRounds = 7; // TODO В енв. И помни, что когда достаешь оттуда - надо будет в намбер преобразовать. Хотя не знаю на сколько это секретная инфа. Можно и просто в константы, наверное.
  const salt = await bcrypt.genSalt(saltRounds);
  const passwordHash = await bcrypt.hash(password, salt);
  return passwordHash;
};

const comparePasswords = async (
  enteredPassword: string,
  createdPassword: string,
): Promise<boolean> => {
  return await bcrypt.compare(enteredPassword, createdPassword);
};

export { encryptPassword, comparePasswords };
