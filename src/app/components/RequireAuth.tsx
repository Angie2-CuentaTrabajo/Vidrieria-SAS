import { useEffect, useState } from 'react';
import { Navigate, Outlet } from 'react-router';
import { clearAuthSession, getAuthSession } from '../lib/auth';
import { getMe } from '../lib/auth-api';

export default function RequireAuth() {
  const [status, setStatus] = useState<'loading' | 'authenticated' | 'unauthenticated'>('loading');

  useEffect(() => {
    const session = getAuthSession();

    if (!session) {
      setStatus('unauthenticated');
      return;
    }

    const validate = async () => {
      try {
        await getMe();
        setStatus('authenticated');
      } catch {
        clearAuthSession();
        setStatus('unauthenticated');
      }
    };

    void validate();
  }, []);

  if (status === 'loading') {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="rounded-xl border bg-white px-6 py-10 text-sm text-gray-500 shadow-sm">
          Validando sesión...
        </div>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
}
