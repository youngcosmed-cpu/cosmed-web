'use client';

import {
  createContext,
  useCallback,
  useEffect,
  useState,
} from 'react';
import { useRouter } from 'next/navigation';
import { api, setAccessToken } from '@/lib/api/client';

interface Admin {
  id: number;
  email: string;
  name: string;
}

export interface AuthContextType {
  admin: Admin | null;
  isLoading: boolean;
  logout: () => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const router = useRouter();
  const [admin, setAdmin] = useState<Admin | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Try to restore session via refresh token
    const initAuth = async () => {
      try {
        const { data: refreshData } = await api.post('/auth/refresh');
        setAccessToken(refreshData.accessToken);

        const { data: meData } = await api.get('/auth/me');
        setAdmin(meData);
      } catch {
        setAccessToken(null);
        document.cookie = 'auth=; path=/; max-age=0';
        router.replace('/admin/login');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, [router]);

  const logout = useCallback(async () => {
    try {
      await api.post('/auth/logout');
    } catch {
      // Ignore errors during logout
    } finally {
      setAccessToken(null);
      setAdmin(null);
      document.cookie = 'auth=; path=/; max-age=0';
      router.replace('/admin/login');
    }
  }, [router]);

  return (
    <AuthContext.Provider value={{ admin, isLoading, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
