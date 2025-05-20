'use client';

import { useState } from 'react';
import { apiPost } from '@/app/api/api';
import { setToken, setRefreshToken } from '@/app/api/cookie';

interface LoginFormProps {
  onSuccess?: () => void;
}

export default function LoginForm({ onSuccess }: LoginFormProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    try {
      const res = await apiPost('/auth/login/', { email, password }) as { access: string; refresh: string };
      setToken(res.access);
      setRefreshToken(res.refresh);
      if (onSuccess) onSuccess();
    } catch (err: any) {
      setError('Invalid email or password');
    }
  };

  return (
    <form onSubmit={handleLogin} className="space-y-4">
      {error && <p className="text-red-500">{error}</p>}
      <div>
        <label className="block text-sm font-medium">Email</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <div>
        <label className="block text-sm font-medium">Password</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full border px-3 py-2 rounded"
          required
        />
      </div>
      <button
        type="submit"
        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
      >
        Log In
      </button>
    </form>
  );
}
