"use client";

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { getCookie, setCookie, removeCookie } from '@/app/api/cookie';
import { apiPost } from '../api/api';
import { AuthResponse, User } from '@/app/types/auth';

interface AuthState {
  isAuthenticated: boolean;
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  setUser: (user: User | null) => void;
}

const initialAccessToken = getCookie('access_token') || null;
const initialRefreshToken = getCookie('refresh_token') || null;

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      isAuthenticated: !!initialAccessToken,
      user: null,
      accessToken: initialAccessToken,
      refreshToken: initialRefreshToken,
      login: async (email: string, password: string) => {
        try {
          const response = await apiPost<AuthResponse>('/auth/login/', { email, password });
          set({
            isAuthenticated: true,
            user: response.user,
            accessToken: response.access,
            refreshToken: response.refresh,
          });
          setCookie('access_token', response.access, { path: '/' });
          setCookie('refresh_token', response.refresh, { path: '/' });
        } catch (error: any) {
          console.error('Login failed:', error.response?.data || error.message);
          throw error;
        }
      },
      logout: () => {
        set({
          isAuthenticated: false,
          user: null,
          accessToken: null,
          refreshToken: null,
        });
        removeCookie('access_token');
        removeCookie('refresh_token');
      },
      setUser: (user: User | null) => {
        set({ user });
      },
    }),
    {
      name: 'auth-storage',
      storage: createJSONStorage(() => localStorage),
      partialize: (state) => ({
        isAuthenticated: state.isAuthenticated,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        user: state.user,
      }),
    }
  )
);
