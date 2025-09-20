/**
 * Supabase Configuration and Email Template Management
 * 
 * This file handles:
 * - Environment-based configuration
 * - Email template customization
 * - Redirect URL management
 * - Auth flow configuration
 */

import { createAuthEmailTemplate, createConfirmationEmail, createPasswordResetEmail, createMagicLinkEmail, createEmailChangeEmail } from './emailTemplates';

// Environment detection
export const isDevelopment = import.meta.env.DEV;
export const isProduction = import.meta.env.PROD;

// Site URLs based on environment
export const siteConfig = {
  development: {
    siteUrl: 'http://localhost:5174',
    redirectUrl: 'http://localhost:5174/auth/callback',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'http://localhost:54321',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-local-anon-key'
  },
  production: {
    siteUrl: 'https://foliotechinstitute.com',
    redirectUrl: 'https://foliotechinstitute.com/auth/callback',
    supabaseUrl: import.meta.env.VITE_SUPABASE_URL || 'https://your-project.supabase.co',
    supabaseAnonKey: import.meta.env.VITE_SUPABASE_ANON_KEY || 'your-production-anon-key'
  }
};

// Get current configuration based on environment
export const getCurrentConfig = () => {
  return isDevelopment ? siteConfig.development : siteConfig.production;
};

// Supabase client configuration
export const supabaseConfig = {
  auth: {
    persistSession: true,
    autoRefreshToken: true,
    detectSessionInUrl: true,
    flowType: 'pkce' as const,
    redirectTo: getCurrentConfig().redirectUrl,
    onAuthStateChange: (event: string, session: any) => {
      if (event === 'SIGNED_IN') {
        console.log('User signed in:', session?.user?.email);
      } else if (event === 'SIGNED_OUT') {
        console.log('User signed out');
      }
    }
  }
};

// Email template configuration for Supabase Auth
export const emailTemplates = {
  // Email confirmation template
  confirmSignup: (data: { userName?: string; confirmationURL: string }) => 
    createConfirmationEmail(data),
  
  // Password reset template
  resetPassword: (data: { userName?: string; confirmationURL: string }) => 
    createPasswordResetEmail(data),
  
  // Magic link template
  magicLink: (data: { userName?: string; confirmationURL: string }) => 
    createMagicLinkEmail(data),
  
  // Email change template
  changeEmail: (data: { userName?: string; confirmationURL: string }) => 
    createEmailChangeEmail(data)
};

// Supabase Auth settings that need to be configured in the dashboard
export const supabaseAuthSettings = {
  // Site URL (configure in Supabase Dashboard > Authentication > URL Configuration)
  siteUrl: getCurrentConfig().siteUrl,
  
  // Redirect URLs (configure in Supabase Dashboard > Authentication > URL Configuration)
  redirectUrls: [
    getCurrentConfig().redirectUrl,
    // Add additional redirect URLs if needed
    `${getCurrentConfig().siteUrl}/dashboard`,
    `${getCurrentConfig().siteUrl}/applications`
  ],
  
  // Email templates (configure in Supabase Dashboard > Authentication > Email Templates)
  emailTemplates: {
    confirmSignup: {
      subject: 'Confirm Your Email - FolioTech Institute',
      content: 'Use the confirmation link: {{ .ConfirmationURL }}'
    },
    resetPassword: {
      subject: 'Reset Your Password - FolioTech Institute',
      content: 'Use the reset link: {{ .ConfirmationURL }}'
    },
    magicLink: {
      subject: 'Login to FolioTech Institute',
      content: 'Use the login link: {{ .ConfirmationURL }}'
    },
    changeEmail: {
      subject: 'Confirm Email Change - FolioTech Institute',
      content: 'Use the confirmation link: {{ .ConfirmationURL }}'
    }
  }
};

// Export configuration for use in other files
export { getCurrentConfig as getConfig };
