'use client';

import { useEffect } from 'react';
import { authStore } from '@onic/argus-frontend/stores/useAuthStore';

export default function AuthBootstrapper() {
  useEffect(() => {
    const fetchUser = async () => {
      try {
        const res = await fetch('/api/me');
        if (!res.ok) throw new Error('Not authenticated');
        const data = await res.json();
        authStore.setState({ user: data });
      } catch {
        authStore.setState({ user: null });
      }
    };

    fetchUser();
  }, []);

  return null;
}
