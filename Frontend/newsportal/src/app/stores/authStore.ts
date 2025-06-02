'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getCookie, setCookie, removeCookie, getToken, setToken, getRefreshToken, setRefreshToken, removeToken, removeRefreshToken } from '@/app/api/cookie';
import { apiPost, apiGet } from '../api/api';
import { AuthResponse, User } from '@/app/types/auth';
import { useRouter } from 'next/navigation';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
  refreshAccessToken: () => Promise<void>;
  checkTokenValidity: () => Promise<boolean>;
}

// Helper function to decode JWT and check if it's expired
const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const expiry = payload.exp * 1000; // Convert to milliseconds
    return Date.now() >= expiry;
  } catch (error) {
    return true; // If token is invalid or malformed, treat as expired
  }
};

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      isAuthenticated: false,
      user: null,
      accessToken: getToken() || null, // Initialize from cookie
      refreshToken: getRefreshToken() || null, // Initialize from cookie
      login: async (email: string, password: string) => {
        try {
          const response = await apiPost<AuthResponse>('/auth/login/', { email, password });
          set({
            isAuthenticated: true,
            user: response.user,
            accessToken: response.access,
            refreshToken: response.refresh,
          });
          setToken(response.access);
          setRefreshToken(response.refresh);
        } catch (error: any) {
          const message = error.response?.data?.detail || 'Login failed. Please check your credentials.';
          throw new Error(message);
        }
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        });
        removeToken();
        removeRefreshToken();
        if (typeof window !== 'undefined') {
          window.location.href = '/';
        }
      },
      setUser: (user: User | null) => {
        set({ user, isAuthenticated: !!user });
      },
      refreshAccessToken: async () => {
        try {
          const { refreshToken } = get();
          if (!refreshToken || isTokenExpired(refreshToken)) {
            get().logout();
            throw new Error('No valid refresh token available');
          }
          const response = await apiPost<AuthResponse>('/refresh/', { refresh: refreshToken });
          set({
            isAuthenticated: true,
            accessToken: response.access,
            refreshToken: response.refresh || refreshToken, // Update if new refresh token provided
          });
          setToken(response.access);
          if (response.refresh) {
            setRefreshToken(response.refresh);
          }
        } catch (error: any) {
          get().logout();
          throw new Error('Session expired. Please log in again.');
        }
      },
      checkTokenValidity: async () => {
        const { accessToken, refreshAccessToken } = get();
        if (!accessToken || isTokenExpired(accessToken)) {
          try {
            await refreshAccessToken();
            return true;
          } catch (error) {
            get().logout();
            return false;
          }
        }
        try {
          await apiGet('/users/me/'); // Verify user session with backend
          return true;
        } catch (error: any) {
          get().logout();
          return false;
        }
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        user: state.user,
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
      }),
    }
  )
);

// Periodic token check for background validation
export const startTokenCheck = () => {
  const interval = setInterval(async () => {
    const { checkTokenValidity } = useAuthStore.getState();
    await checkTokenValidity();
  }, 15 * 60 * 1000); // Check every 15 minutes
  return () => clearInterval(interval);
};