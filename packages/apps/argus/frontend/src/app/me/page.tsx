'use client';
import { useStore } from 'zustand';
import { authStore } from '@/stores/useAuthStore';

export default function Example() {
  const user = useStore(authStore, (s) => s.user);

  return (
    <>
      <div>{user ? `${user.name}` : 'Not Logged in'}</div>
      <div>{user ? `${user.bidang}` : 'Not Logged in'}</div>
    </>
  );
}
