'use client';

import * as React from 'react';
import { useRouter, usePathname } from 'next/navigation';

export interface AuthUser {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  mfaEnabled: boolean;
}

export interface ActiveTenant {
  id: string;
  name: string;
  slug: string;
  role: string;
  permissions: string[];
}

export interface AuthContextType {
  user: AuthUser | null;
  tenant: ActiveTenant | null;
  accessToken: string | null;
  isLoading: boolean;
  login: (data: { user: AuthUser; activeOrganization: ActiveTenant; accessToken: string; refreshToken?: string }) => void;
  logout: () => Promise<void>;
}

const AuthContext = React.createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = React.useState<AuthUser | null>(null);
  const [tenant, setTenant] = React.useState<ActiveTenant | null>(null);
  const [accessToken, setAccessToken] = React.useState<string | null>(null);
  const [isLoading, setIsLoading] = React.useState(true);
  const router = useRouter();
  const pathname = usePathname();

  React.useEffect(() => {
    // Check local storage for initial auth state
    const storedToken = localStorage.getItem('remotfix_access_token');
    const storedUser = localStorage.getItem('remotfix_user');
    const storedTenant = localStorage.getItem('remotfix_tenant');

    if (storedToken && storedUser && storedTenant) {
      try {
        setAccessToken(storedToken);
        setUser(JSON.parse(storedUser));
        setTenant(JSON.parse(storedTenant));
      } catch {
        localStorage.removeItem('remotfix_access_token');
        localStorage.removeItem('remotfix_user');
        localStorage.removeItem('remotfix_tenant');
      }
    }
    setIsLoading(false);
  }, []);

  const login = React.useCallback(
    (data: { user: AuthUser; activeOrganization: ActiveTenant; accessToken: string; refreshToken?: string }) => {
      setUser(data.user);
      setTenant(data.activeOrganization);
      setAccessToken(data.accessToken);

      localStorage.setItem('remotfix_access_token', data.accessToken);
      localStorage.setItem('remotfix_user', JSON.stringify(data.user));
      localStorage.setItem('remotfix_tenant', JSON.stringify(data.activeOrganization));

      router.push('/dashboard');
    },
    [router]
  );

  const logout = React.useCallback(async () => {
    const apiUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
    try {
      if (accessToken) {
        await fetch(`${apiUrl}/api/v1/auth/logout`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          credentials: 'include',
        });
      }
    } catch {
      // Ignore network errors on logout
    } finally {
      setUser(null);
      setTenant(null);
      setAccessToken(null);

      localStorage.removeItem('remotfix_access_token');
      localStorage.removeItem('remotfix_user');
      localStorage.removeItem('remotfix_tenant');

      router.push('/login');
    }
  }, [accessToken, router]);

  // Route protection
  React.useEffect(() => {
    if (!isLoading) {
      const isPublicRoute = pathname === '/login' || pathname === '/' || pathname === '/login/';
      if (!accessToken && !isPublicRoute) {
        router.push('/login');
      }
    }
  }, [accessToken, isLoading, pathname, router]);

  return (
    <AuthContext.Provider value={{ user, tenant, accessToken, isLoading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const context = React.useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
