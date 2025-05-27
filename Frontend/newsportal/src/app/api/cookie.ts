// src/app/api/cookie.ts
import Cookies from 'js-cookie';

export const setToken = (token: string, options: Cookies.CookieAttributes = {}) => {
  Cookies.set('access_token', token, {
    expires: 1, // 1 day
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    ...options,
  });
};

export const getToken = (): string | undefined => Cookies.get('access_token');

export const removeToken = () => Cookies.set('access_token', '', { expires: -1 });

export const setRefreshToken = (token: string, options: Cookies.CookieAttributes = {}) => {
  Cookies.set('refresh_token', token, {
    expires: 7, // 7 days
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    ...options,
  });
};

export const getRefreshToken = (): string | undefined => Cookies.get('refresh_token');

export const removeRefreshToken = () => Cookies.set('refresh_token', '', { expires: -1 });

export const setCookie = (name: string, value: string, options: Cookies.CookieAttributes = {}) => {
  Cookies.set(name, value, {
    expires: 7,
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    ...options,
  });
};

export const getCookie = (name: string): string | undefined => Cookies.get(name);

export const removeCookie = (name: string, p0: { path: string; }) => Cookies.set(name, '', { expires: -1 });