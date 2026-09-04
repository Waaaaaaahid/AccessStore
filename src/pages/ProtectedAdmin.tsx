import { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';
import Admin from './Admin';

export default function ProtectedAdmin() {
  const { user, token } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!token || !user) navigate('/admin-login', { replace: true, state: { from: location.pathname } });
    else if (user.role !== 'admin') navigate('/admin-login', { replace: true });
  }, [token, user, navigate, location.pathname]);

  if (!token || !user || user.role !== 'admin') return <div className="min-h-[70vh] flex items-center justify-center text-slate-500">Checking admin access…</div>;
  return <Admin />;
}
