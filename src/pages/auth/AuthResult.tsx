import React, { useEffect, useMemo, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase/client';
import { getRedirectPathForEmail } from '../../lib/auth/redirects';
import { getAndClearRedirectUrl } from '../../lib/utils/redirects';

type StatusKind = 'confirmed' | 'password_reset' | 'magic_link' | 'authenticated';

export default function AuthResult() {
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [countdown, setCountdown] = useState(3);

  const status: StatusKind = (params.get('status') as StatusKind) || 'authenticated';
  const emailFromParam = params.get('email') || undefined;

  const title = useMemo(() => {
    switch (status) {
      case 'confirmed':
        return 'Email confirmed';
      case 'password_reset':
        return 'Password updated';
      case 'magic_link':
        return 'Signed in with magic link';
      default:
        return 'Authentication success';
    }
  }, [status]);

  const subtitle = useMemo(() => {
    switch (status) {
      case 'confirmed':
        return 'Your email has been verified successfully. You can now access all features of your account.';
      case 'password_reset':
        return 'Your password has been changed successfully.';
      case 'magic_link':
        return 'You are now signed in securely.';
      default:
        return 'You are now signed in.';
    }
  }, [status]);

  useEffect(() => {
    let timer: number | undefined;
    const start = async () => {
      const { data } = await supabase.auth.getSession();
      const email = emailFromParam || data.session?.user?.email || null;
      
      // For email confirmation, show the success message first
      if (status === 'confirmed') {
        // Show confirmation message for 5 seconds before redirecting
        timer = window.setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
        const to = window.setTimeout(() => {
          // Check if there's a stored redirect URL from before auth
          const storedRedirectUrl = getAndClearRedirectUrl();
          const path = storedRedirectUrl || getRedirectPathForEmail(email || undefined);
          navigate(path, { replace: true });
        }, 5000); // Increased to 5 seconds for email confirmation

        return () => {
          if (timer) window.clearInterval(timer);
          window.clearTimeout(to);
        };
      } else {
        // For other auth types (password reset, magic link), use shorter delay
        const storedRedirectUrl = getAndClearRedirectUrl();
        const path = storedRedirectUrl || getRedirectPathForEmail(email || undefined);

        timer = window.setInterval(() => setCountdown((c) => Math.max(0, c - 1)), 1000);
        const to = window.setTimeout(() => {
          navigate(path, { replace: true });
        }, 3000);

        return () => {
          if (timer) window.clearInterval(timer);
          window.clearTimeout(to);
        };
      }
    };

    const cleanup = start();
    return () => {
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
      cleanup.then((fn) => typeof fn === 'function' && fn());
    };
  }, [navigate, emailFromParam, status]);

  const handleManualRedirect = async () => {
    const { data } = await supabase.auth.getSession();
    const email = emailFromParam || data.session?.user?.email || null;
    const storedRedirectUrl = getAndClearRedirectUrl();
    const path = storedRedirectUrl || getRedirectPathForEmail(email || undefined);
    navigate(path, { replace: true });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-gray-900 dark:via-gray-900 dark:to-gray-900">
      <div className="w-full max-w-md bg-white dark:bg-gray-800 rounded-xl shadow-lg p-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h1 className="text-2xl font-semibold text-gray-900 dark:text-white mb-2">{title}</h1>
        <p className="text-gray-600 dark:text-gray-300 mb-6">{subtitle}</p>
        
        {status === 'confirmed' && (
          <div className="mb-6 p-4 bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg">
            <p className="text-sm text-green-700 dark:text-green-300">
              🎉 Welcome to FolioTech Institute! Your account is now fully activated.
            </p>
          </div>
        )}
        
        <div className="space-y-3">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            {status === 'confirmed' ? 'Redirecting to your dashboard in' : 'Redirecting in'} {countdown}…
          </p>
          
          <button
            onClick={handleManualRedirect}
            className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-blue-600 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/20 dark:text-blue-400 dark:hover:bg-blue-900/30 transition-colors"
          >
            Continue Now
          </button>
        </div>
      </div>
    </div>
  );
}


