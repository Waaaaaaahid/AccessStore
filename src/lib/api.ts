const API = (import.meta.env.VITE_API_URL || 'https://accessstore-api.onrender.com').replace(/\/$/, '');
export { API };
export async function api<T=any>(path:string, options:RequestInit={}) : Promise<T> {
  const token = localStorage.getItem('accessstore_token');
  const headers = new Headers(options.headers || {});
  if(!headers.has('Content-Type')) headers.set('Content-Type','application/json');
  if(token) headers.set('Authorization',`Bearer ${token}`);
  const res = await fetch(`${API}${path}`,{...options,headers});
  const data = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(data.error || data.message || `Request failed (${res.status})`);
  return data;
}
