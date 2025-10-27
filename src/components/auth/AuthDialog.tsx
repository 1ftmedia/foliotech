import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Mail, Lock, Eye, EyeOff, AlertCircle, Loader2, User, CheckSquare } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'react-hot-toast';
import { Provider } from '@supabase/supabase-js';
import { signUp, signIn, signInWithSocial, resetPassword, resendConfirmation } from '../../lib/supabase/auth';
import { storeRedirectUrl } from '../../lib/utils/redirects';

// Validation schemas
const emailSchema = z.string().email('Invalid email address');
const passwordSchema = z.string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

const signInSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  rememberMe: z.boolean().optional()
});

const signUpSchema = z.object({
  email: emailSchema,
  password: passwordSchema,
  fullName: z.string().min(2, 'Full name must be at least 2 characters').optional(),
  confirmPassword: z.string(),
  rememberMe: z.boolean().optional()
}).refine(data => data.password === data.confirmPassword, {
  message: "Passwords don't match",
  path: ["confirmPassword"]
});

const resetSchema = z.object({
  email: emailSchema
});

type SignInFormData = z.infer<typeof signInSchema>;
type SignUpFormData = z.infer<typeof signUpSchema>;
type ResetFormData = z.infer<typeof resetSchema>;

type AuthMode = 'signin' | 'signup' | 'reset';

interface AuthDialogProps {
  isOpen: boolean;
  onClose: () => void;
  defaultMode?: AuthMode;
  nonDismissible?: boolean;
}

