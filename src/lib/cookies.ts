import Cookies from 'js-cookie';

const TOKEN_KEY = 'auth_token';
const REFRESH_TOKEN_KEY = 'refresh_token';

const COOKIE_OPTIONS = {
  expires: 7, // 7 days
  secure: import.meta.env.PROD, // Only send over HTTPS in production
  sameSite: 'strict' as const,
};

export const cookieUtils = {
  setToken: (token: string) => {
    Cookies.set(TOKEN_KEY, token, COOKIE_OPTIONS);
  },

  getToken: (): string | undefined => {
    return Cookies.get(TOKEN_KEY);
  },

  setRefreshToken: (refreshToken: string) => {
    Cookies.set(REFRESH_TOKEN_KEY, refreshToken, COOKIE_OPTIONS);
  },

  getRefreshToken: (): string | undefined => {
    return Cookies.get(REFRESH_TOKEN_KEY);
  },

  removeTokens: () => {
    Cookies.remove(TOKEN_KEY);
    Cookies.remove(REFRESH_TOKEN_KEY);
  },

  hasTokens: (): boolean => {
    return !!(Cookies.get(TOKEN_KEY) && Cookies.get(REFRESH_TOKEN_KEY));
  },
};

