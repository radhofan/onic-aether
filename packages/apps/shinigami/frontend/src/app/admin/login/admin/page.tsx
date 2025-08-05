'use client';
import React, { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { useAuthStore } from '@onic/shinigami-frontend/stores/useAuthStore';

export default function LoginAdmin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState('admin');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await fetch('/api/authAdmin', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
        credentials: 'include',
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Login failed');
      }

      useAuthStore.getState().setAuth(data.admin.role, data.admin.name);
      router.push('/admin');
    } catch (err) {
      setError(
        err instanceof Error ? err.message : 'An unknown error occurred'
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleGuestLogin = async () => {
    await fetch('/api/removeCookie', { method: 'POST' });
    useAuthStore.getState().logout();
    useAuthStore.getState().setAuth('guest', 'Guest');
    router.push('/admin');
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[url('/images/login.jpg')] bg-cover bg-center bg-no-repeat px-4">
      <div className="bg-white p-4 sm:p-6 md:p-8 rounded-lg shadow-md w-full max-w-md">
        <div className="flex items-center mb-6">
          <Image
            src="/images/admin.png"
            alt="Admin Icon"
            width={24}
            height={24}
            className="mr-4"
          />
          <h2 className="text-2xl font-bold text-gray-800">Login Admin</h2>
          <select
            name="role"
            value={role}
            onChange={(e) => {
              const selectedRole = e.target.value;
              setRole(selectedRole);
              router.push(`/admin/login/${selectedRole}`);
            }}
            className="ml-22 mt-1 border border-gray-300 rounded-md px-3 py-2 text-sm bg-white text-gray-700 shadow-sm hover:border-gray-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          >
            <option value="admin">Admin</option>
            <option value="approver">Approver</option>
            <option value="pengawas">Pengawas</option>
          </select>
        </div>

        {error && (
          <div className="mb-4 p-2 text-sm text-red-600 bg-red-50 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-gray-700 font-medium mb-2"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="sadrak@gmail.com"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <div className="mb-4 relative">
            <label
              htmlFor="password"
              className="block text-gray-700 font-medium mb-2"
            >
              Password
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:border-indigo-500"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gray-800 text-white px-4 py-2 rounded-md hover:bg-gray-700 transition duration-300 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isLoading ? 'Logging in...' : 'Log In'}
          </button>
        </form>

        <button
          onClick={handleGuestLogin}
          className="mt-4 w-full px-4 py-2 rounded-md border border-gray-400 text-gray-800 bg-white shadow-sm hover:bg-gray-50 hover:border-gray-600 hover:text-black transition duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
        >
          Masuk sebagai guest
        </button>
      </div>
    </div>
  );
}
