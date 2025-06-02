// src/app/api/api.ts
import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { getToken } from './cookie';

const api: AxiosInstance = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/',
  timeout: 20000, // 20 seconds timeout for requests means we won't wait indefinitely
  // DO NOT set 'Content-Type' here — let Axios set it automatically per request
});

// Add auth token to headers if present
import type { InternalAxiosRequestConfig } from 'axios';

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = getToken();
    if (token) {
      config.headers = config.headers || {};
      (config.headers as Record<string, string>)['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error) => {
    if (error.code === 'ECONNREFUSED') {
      console.error(
        'Connection refused. Is backend running at',
        process.env.NEXT_PUBLIC_API_URL || 'http://127.0.0.1:8000/api/'
      );
    } else if (error.response?.status === 401) {
      console.error('Unauthorized. Please login again.');
    }
    return Promise.reject(error);
  }
);

// Helper functions for JSON APIs (default Content-Type: application/json)
export const apiGet = <T>(url: string, config?: AxiosRequestConfig) =>
  api.get<T>(url, config).then((res) => res.data);

export const apiPost = <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
  api.post<T>(url, data, config).then((res) => res.data);

export const apiPut = <T>(url: string, data?: any, config?: AxiosRequestConfig) =>
  api.put<T>(url, data, config).then((res) => res.data);

export const apiDelete = <T>(url: string, config?: AxiosRequestConfig) =>
  api.delete<T>(url, config).then((res) => res.data);

export default api;
