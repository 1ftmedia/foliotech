import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet-async';
import { motion } from 'framer-motion';
import { LoadingSpinner } from '../components/LoadingSpinner';
import { ErrorBoundary } from '../components/ErrorBoundary';
import { useAuth } from '../lib/hooks/useAuth';
import { useAuthModal } from '../context/AuthModalContext';
import { ApplicationForm } from '../components/application/ApplicationForm';

export default function Apply() {
  const { user, loading } = useAuth();
  const { openAuthModal } = useAuthModal();
  const [isCheckingAuth, setIsCheckingAuth] = useState(true);


  // Add a small delay to ensure auth state is fully loaded
  useEffect(() => {
    if (!loading) {
      const timer = setTimeout(() => {
        setIsCheckingAuth(false);
      }, 200);
      return () => clearTimeout(timer);
    }
  }, [loading]);

  // Also check if user becomes available after initial load
  useEffect(() => {
    if (user && isCheckingAuth) {
      setIsCheckingAuth(false);
    }
  }, [user, isCheckingAuth]);

  if (loading || isCheckingAuth) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" message="Loading..." />
      </div>
    );
  }

  return (
    <>
      <Helmet>
        <title>Apply | FolioTech Institute</title>
        <meta name="description" content="Apply to FolioTech Institute's programs and start your journey in technology education." />
      </Helmet>


      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-12">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white dark:bg-gray-800 rounded-lg shadow-xl overflow-hidden"
          >
            <div className="px-6 py-8">
              <h1 className="text-3xl font-bold text-center text-gray-900 dark:text-white mb-8">
                Student Application
              </h1>
              
              <ErrorBoundary>
                {user ? (
                  <ApplicationForm />
                ) : (
                  <div className="text-center py-12">
                    <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                      Authentication Required
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400 mb-6">
                      Please sign in or create an account to access the application form.
                    </p>
                    <button
                      onClick={() => openAuthModal('signup')}
                      className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                    >
                      Sign In / Get Started
                    </button>
                  </div>
                )}
              </ErrorBoundary>
            </div>
          </motion.div>
        </div>
      </div>
    </>
  );
}