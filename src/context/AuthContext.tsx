import { createContext, useContext, useEffect, useState, ReactNode } from 'react';

export interface AuthUser { id: string; name: string; phone: string; }
interface AuthContextType { user: AuthUser | null; login: (user: AuthUser) => void; logout: () => void; }
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<AuthUser | null>(() => {
    try { const saved = localStorage.getItem('accessstore_user'); return saved ? JSON.parse(saved) : null; } catch { return null; }
  });
  useEffect(() => { if (user) localStorage.setItem('accessstore_user', JSON.stringify(user)); else localStorage.removeItem('accessstore_user'); }, [user]);
  const login = (next: AuthUser) => setUser(next);
  const logout = () => setUser(null);
  return <AuthContext.Provider value={{ user, login, logout }}>{children}</AuthContext.Provider>;
}
export function useAuth() { const ctx = useContext(AuthContext); if (!ctx) throw new Error('useAuth must be used within AuthProvider'); return ctx; }
