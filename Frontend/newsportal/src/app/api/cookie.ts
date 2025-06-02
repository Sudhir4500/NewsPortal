import Cookies from 'js-cookie';

// Set access token with 1-day expiration to match backend ACCESS_TOKEN_LIFETIME
export const setToken = (token: string, options: Cookies.CookieAttributes = {}) => {
  Cookies.set('access_token', token, {
    expires: 1, // 1 day
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    ...options,
  });
};

// Get access token
export const getToken = (): string | undefined => Cookies.get('access_token');

// Remove access token
export const removeToken = (options: Cookies.CookieAttributes = {}) => {
  Cookies.remove('access_token', { path: '/', ...options });
};

// Set refresh token with 7-day expiration to match backend REFRESH_TOKEN_LIFETIME
export const setRefreshToken = (token: string, options: Cookies.CookieAttributes = {}) => {
  Cookies.set('refresh_token', token, {
    expires: 7, // 7 days
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    ...options,
  });
};

// Get refresh token
export const getRefreshToken = (): string | undefined => Cookies.get('refresh_token');

// Remove refresh token
export const removeRefreshToken = (options: Cookies.CookieAttributes = {}) => {
  Cookies.remove('refresh_token', { path: '/', ...options });
};

// Generic cookie setter with explicit expiration
export const setCookie = (name: string, value: string, options: Cookies.CookieAttributes = {}) => {
  Cookies.set(name, value, {
    expires: options.expires || 7, // Default to 7 days, but allow override
    path: '/',
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'strict',
    ...options,
  });
};

// Get generic cookie
export const getCookie = (name: string): string | undefined => Cookies.get(name);

// Remove generic cookie
export const removeCookie = (name: string, options: Cookies.CookieAttributes = {}) => {
  Cookies.remove(name, { path: '/', ...options });
};