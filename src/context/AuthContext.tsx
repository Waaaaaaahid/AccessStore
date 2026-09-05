import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { API } from '@/lib/api';

export interface AuthUser { id:string; name:string; email:string; role:'customer'|'admin'; }
interface AuthContextType { user:AuthUser|null; token:string|null; loading:boolean; login:(token:string,user:AuthUser)=>void; logout:()=>void; }
const AuthContext=createContext<AuthContextType|undefined>(undefined);

export function AuthProvider({children}:{children:ReactNode}){
 const [user,setUser]=useState<AuthUser|null>(()=>{try{const x=localStorage.getItem('accessstore_user');return x?JSON.parse(x):null}catch{return null}});
 const [token,setToken]=useState<string|null>(()=>localStorage.getItem('accessstore_token'));
 const [loading,setLoading]=useState<boolean>(()=>Boolean(localStorage.getItem('accessstore_token')));
 useEffect(()=>{
  const savedToken=localStorage.getItem('accessstore_token');
  if(!savedToken){setLoading(false);return;}
  let cancelled=false;
  fetch(`${API}/api/auth/me`,{headers:{Authorization:`Bearer ${savedToken}`}})
   .then(async r=>{if(!r.ok)throw new Error();const d=await r.json();if(cancelled)return;if(d.user?.role!=='customer'&&d.user?.role!=='admin')throw new Error();setToken(savedToken);setUser(d.user);localStorage.setItem('accessstore_user',JSON.stringify(d.user));})
   .catch(()=>{if(cancelled)return;localStorage.removeItem('accessstore_token');localStorage.removeItem('accessstore_user');setToken(null);setUser(null);})
   .finally(()=>{if(!cancelled)setLoading(false)});
  return()=>{cancelled=true};
 },[]);
 const login=(t:string,u:AuthUser)=>{if(!t||!u?.id||!u?.email||!u?.role)throw new Error('Invalid authentication response');localStorage.setItem('accessstore_token',t);localStorage.setItem('accessstore_user',JSON.stringify(u));setToken(t);setUser(u);setLoading(false)};
 const logout=()=>{localStorage.removeItem('accessstore_token');localStorage.removeItem('accessstore_user');setToken(null);setUser(null);setLoading(false)};
 return <AuthContext.Provider value={{user,token,loading,login,logout}}>{children}</AuthContext.Provider>;
}
export function useAuth(){const ctx=useContext(AuthContext);if(!ctx)throw new Error('useAuth must be used within AuthProvider');return ctx;}
