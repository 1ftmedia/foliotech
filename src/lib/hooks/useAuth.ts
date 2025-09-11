import { useEffect, useState } from 'react';
import { User, Session } from '@supabase/supabase-js';
import { supabase } from '../supabase/client';
import React, { createContext, useContext } from 'react';
import { getAndClearRedirectUrl } from '../utils/redirects';

interface AuthState {
  user: User | null;
  session: Session | null;
  loading: boolean;
  error: Error | null;
}

// Create a context for auth
const AuthContext = createContext<AuthState>({
  user: null,
  session: null,
  loading: true,
  error: null
});

// Provider component for auth context
export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [state, setState] = useState<AuthState>({
    user: null,
    session: null,
    loading: true,
    error: null
  });

  useEffect(() => {
    // Get initial session
    const initializeAuth = async () => {
      try {
        const { data, error } = await supabase.auth.getSession();
        
        if (error) {
          throw error;
        }
        
        setState({
          user: data.session?.user ?? null,
          session: data.session,
          loading: false,
          error: null
        });
      } catch (err) {
        console.error('Error getting auth session:', err);
        setState({
          user: null,
          session: null,
          loading: false,
          error: err instanceof Error ? err : new Error('Failed to initialize auth')
        });
      }
    };

    initializeAuth();

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      (event, session) => {
        setState({
          user: session?.user ?? null,
          session,
          loading: false,
          error: null
        });

        // Handle redirect after successful sign in (for immediate logins, not email confirmations)
        if (event === 'SIGNED_IN' && session?.user) {
          const storedRedirectUrl = getAndClearRedirectUrl();
          if (storedRedirectUrl) {
            // Only redirect if we're not already on the target page
            if (window.location.pathname !== storedRedirectUrl) {
              // Use a longer delay to ensure auth state is fully updated
              setTimeout(() => {
                window.location.href = storedRedirectUrl;
              }, 1000);
            }
          }
        }
      }
    );

    return () => {
      subscription.unsubscribe();
    };
  }, []);

  return React.createElement(AuthContext.Provider, { value: state }, children);
}

// Hook to use auth context
export const useAuth = () => useContext(AuthContext);