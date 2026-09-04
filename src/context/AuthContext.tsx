import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { API } from '@/lib/api';
export interface AuthUser { id:string; name:string; email:string; role:'customer'|'admin'; }
interface AuthContextType { user:AuthUser|null; token:string|null; login:(token:string,user:AuthUser)=>void; logout:()=>void; }
const AuthContext=createContext<AuthContextType|undefined>(undefined);
export function AuthProvider({children}:{children:ReactNode}){
 const [user,setUser]=useState<AuthUser|null>(()=>{try{const x=localStorage.getItem('accessstore_user');return x?JSON.parse(x):null}catch{return null}});
 const [token,setToken]=useState<string|null>(()=>localStorage.getItem('accessstore_token'));
 useEffect(()=>{ if(!token){setUser(null);return;} fetch(`${API}/api/auth/me`,{headers:{Authorization:`Bearer ${token}`}}).then(async r=>{if(!r.ok)throw new Error();const d=await r.json();setUser(d.user);localStorage.setItem('accessstore_user',JSON.stringify(d.user));}).catch(()=>{localStorage.removeItem('accessstore_token');localStorage.removeItem('accessstore_user');setToken(null);setUser(null);}); },[]);
 const login=(t:string,u:AuthUser)=>{localStorage.setItem('accessstore_token',t);localStorage.setItem('accessstore_user',JSON.stringify(u));setToken(t);setUser(u)};
 const logout=()=>{localStorage.removeItem('accessstore_token');localStorage.removeItem('accessstore_user');setToken(null);setUser(null)};
 return <AuthContext.Provider value={{user,token,login,logout}}>{children}</AuthContext.Provider>;
}
export function useAuth(){const ctx=useContext(AuthContext);if(!ctx)throw new Error('useAuth must be used within AuthProvider');return ctx;}
