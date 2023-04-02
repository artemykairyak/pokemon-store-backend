import { Token } from '../tokens/token.entity';
import { User } from '../users/user.entity';

export const sendOkResponse = (message?: string, result?: any) => {
  return {
    statusCode: 200,
    data: result,
    message,
  };
};

export const getTokensForResponse = (tokens: Token[]) => {
  return tokens.map((item) => {
    if (item.owner) {
      return item;
    }

    return { ...item, owner: { id: null, username: null } as User };
  });
};

export const getUserWithoutPassword = (users: User[]) => {
  return users.map((item) => ({ ...item, password: '' }));
};

export const parseCookieString = (cookieString: string) => {
  const cookies = {};
  const cookieList = cookieString.split(';');
  for (let i = 0; i < cookieList.length; i++) {
    const parts = cookieList[i].trim().split('=');
    const name = decodeURIComponent(parts[0]);
    cookies[name] = decodeURIComponent(parts[1]);
  }

  return cookies;
};
