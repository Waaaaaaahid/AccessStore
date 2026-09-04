import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ShieldCheck, Eye, EyeOff } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

const API = (import.meta.env.VITE_API_URL || '').replace(/\/$/, '');

export default function AdminLogin() {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault(); setError(''); setLoading(true);
    try {
      const r = await fetch(`${API}/api/auth/admin-login`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ email, password }) });
      const data = await r.json().catch(() => ({}));
      if (!r.ok) throw new Error(data.error || 'Invalid admin login details');
      if (data.user?.role !== 'admin') throw new Error('Admin access denied');
      login(data.token, data.user); navigate('/admin', { replace: true });
    } catch (e) { setError(e instanceof Error ? e.message : 'Unable to sign in'); }
    finally { setLoading(false); }
  };

  return <main className="min-h-[75vh] flex items-center justify-center px-4 py-16 bg-slate-50">
    <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-sm p-7">
      <div className="w-12 h-12 rounded-2xl bg-slate-900 text-white flex items-center justify-center mb-5"><ShieldCheck className="w-6 h-6" /></div>
      <h1 className="text-2xl font-bold text-slate-950">Admin Sign in</h1>
      <p className="text-sm text-slate-500 mt-2">Private access for the AccessStore administrator.</p>
      <form onSubmit={submit} className="space-y-4 mt-7">
        <input required value={email} onChange={e => setEmail(e.target.value)} placeholder="Admin ID / Email" autoComplete="username" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-slate-700" />
        <div className="relative"><input required value={password} onChange={e => setPassword(e.target.value)} type={show ? 'text' : 'password'} placeholder="Admin password" autoComplete="current-password" className="w-full rounded-xl border border-slate-200 px-4 py-3 pr-12 outline-none focus:border-slate-700" /><button type="button" onClick={() => setShow(v => !v)} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400">{show ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}</button></div>
        <button disabled={loading} className="w-full rounded-xl bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white py-3 font-semibold">{loading ? 'Signing in…' : 'Admin Sign in'}</button>
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button type="button" onClick={() => navigate('/login')} className="w-full text-sm text-slate-500 hover:text-slate-900">Back to customer login</button>
      </form>
    </div>
  </main>;
}
