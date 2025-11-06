import { useEffect, useState, useRef } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { supabase } from '../../lib/supabase/client';
import { resendConfirmation } from '../../lib/supabase/auth';
import { getAndClearRedirectUrl } from '../../lib/utils/redirects';
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
  const [status, setStatus] = useState<'loading' | 'success' | 'error' | 'expired'>('loading');
  const [message, setMessage] = useState('Processing authentication...');
  const [email, setEmail] = useState<string | null>(null);
  const [emailInput, setEmailInput] = useState('');
  const [resending, setResending] = useState(false);
  const isHandledRef = useRef(false);

  useEffect(() => {
    // Reset handled flag when component mounts or dependencies change
    isHandledRef.current = false;
    
    let authStateSubscription: { unsubscribe: () => void } | null = null;
    let pollTimeout: NodeJS.Timeout | null = null;
    let finalTimeout: NodeJS.Timeout | null = null;
    let maxRetries = 8; // Poll for up to 8 seconds (reasonable timeout)
    let retryCount = 0;
    
    const handleAuthCallback = async () => {

      try {
        // Check for hash fragment (OAuth/PKCE flow)
        const hash = window.location.hash;
        const hashParams = hash ? new URLSearchParams(hash.substring(1)) : null;
        
        // Check for query parameters (email verification flow)
        const queryParams = new URLSearchParams(window.location.search);
        
        // Store error info for later, but don't act on it immediately
        // Supabase might include error params even when verification succeeds
        // We'll check for errors only AFTER attempting to get a session
        const error = hashParams?.get('error') || queryParams.get('error');
        const errorDescription = hashParams?.get('error_description') || queryParams.get('error_description');
        const errorCode = hashParams?.get('error_code') || queryParams.get('error_code');
        
        console.log('Callback: Starting auth callback processing');
        console.log('Callback: URL hash:', hash ? 'present' : 'none');
        console.log('Callback: URL query:', window.location.search);
        console.log('Callback: Error params found:', { error, errorCode, errorDescription });
        
        // Handle hash fragment with tokens FIRST (OAuth/PKCE) - highest priority
        // Even if there are error params, check for tokens first - Supabase sometimes includes both
        if (hashParams) {
          const accessToken = hashParams.get('access_token');
          const refreshToken = hashParams.get('refresh_token');
          
          // Prioritize tokens - if they exist, use them regardless of error params
          if (accessToken && refreshToken) {
            console.log('Callback: Found tokens in hash, attempting to set session...');
            const { data, error: sessionError } = await supabase.auth.setSession({
              access_token: accessToken,
              refresh_token: refreshToken
            });

            if (sessionError) {
              console.error('Callback: Error setting session from tokens:', sessionError);
              // Don't throw yet - continue to try other methods
            } else if (data.session) {
              isHandledRef.current = true;
              setStatus('success');
              setMessage('Authentication successful! Redirecting...');
              const email = data.session.user?.email ?? '';
              console.log('Callback: Session set successfully from hash tokens, email:', email);
              if (finalTimeout) clearTimeout(finalTimeout);
              setTimeout(() => {
                navigate(`/auth/success?status=confirmed&email=${encodeURIComponent(email)}`, { replace: true });
              }, 1200);
              return;
            }
          }
        }
        
        // Try immediate session check (might be already set)
        const immediateCheck = await supabase.auth.getSession();
        if (immediateCheck.data.session) {
          isHandledRef.current = true;
          setStatus('success');
          setMessage('Email verification successful! Redirecting...');
          const email = immediateCheck.data.session.user?.email ?? '';
          console.log('Callback: Session found immediately, email:', email);
          if (finalTimeout) clearTimeout(finalTimeout);
          setTimeout(() => {
            navigate(`/auth/success?status=confirmed&email=${encodeURIComponent(email)}`, { replace: true });
          }, 1200);
          return;
        }

        // Set up auth state change listener for real-time session detection
        authStateSubscription = supabase.auth.onAuthStateChange((event, session) => {
          if (isHandledRef.current) return;
          
          console.log('Callback: Auth state changed:', event, 'Session:', !!session);
          
          if (event === 'SIGNED_IN' && session) {
            isHandledRef.current = true;
            setStatus('success');
            setMessage('Email verification successful! Redirecting...');
            const email = session.user?.email ?? '';
            console.log('Callback: Session detected via auth state change, email:', email);
            
            // Clean up listeners
            if (authStateSubscription) authStateSubscription.unsubscribe();
            if (pollTimeout) clearTimeout(pollTimeout);
            if (finalTimeout) clearTimeout(finalTimeout);
            
            setTimeout(() => {
              navigate(`/auth/success?status=confirmed&email=${encodeURIComponent(email)}`, { replace: true });
            }, 1200);
          }
        });

        // Poll for session (fallback for email verification that might take a moment)
        const pollForSession = async (): Promise<void> => {
          if (isHandledRef.current) return;
          
          retryCount++;
          console.log(`Callback: Polling for session (attempt ${retryCount}/${maxRetries})...`);
          
          try {
            const { data, error: sessionError } = await supabase.auth.getSession();
            
            if (sessionError) {
              console.error('Callback: Session error:', sessionError);
              // Continue polling even with errors (might be transient) unless we've exhausted retries
              if (retryCount >= maxRetries) {
                // Final attempt failed - handle error
                isHandledRef.current = true;
                
                // Clean up listeners
                if (authStateSubscription) authStateSubscription.unsubscribe();
                if (pollTimeout) clearTimeout(pollTimeout);
                
                // Check for expired link error
                const isExpiredLink = error === 'access_denied' || 
                                     errorCode === 'otp_expired' ||
                                     errorDescription?.toLowerCase().includes('expired') ||
                                     errorDescription?.toLowerCase().includes('invalid');
                
                if (isExpiredLink) {
                  const emailParam = searchParams.get('email') || queryParams.get('email') || window.location.search.match(/email=([^&]+)/)?.[1];
                  setStatus('expired');
                  setMessage('This verification link has expired or is invalid.');
                  if (emailParam) {
                    setEmail(decodeURIComponent(emailParam));
                  }
                  return;
                }
                
                setStatus('error');
                setMessage(`Authentication failed: ${sessionError.message || errorDescription || error || 'Unknown error'}`);
                setTimeout(() => {
                  navigate('/', { 
                    replace: true,
                    state: { 
                      openAuthDialog: true, 
                      authMode: 'signin', 
                      error: sessionError.message || errorDescription || error 
                    }
                  });
                }, 3000);
                return;
              }
            } else if (data.session) {
              isHandledRef.current = true;
              setStatus('success');
              setMessage('Email verification successful! Redirecting...');
              const email = data.session.user?.email ?? '';
              console.log('Callback: Session found via polling, email:', email);
              
              // Clean up listeners
              if (authStateSubscription) authStateSubscription.unsubscribe();
              if (pollTimeout) clearTimeout(pollTimeout);
              if (finalTimeout) clearTimeout(finalTimeout);
              
              setTimeout(() => {
                navigate(`/auth/success?status=confirmed&email=${encodeURIComponent(email)}`, { replace: true });
              }, 1200);
              return;
            }
            
            // Continue polling if not found and haven't exceeded retries
            if (retryCount < maxRetries && !isHandledRef.current) {
              pollTimeout = setTimeout(pollForSession, 1000);
            } else if (retryCount >= maxRetries && !isHandledRef.current) {
              // No session found after max retries - NOW check for errors
              console.warn('Callback: No session found after polling, checking for errors');
              isHandledRef.current = true;
              
              // Clean up listeners
              if (authStateSubscription) authStateSubscription.unsubscribe();
              if (pollTimeout) clearTimeout(pollTimeout);
              
              // Only show expired error if we actually have error params AND no session
              const isExpiredLink = error === 'access_denied' || 
                                   errorCode === 'otp_expired' ||
                                   errorDescription?.toLowerCase().includes('expired') ||
                                   errorDescription?.toLowerCase().includes('invalid');
              
              if (isExpiredLink) {
                const emailParam = searchParams.get('email') || queryParams.get('email') || window.location.search.match(/email=([^&]+)/)?.[1];
                setStatus('expired');
                setMessage('This verification link has expired or is invalid.');
                if (emailParam) {
                  setEmail(decodeURIComponent(emailParam));
                }
                // Don't auto-redirect, let user choose to resend
                return;
              }
              
              // Generic error handling
              if (error) {
                setStatus('error');
                setMessage(`Authentication failed: ${errorDescription || error}`);
                setTimeout(() => {
                  navigate('/', { 
                    replace: true,
                    state: { 
                      openAuthDialog: true, 
                      authMode: 'signin', 
                      error: errorDescription || error 
                    }
                  });
                }, 3000);
                return;
              }
              
              // No session and no error - just redirect to home
              setStatus('error');
              setMessage('No active authentication session found. Redirecting to home page...');
              setTimeout(() => {
                navigate('/', { replace: true });
              }, 2000);
            }
          } catch (pollError) {
            console.error('Callback: Error in polling:', pollError);
            // If we've exhausted retries, handle the error
            if (retryCount >= maxRetries && !isHandledRef.current) {
              isHandledRef.current = true;
              
              // Clean up listeners
              if (authStateSubscription) authStateSubscription.unsubscribe();
              if (pollTimeout) clearTimeout(pollTimeout);
              
              setStatus('error');
              setMessage(`Authentication failed: ${pollError instanceof Error ? pollError.message : 'Unknown error'}`);
              setTimeout(() => {
                navigate('/', { 
                  replace: true,
                  state: { 
                    openAuthDialog: true, 
                    authMode: 'signin', 
                    error: pollError instanceof Error ? pollError.message : 'Unknown error'
                  }
                });
              }, 3000);
            } else if (retryCount < maxRetries && !isHandledRef.current) {
              // Continue polling on error if we haven't exhausted retries
              pollTimeout = setTimeout(pollForSession, 1000);
            }
          }
        };

        // Start polling after a short delay (give Supabase time to process)
        pollTimeout = setTimeout(pollForSession, 500);
        
        // Final safety timeout - ensures we never load forever
        // If we haven't resolved after 10 seconds, show an error and redirect
        finalTimeout = setTimeout(() => {
          if (!isHandledRef.current) {
            console.warn('Callback: Final timeout reached, forcing resolution');
            isHandledRef.current = true;
            
            // Clean up listeners
            if (authStateSubscription) authStateSubscription.unsubscribe();
            if (pollTimeout) clearTimeout(pollTimeout);
            
            // Last attempt to get session
            supabase.auth.getSession().then(({ data }) => {
              if (data.session) {
                setStatus('success');
                setMessage('Email verification successful! Redirecting...');
                const email = data.session.user?.email ?? '';
                setTimeout(() => {
                  navigate(`/auth/success?status=confirmed&email=${encodeURIComponent(email)}`, { replace: true });
                }, 1200);
              } else {
                // No session - check for errors or redirect
                const isExpiredLink = error === 'access_denied' || 
                                     errorCode === 'otp_expired' ||
                                     errorDescription?.toLowerCase().includes('expired') ||
                                     errorDescription?.toLowerCase().includes('invalid');
                
                if (isExpiredLink) {
                  const emailParam = searchParams.get('email') || queryParams.get('email') || window.location.search.match(/email=([^&]+)/)?.[1];
                  setStatus('expired');
                  setMessage('This verification link has expired or is invalid.');
                  if (emailParam) {
                    setEmail(decodeURIComponent(emailParam));
                  }
                } else {
                  setStatus('error');
                  setMessage('Authentication timed out. Please try again or sign in.');
                  setTimeout(() => {
                    navigate('/', { 
                      replace: true,
                      state: { 
                        openAuthDialog: true, 
                        authMode: 'signin', 
                        error: 'Authentication timed out. Please try again.'
                      }
                    });
                  }, 3000);
                }
              }
            });
          }
        }, 10000); // 10 second absolute timeout
        
      } catch (error) {
        if (isHandledRef.current) return;
        
        console.error('Auth callback error:', error);
        isHandledRef.current = true;
        
        // Clean up listeners
        if (authStateSubscription) authStateSubscription.unsubscribe();
        if (pollTimeout) clearTimeout(pollTimeout);
        
        setStatus('error');
        setMessage(`Authentication failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
        
        setTimeout(() => {
          navigate('/', { 
            replace: true,
            state: { openAuthDialog: true, authMode: 'signin', error: error instanceof Error ? error.message : 'Unknown error' }
          });
        }, 3000);
      }
    };

    // Start the auth callback
    handleAuthCallback();
    
    // Return cleanup function from useEffect
    return () => {
      isHandledRef.current = true; // Mark as handled to prevent further processing
      if (authStateSubscription) {
        authStateSubscription.unsubscribe();
      }
      if (pollTimeout) {
        clearTimeout(pollTimeout);
      }
      if (finalTimeout) {
        clearTimeout(finalTimeout);
      }
    };
  }, [navigate, searchParams]);

  const handleResendVerification = async () => {
    const emailToUse = email || emailInput.trim();
    
    if (!emailToUse) {
      setMessage('Please enter your email address.');
      return;
    }

    setResending(true);
    try {
      await resendConfirmation(emailToUse);
      setMessage(`Verification email sent to ${emailToUse}. Please check your inbox.`);
      setStatus('success');
      setTimeout(() => {
        navigate('/', {
          replace: true,
          state: {
            openAuthDialog: true,
            authMode: 'signin',
            message: 'Verification email sent! Please check your inbox.'
          }
        });
      }, 3000);
    } catch (error) {
      console.error('Error resending verification:', error);
      setMessage(`Failed to resend email: ${error instanceof Error ? error.message : 'Unknown error'}`);
      setStatus('error');
    } finally {
      setResending(false);
    }
  };

  const getStatusIcon = () => {
    switch (status) {
      case 'loading':
        return '⏳';
      case 'success':
        return '✅';
      case 'error':
        return '❌';
      case 'expired':
        return '⏰';
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
      case 'expired':
        return 'text-orange-600';
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
           status === 'success' ? 'Success!' : 
           status === 'expired' ? 'Link Expired' : 'Error'}
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
          {status === 'expired' && (
            <div className="space-y-4">
              <p className="text-gray-600">
                Verification links expire after 24 hours for security reasons. 
                {email ? (
                  <span className="block mt-2">We can resend a new verification email to <strong>{email}</strong>.</span>
                ) : (
                  <span className="block mt-2">Please enter your email address to receive a new verification link.</span>
                )}
              </p>
              
              {!email && (
                <div>
                  <input
                    type="email"
                    placeholder="Enter your email address"
                    value={emailInput}
                    onChange={(e) => setEmailInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && handleResendVerification()}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    disabled={resending}
                  />
                </div>
              )}
              
              <div className="flex gap-3 justify-center">
                <button
                  onClick={handleResendVerification}
                  disabled={resending || (!email && !emailInput.trim())}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {resending ? 'Sending...' : 'Resend Verification Email'}
                </button>
                <button
                  onClick={() => navigate('/', { 
                    replace: true, 
                    state: { openAuthDialog: true, authMode: 'signin' } 
                  })}
                  disabled={resending}
                  className="px-6 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  Go to Sign In
                </button>
              </div>
            </div>
          )}
        </motion.div>
      </motion.div>
    </div>
  );
}