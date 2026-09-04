import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const { login } = useAuth();
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [otp, setOtp] = useState('');
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');
  const next = (location.state as { from?: string } | null)?.from || '/store';

  const sendOtp = () => {
    if (!/^[6-9]\d{9}$/.test(phone)) { setError('Enter a valid 10-digit Indian mobile number.'); return; }
    setError(''); setSent(true);
  };
  const verify = () => {
    if (!name.trim()) { setError('Enter your name.'); return; }
    if (!/^\d{6}$/.test(otp)) { setError('Enter the 6-digit OTP.'); return; }
    // OTP provider verification will replace this demo verification before production.
    login({ id: phone, name: name.trim(), phone });
    navigate(next, { replace: true });
  };
  return <main className="min-h-[70vh] flex items-center justify-center px-4 py-16 bg-slate-50">
    <div className="w-full max-w-md rounded-3xl bg-white border border-slate-200 shadow-sm p-7">
      <div className="w-12 h-12 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mb-5"><ShieldCheck className="w-6 h-6" /></div>
      <h1 className="text-2xl font-bold text-slate-950">Sign in to AccessStore</h1>
      <p className="text-sm text-slate-500 mt-2">Login is required before purchasing products.</p>
      <div className="space-y-4 mt-7">
        <input value={name} onChange={e=>setName(e.target.value)} placeholder="Full name" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" />
        <input value={phone} onChange={e=>setPhone(e.target.value.replace(/\D/g,'').slice(0,10))} placeholder="Mobile number" inputMode="numeric" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500" />
        {!sent ? <button onClick={sendOtp} className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold">Send OTP</button> : <>
          <input value={otp} onChange={e=>setOtp(e.target.value.replace(/\D/g,'').slice(0,6))} placeholder="6-digit OTP" inputMode="numeric" className="w-full rounded-xl border border-slate-200 px-4 py-3 outline-none focus:border-blue-500 tracking-[0.35em]" />
          <button onClick={verify} className="w-full rounded-xl bg-blue-600 text-white py-3 font-semibold">Verify & Continue</button>
        </>}
        {error && <p className="text-sm text-red-600">{error}</p>}
        <button onClick={()=>navigate('/')} className="w-full text-sm text-slate-500 hover:text-slate-900">Continue browsing</button>
      </div>
    </div>
  </main>;
}