export function AuthDialog({ isOpen, onClose, defaultMode = 'signin', nonDismissible = false }: AuthDialogProps) {
  const [mode, setMode] = useState<AuthMode>(defaultMode);
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [resetEmailSent, setResetEmailSent] = useState(false);
  const [needsConfirmation, setNeedsConfirmation] = useState(false);
  const [unconfirmedEmail, setUnconfirmedEmail] = useState<string>('');
  const [signInSuccess, setSignInSuccess] = useState(false);
  const [userName, setUserName] = useState<string>('');
  const dialogRef = useRef<HTMLDivElement>(null);
  const initialFocusRef = useRef<HTMLInputElement>(null);

  // Store redirect URL when dialog opens
  useEffect(() => {
    if (isOpen) {
      storeRedirectUrl();
    }
  }, [isOpen]);

  const signInForm = useForm<SignInFormData>({
    resolver: zodResolver(signInSchema),
    defaultValues: { email: '', password: '', rememberMe: true }
  });

  const signUpForm = useForm<SignUpFormData>({
    resolver: zodResolver(signUpSchema),
    defaultValues: { email: '', password: '', confirmPassword: '', fullName: '', rememberMe: true }
  });

  const resetForm = useForm<ResetFormData>({
    resolver: zodResolver(resetSchema),
    defaultValues: { email: '' }
  });

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => {
        initialFocusRef.current?.focus();
      }, 100);
    }
  }, [isOpen, mode]);

  useEffect(() => {
    if (isOpen) {
      setMode(defaultMode);
      setError(null);
      setResetEmailSent(false);
      setSignInSuccess(false);
      signInForm.reset();
      signUpForm.reset();
      resetForm.reset();
    }
  }, [isOpen, defaultMode, signInForm, signUpForm, resetForm]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isOpen && !nonDismissible) {
        onClose();
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, nonDismissible]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dialogRef.current && !dialogRef.current.contains(e.target as Node) && !nonDismissible) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen, onClose, nonDismissible]);

  const handleSignIn = async (data: SignInFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      setNeedsConfirmation(false);
      
      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      
      const { user } = await signIn(data.email, data.password);
      
      // Extract user's first name from full_name or email
      let firstName = '';
      if (user?.user_metadata?.full_name) {
        firstName = user.user_metadata.full_name.split(' ')[0];
      } else if (user?.email) {
        firstName = user.email.split('@')[0];
      }
      
      setUserName(firstName);
      setSignInSuccess(true);
      
      // Show success message and close dialog
      toast.success('Successfully signed in!');
      
      // Close the dialog after a short delay to show success message
      setTimeout(() => {
        onClose();
      }, 1000);
      
    } catch (err) {
      console.error('Sign in error:', err);
      if (err instanceof Error) {
        if (err.message.includes('Please check your email to verify')) {
          setNeedsConfirmation(true);
          setUnconfirmedEmail(data.email);
        }
        setError(err.message);
      } else {
        setError('Failed to sign in');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (data: SignUpFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      
      if (data.rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }
      
      await signUp(data.email, data.password, data.fullName || undefined);
      
      // Show success message with better UX
      toast.success('Account created successfully! Please check your email to verify your account.', {
        duration: 8000,
        icon: '📧',
        style: {
          background: '#10B981',
          color: '#fff',
        },
      });
      
      // Close modal after a brief delay to show the success message
      setTimeout(() => {
        onClose();
      }, 1500);
      
    } catch (err) {
      console.error('Sign up error:', err);
      setError(err instanceof Error ? err.message : 'Failed to create account');
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordReset = async (data: ResetFormData) => {
    try {
      setIsLoading(true);
      setError(null);
      await resetPassword(data.email);
      setResetEmailSent(true);
    } catch (err) {
      console.error('Password reset error:', err);
      setError(err instanceof Error ? err.message : 'Failed to send reset email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialSignIn = async (provider: Provider) => {
    try {
      setIsLoading(true);
      setError(null);
      console.log(`Starting ${provider} OAuth flow...`);
      
      const { url } = await signInWithSocial(provider);
      
      console.log(`Redirecting to ${provider} OAuth URL:`, url);
      window.location.href = url;
    } catch (err) {
      console.error(`${provider} sign in error:`, err);
      
      let errorMessage = `Failed to sign in with ${provider}`;
      if (err instanceof Error) {
        const errorMsg = err.message.toLowerCase();
        
        if (errorMsg.includes('not properly configured') || errorMsg.includes('invalid_client')) {
          errorMessage = 'Google OAuth is not configured. Please check your Supabase settings.';
        } else if (errorMsg.includes('consent screen') || errorMsg.includes('access_denied')) {
          errorMessage = 'Google OAuth consent screen needs to be configured.';
        } else if (errorMsg.includes('rate limit') || errorMsg.includes('quota_exceeded')) {
          errorMessage = 'Too many attempts. Please try again later.';
        } else if (errorMsg.includes('redirect_uri_mismatch')) {
          errorMessage = 'Redirect URI mismatch. Please check your Google Cloud Console settings.';
        } else if (errorMsg.includes('invalid_request') || errorMsg.includes('400')) {
          errorMessage = 'Invalid OAuth request. Please check your configuration.';
        } else if (errorMsg.includes('network') || errorMsg.includes('fetch')) {
          errorMessage = 'Network error. Please check your internet connection.';
        } else {
          errorMessage = `Sign-in failed: ${err.message}`;
        }
      }
      
      setError(errorMessage);
      setIsLoading(false);
    }
  };

  const handleResendConfirmation = async () => {
    try {
      setIsLoading(true);
      setError(null);
      await resendConfirmation(unconfirmedEmail);
      toast.success('Verification email sent! Please check your inbox.');
    } catch (err) {
      console.error('Error resending confirmation:', err);
      setError(err instanceof Error ? err.message : 'Failed to resend confirmation email');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="min-h-screen px-4 text-center flex items-center justify-center">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black/50 backdrop-blur-sm"
              onClick={nonDismissible ? undefined : onClose}
              aria-hidden="true"
            />

            <motion.div
              ref={dialogRef}
              initial={{ opacity: 0, scale: 0.95, y: -20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="inline-block w-full max-w-md overflow-hidden text-left align-middle bg-white dark:bg-gray-800 rounded-2xl shadow-xl relative z-10"
            >
              {!nonDismissible && (
                <button
                  onClick={onClose}
                  className="absolute right-4 top-4 text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 transition-colors"
                  aria-label="Close"
                >
                  <X className="h-6 w-6" />
                </button>
              )}

              <div className="p-6 sm:p-8">
                {signInSuccess ? (
                  <motion.div 
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center py-8"
                  >
                    <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                      <CheckSquare className="h-8 w-8 text-green-600 dark:text-green-400" />
                    </div>
                    <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">
                      Welcome back, {userName} 👋
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Ready to continue your journey?
                    </p>
                  </motion.div>
                ) : (
                  <>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
                      {mode === 'signin' ? 'Welcome Back' : mode === 'signup' ? 'Create Account' : 'Reset Password'}
                    </h2>

                    {error && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mb-4 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-md text-red-700 dark:text-red-400 flex items-start"
                      >
                        <AlertCircle className="h-5 w-5 mr-2 mt-0.5 flex-shrink-0" />
                        <div className="flex-1">
                          <span>{error}</span>
                          {needsConfirmation && (
                            <button
                              onClick={handleResendConfirmation}
                              disabled={isLoading}
                              className="block mt-2 text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
                            >
                              Resend confirmation email
                            </button>
                          )}
                        </div>
                      </motion.div>
                    )}

                    {resetEmailSent ? (
                      <motion.div 
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="text-center py-8"
                      >
                        <div className="mx-auto w-16 h-16 bg-green-100 dark:bg-green-900/30 rounded-full flex items-center justify-center mb-4">
                          <Mail className="h-8 w-8 text-green-600 dark:text-green-400" />
                        </div>
                        <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
                          Check your email
                        </h3>
                        <p className="text-gray-600 dark:text-gray-400 mb-6">
                          We've sent password reset instructions to your email address.
                        </p>
                        <button
                          onClick={() => setMode('signin')}
                          className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium transition-colors"
                        >
                          Back to Sign In
                        </button>
                      </motion.div>
                    ) : (
                      <>
                        <AnimatePresence mode="wait">
                          {mode === 'signin' && (
                            <motion.div
                              key="signin"
                              initial={{ opacity: 0, x: -20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: 20 }}
                              transition={{ duration: 0.2 }}
                            >
                              <form onSubmit={signInForm.handleSubmit(handleSignIn)} className="space-y-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email
                                  </label>
                                  <div className="mt-1 relative">
                                    <input
                                      ref={initialFocusRef}
                                      type="email"
                                      {...signInForm.register('email')}
                                      className="block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                      placeholder="you@example.com"
                                    />
                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                  </div>
                                  {signInForm.formState.errors.email && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                      {signInForm.formState.errors.email.message}
                                    </p>
                                  )}
                                </div>

                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Password
                                  </label>
                                  <div className="mt-1 relative">
                                    <input
                                      type={showPassword ? 'text' : 'password'}
                                      {...signInForm.register('password')}
                                      className="block w-full px-3 py-2 pl-10 pr-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                      placeholder="••••••••"
                                    />
                                    <Lock className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-500 transition-colors"
                                      aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                      {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                      ) : (
                                        <Eye className="h-5 w-5" />
                                      )}
                                    </button>
                                  </div>
                                  {signInForm.formState.errors.password && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                      {signInForm.formState.errors.password.message}
                                    </p>
                                  )}
                                </div>

                                <div className="flex items-center justify-between">
                                  <div className="flex items-center">
                                    <input
                                      id="remember-me"
                                      type="checkbox"
                                      {...signInForm.register('rememberMe')}
                                      className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-700 dark:text-gray-300">
                                      Remember me
                                    </label>
                                  </div>
                                  <button
                                    type="button"
                                    onClick={() => setMode('reset')}
                                    className="text-sm font-medium text-blue-600 hover:text-blue-500 dark:text-blue-400 transition-colors"
                                  >
                                    Forgot password?
                                  </button>
                                </div>

                                <button
                                  type="submit"
                                  disabled={isLoading}
                                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  {isLoading ? (
                                    <>
                                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                      Signing in...
                                    </>
                                  ) : (
                                    'Sign In'
                                  )}
                                </button>
                              </form>
                            </motion.div>
                          )}

                          {mode === 'signup' && (
                            <motion.div
                              key="signup"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.2 }}
                            >
                              <form onSubmit={signUpForm.handleSubmit(handleSignUp)} className="space-y-5">
                                {/* Full Name Field */}
                                <div className="space-y-2">
                                  <label 
                                    htmlFor="fullName" 
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                  >
                                    Full Name
                                  </label>
                                  <div className="relative">
                                    <input
                                      ref={initialFocusRef}
                                      id="fullName"
                                      type="text"
                                      {...signUpForm.register('fullName')}
                                      className="block w-full px-3 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                                      placeholder="Enter your full name"
                                      aria-describedby="fullName-error"
                                    />
                                    <User className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                  </div>
                                  {signUpForm.formState.errors.fullName && (
                                    <p id="fullName-error" className="text-sm text-red-600 dark:text-red-400">
                                      {signUpForm.formState.errors.fullName.message}
                                    </p>
                                  )}
                                </div>

                                {/* Email Field */}
                                <div className="space-y-2">
                                  <label 
                                    htmlFor="email" 
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                  >
                                    Email Address
                                  </label>
                                  <div className="relative">
                                    <input
                                      id="email"
                                      type="email"
                                      {...signUpForm.register('email')}
                                      className="block w-full px-3 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                                      placeholder="you@example.com"
                                      aria-describedby="email-error"
                                    />
                                    <Mail className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                  </div>
                                  {signUpForm.formState.errors.email && (
                                    <p id="email-error" className="text-sm text-red-600 dark:text-red-400">
                                      {signUpForm.formState.errors.email.message}
                                    </p>
                                  )}
                                </div>

                                {/* Password Field */}
                                <div className="space-y-2">
                                  <label 
                                    htmlFor="password" 
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                  >
                                    Password
                                  </label>
                                  <div className="relative">
                                    <input
                                      id="password"
                                      type={showPassword ? 'text' : 'password'}
                                      {...signUpForm.register('password')}
                                      className="block w-full px-3 py-3 pl-11 pr-11 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                                      placeholder="Create a strong password"
                                      aria-describedby="password-error password-requirements"
                                    />
                                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                    <button
                                      type="button"
                                      onClick={() => setShowPassword(!showPassword)}
                                      className="absolute right-3 top-3.5 text-gray-400 hover:text-gray-500 transition-colors"
                                      aria-label={showPassword ? "Hide password" : "Show password"}
                                    >
                                      {showPassword ? (
                                        <EyeOff className="h-5 w-5" />
                                      ) : (
                                        <Eye className="h-5 w-5" />
                                      )}
                                    </button>
                                  </div>
                                  
                                  {/* Password Requirements */}
                                  <div id="password-requirements" className="text-xs text-gray-500 dark:text-gray-400 space-y-1">
                                    <p>Password must contain:</p>
                                    <ul className="list-disc list-inside space-y-0.5 ml-2">
                                      <li>At least 8 characters</li>
                                      <li>One uppercase letter</li>
                                      <li>One number</li>
                                      <li>One special character</li>
                                    </ul>
                                  </div>
                                  
                                  {signUpForm.formState.errors.password && (
                                    <p id="password-error" className="text-sm text-red-600 dark:text-red-400">
                                      {signUpForm.formState.errors.password.message}
                                    </p>
                                  )}
                                </div>

                                {/* Confirm Password Field */}
                                <div className="space-y-2">
                                  <label 
                                    htmlFor="confirmPassword" 
                                    className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                                  >
                                    Confirm Password
                                  </label>
                                  <div className="relative">
                                    <input
                                      id="confirmPassword"
                                      type={showPassword ? 'text' : 'password'}
                                      {...signUpForm.register('confirmPassword')}
                                      className="block w-full px-3 py-3 pl-11 border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm placeholder-gray-400 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white transition-colors"
                                      placeholder="Confirm your password"
                                      aria-describedby="confirmPassword-error"
                                    />
                                    <Lock className="absolute left-3 top-3.5 h-5 w-5 text-gray-400" />
                                  </div>
                                  {signUpForm.formState.errors.confirmPassword && (
                                    <p id="confirmPassword-error" className="text-sm text-red-600 dark:text-red-400">
                                      {signUpForm.formState.errors.confirmPassword.message}
                                    </p>
                                  )}
                                </div>

                                {/* Remember Me Checkbox */}
                                <div className="flex items-center space-x-3">
                                  <input
                                    id="remember-me-signup"
                                    type="checkbox"
                                    {...signUpForm.register('rememberMe')}
                                    className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
                                  />
                                  <label 
                                    htmlFor="remember-me-signup" 
                                    className="text-sm text-gray-700 dark:text-gray-300"
                                  >
                                    Remember me for 30 days
                                  </label>
                                </div>

                                {/* Submit Button */}
                                <button
                                  type="submit"
                                  disabled={isLoading}
                                  className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200"
                                >
                                  {isLoading ? (
                                    <>
                                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                      Creating your account...
                                    </>
                                  ) : (
                                    <>
                                      <CheckSquare className="h-5 w-5 mr-2" />
                                      Create Account
                                    </>
                                  )}
                                </button>

                                {/* Terms and Privacy Notice */}
                                <p className="text-xs text-gray-500 dark:text-gray-400 text-center">
                                  By creating an account, you agree to our{' '}
                                  <a href="/terms" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                                    Terms of Service
                                  </a>{' '}
                                  and{' '}
                                  <a href="/privacy" className="text-blue-600 hover:text-blue-500 dark:text-blue-400">
                                    Privacy Policy
                                  </a>
                                </p>
                              </form>
                            </motion.div>
                          )}

                          {mode === 'reset' && (
                            <motion.div
                              key="reset"
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.2 }}
                            >
                              <form onSubmit={resetForm.handleSubmit(handlePasswordReset)} className="space-y-6">
                                <div>
                                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                                    Email
                                  </label>
                                  <div className="mt-1 relative">
                                    <input
                                      ref={initialFocusRef}
                                      type="email"
                                      {...resetForm.register('email')}
                                      className="block w-full px-3 py-2 pl-10 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:text-white"
                                      placeholder="you@example.com"
                                    />
                                    <Mail className="absolute left-3 top-2.5 h-5 w-5 text-gray-400" />
                                  </div>
                                  {resetForm.formState.errors.email && (
                                    <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                                      {resetForm.formState.errors.email.message}
                                    </p>
                                  )}
                                </div>

                                <button
                                  type="submit"
                                  disabled={isLoading}
                                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                  {isLoading ? (
                                    <>
                                      <Loader2 className="h-5 w-5 animate-spin mr-2" />
                                      Sending...
                                    </>
                                  ) : (
                                    'Send Reset Instructions'
                                  )}
                                </button>
                              </form>
                            </motion.div>
                          )}
                        </AnimatePresence>

                        {mode !== 'reset' && (
                          <>
                            <div className="mt-6 relative">
                              <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-300 dark:border-gray-600" />
                              </div>
                              <div className="relative flex justify-center text-sm">
                                <span className="px-2 bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400">
                                  Or continue with
                                </span>
                              </div>
                            </div>

                            <div className="mt-6">
                              <button
                                type="button"
                                onClick={() => handleSocialSignIn('google')}
                                disabled={isLoading}
                                className="w-full inline-flex justify-center py-2 px-4 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-colors"
                              >
                                <svg className="h-5 w-5 mr-2" viewBox="0 0 24 24">
                                  <g transform="matrix(1, 0, 0, 1, 27.009001, -39.238998)">
                                    <path fill="#4285F4" d="M -3.264 51.509 C -3.264 50.719 -3.334 49.969 -3.454 49.239 L -14.754 49.239 L -14.754 53.749 L -8.284 53.749 C -8.574 55.229 -9.424 56.479 -10.684 57.329 L -10.684 60.329 L -6.824 60.329 C -4.564 58.239 -3.264 55.159 -3.264 51.509 Z" />
                                    <path fill="#34A853" d="M -14.754 63.239 C -11.514 63.239 -8.804 62.159 -6.824 60.329 L -10.684 57.329 C -11.764 58.049 -13.134 58.489 -14.754 58.489 C -17.884 58.489 -20.534 56.379 -21.484 53.529 L -25.464 53.529 L -25.464 56.619 C -23.494 60.539 -19.444 63.239 -14.754 63.239 Z" />
                                    <path fill="#FBBC05" d="M -21.484 53.529 C -21.734 52.809 -21.864 52.039 -21.864 51.239 C -21.864 50.439 -21.724 49.669 -21.484 48.949 L -21.484 45.859 L -25.464 45.859 C -26.284 47.479 -26.754 49.299 -26.754 51.239 C -26.754 53.179 -26.284 54.999 -25.464 56.619 L -21.484 53.529 Z" />
                                    <path fill="#EA4335" d="M -14.754 43.989 C -12.984 43.989 -11.404 44.599 -10.154 45.789 L -6.734 42.369 C -8.804 40.429 -11.514 39.239 -14.754 39.239 C -19.444 39.239 -23.494 41.939 -25.464 45.859 L -21.484 48.949 C -20.534 46.099 -17.884 43.989 -14.754 43.989 Z" />
                                  </g>
                                </svg>
                                Continue with Google
                              </button>
                            </div>
                          </>
                        )}

                        {/* Form Navigation */}
                        <div className="mt-6 text-sm text-center">
                          {mode === 'signin' ? (
                            <>
                              <p className="text-gray-600 dark:text-gray-400">
                                Don't have an account?{' '}
                                <button
                                  type="button"
                                  onClick={() => setMode('signup')}
                                  className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium transition-colors"
                                >
                                  Sign up
                                </button>
                              </p>
                            </>
                          ) : (
                            <button
                              type="button"
                              onClick={() => setMode('signin')}
                              className="text-blue-600 hover:text-blue-500 dark:text-blue-400 font-medium transition-colors"
                            >
                              {mode === 'signup' ? 'Already have an account? Sign in' : 'Back to sign in'}
                            </button>
                          )}
                        </div>
                      </>
                    )}
                  </>
                )}
              </div>
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
}