import React, { useState } from 'react';
import { signInWithSocial } from '../../lib/supabase/auth';
import { Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

interface GoogleSignInProps {
  onSuccess?: () => void;
}

export function GoogleSignIn({ onSuccess }: GoogleSignInProps) {
  const [isLoading, setIsLoading] = useState(false);

  const handleGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      const { url } = await signInWithSocial('google');
      window.location.href = url;
    } catch (error) {
      console.error('Google sign in error:', error);
      toast.error(error instanceof Error ? error.message : 'Failed to sign in with Google');
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading}
        className="w-full inline-flex justify-center items-center py-3 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isLoading ? (
          <>
            <Loader2 className="animate-spin h-5 w-5 mr-2" />
            Signing in with Google...
          </>
        ) : (
          <>
            <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
              <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                <path
                  fill="#4285F4"
                  d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -9.284 53.749 C -9.524 55.229 -10.254 56.479 -11.334 57.329 L -11.334 60.329 L -7.754 60.329 C -5.564 58.239 -3.264 55.159 -3.264 51.509 Z"
                />
                <path
                  fill="#34A853"
                  d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -11.334 57.329 C -12.324 58.049 -13.564 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.164 53.529 L -25.164 56.619 C -23.154 60.539 -19.234 63.239 -14.754 63.239 Z"
                />
                <path
                  fill="#FBBC05"
                  d="M -6.824 60.329 C -6.534 59.549 -6.344 58.719 -6.344 57.859 C -6.344 56.989 -6.534 56.159 -6.824 55.379 L -6.824 52.289 L -21.484 52.289 C -21.734 53.159 -21.884 54.079 -21.884 55.029 C -21.884 55.979 -21.734 56.899 -21.484 57.769 L -21.484 60.329 L -6.824 60.329 Z"
                />
                <path
                  fill="#EA4335"
                  d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.234 39.239 -23.154 42.139 -25.164 46.619 L -21.484 49.609 C -20.534 47.759 -17.884 46.489 -14.754 46.489 C -13.564 46.489 -12.324 46.929 -11.334 47.649 L -6.824 44.649 C -8.804 42.719 -11.514 41.529 -14.754 41.529 Z"
                />
              </g>
            </svg>
            Continue with Google
          </>
        )}
      </button>

      <div className="text-center">
        <p className="text-sm text-gray-600 dark:text-gray-400">
          By signing in with Google, you agree to our{' '}
          <a href="/terms" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Terms of Service
          </a>{' '}
          and{' '}
          <a href="/privacy" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
            Privacy Policy
          </a>
        </p>
      </div>
    </div>
  );
}

