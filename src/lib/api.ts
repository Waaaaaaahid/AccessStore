const API = 'https://accessstore-api.onrender.com';
export { API };

export async function api<T=any>(path:string, options:RequestInit={}) : Promise<T> {
  const token = localStorage.getItem('accessstore_token');
  const headers = new Headers(options.headers || {});
  if (options.body && !headers.has('Content-Type')) headers.set('Content-Type','application/json');
  if(token) headers.set('Authorization',`Bearer ${token}`);
  const res = await fetch(`${API}${path}`,{...options,headers});
  const data = await res.json().catch(()=>({}));
  if(!res.ok) throw new Error(data.error || data.message || `Request failed (${res.status})`);
  return data;
}
