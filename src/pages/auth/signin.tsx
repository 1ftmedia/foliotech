import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet-async';

export default function SignIn() {
  const navigate = useNavigate();

  useEffect(() => {
    // Redirect to home page and trigger signin dialog
    navigate('/', { 
      replace: true,
      state: { openAuthDialog: true, authMode: 'signin' }
    });
  }, [navigate]);

  return (
    <>
      <Helmet>
        <title>Sign In | FolioTech Institute</title>
        <meta name="description" content="Sign in to your FolioTech Institute account" />
      </Helmet>
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
            Redirecting to Sign In...
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            Please wait while we redirect you to the sign in page.
          </p>
        </div>
      </div>
    </>
  );
}
