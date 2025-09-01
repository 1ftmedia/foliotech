import React, { useEffect, useState } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase/client';
import { LoadingSpinner } from '../../components/LoadingSpinner';
import { motion } from 'framer-motion';

/**
 * Auth Callback Component
 * 
 * This component handles the authentication callback from Supabase.
 * It processes the authentication response and redirects the user appropriately.
 */
export default function AuthCallback() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const [message, setMessage] = useState('Processing authentication...');

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        // Get the hash fragment from the URL
        const hash = window.location.hash;
        
        if (hash) {
          // Parse the hash to extract auth parameters
          const params = new URLSearchParams(hash.substring(1));
          const accessToken = params.get('access_token');
          const refreshToken = params.get('refresh_token');
          const error = params.get('error');
          const errorDescription = params.get('error_description');

          if (error) {
            console.error('Authentication error:', error, errorDescription);
            setStatus('error');
            setMessage(`Authentication failed: ${errorDescription || error}`);
            
            // Redirect to login page after 3 seconds
            setTimeout(() => {
              navigate('/auth/signin', { 
                replace: true,
                state: { error: errorDescription || error }
              });
            }, 3000);
            return;
          }

          if (accessToken && refreshToken) {
            // Set the session manually if needed
            const { data, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });

            if (sessionError) {
              throw sessionError;
            }

            if (data.session) {
              setStatus('success');
              setMessage('Authentication successful! Redirecting...');
              
              // Redirect to dashboard or intended page
              setTimeout(() => {
                navigate('/dashboard', { replace: true });
              }, 1500);
            } else {
              throw new Error('No session data received');
            }
          } else {
            // Handle the callback using Supabase's built-in method
            const { data, error: callbackError } = await supabase.auth.getSession();
            
            if (callbackError) {
              throw callbackError;
            }

            if (data.session) {
              setStatus('success');
              setMessage('Authentication successful! Redirecting...');
              
              // Redirect to dashboard or intended page
              setTimeout(() => {
                navigate('/dashboard', { replace: true });
              }, 1500);
            } else {
              throw new Error('No session data received');
            }
          }
        } else {
          // No hash fragment, try to get the current session
          const { data, error } = await supabase.auth.getSession();
          
          if (error) {
            throw error;
          }

          if (data.session) {
            setStatus('success');
            setMessage('Already authenticated! Redirecting...');
            
            setTimeout(() => {
              navigate('/dashboard', { replace: true });
            }, 1500);
          } else {
            throw new Error('No authentication data found');
          }
        }
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');
        setMessage(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        // Redirect to login page after 3 seconds
        setTimeout(() => {
          navigate('/auth/signin', { 
            replace: true,
            state: { error: error instanceof Error ? error.message : 'Unknown error' }
          });
        }, 3000);
      }
    };

    handleAuthCallback();
  }, [navigate]);

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return '⏳';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      default:
        return '⏳';
    }
  };

  const getStatusColor = () => {
    switch (status) {
      case 'loading':
        return 'text-blue-600';
      case 'success':
        return 'text-green-600';
      case 'error':
        return 'text-red-600';
      default:
        return 'text-blue-600';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 flex items-center justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center"
      >
        {/* Status Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-6xl mb-6"
        >
          {getStatusIcon()}
        </motion.div>

        {/* Status Message */}
        <motion.h1
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className={`text-2xl font-bold mb-4 ${getStatusColor()}`}
        >
          {status === 'loading' ? 'Processing...' : 
           status === 'success' ? 'Success!' : 'Error'}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-gray-600 mb-6"
        >
          {message}
        </motion.p>

        {/* Loading Spinner */}
        {status === 'loading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.5 }}
            className="flex justify-center"
          >
            <LoadingSpinner size="lg" />
          </motion.div>
        )}

        {/* Progress Bar */}
        {status === 'loading' && (
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: '100%' }}
            transition={{ duration: 2, ease: 'easeInOut' }}
            className="w-full bg-gray-200 rounded-full h-2 mb-4"
          >
            <div className="bg-blue-600 h-2 rounded-full transition-all duration-300"></div>
          </motion.div>
        )}

        {/* Additional Info */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="text-sm text-gray-500"
        >
          {status === 'loading' && (
            <p>Please wait while we complete your authentication...</p>
          )}
          {status === 'success' && (
            <p>You will be redirected to your dashboard shortly.</p>
          )}
          {status === 'error' && (
            <p>You will be redirected to the login page.</p>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}