import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface AuthUser { id: string; name: string; email: string; role: 'customer' | 'admin'; }
interface AuthContextType { user: AuthUser | null; token: string | null; login: (token: string, user: AuthUser) => void; logout: () => void; }
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try { const saved = localStorage.getItem('accessstore_user'); return saved ? JSON.parse(saved) : null; } catch { return null; }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('accessstore_token'));

  useEffect(() => {
    if (user) localStorage.setItem('accessstore_user', JSON.stringify(user));
    else localStorage.removeItem('accessstore_user');
  }, [user]);

  const login = (nextToken: string, nextUser: AuthUser) => {
    localStorage.setItem('accessstore_token', nextToken);
    setToken(nextToken);
    setUser(nextUser);
  };
  const logout = () => {
    localStorage.removeItem('accessstore_token');
    setToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ user, token, login, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error('useAuth must be used within AuthProvider'); return ctx; }
