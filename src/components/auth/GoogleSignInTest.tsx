import React, { useState } from 'react';
import { signInWithSocial } from '../../lib/supabase/auth';
import { supabase } from '../../lib/supabase/client';
import { siteConfig } from '../../lib/supabase/config';
import { runOAuthTest, validateOAuthConfig, getOAuthConfig } from '../../utils/oauthVerification';

export default function GoogleSignInTest() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [config, setConfig] = useState<any>(null);

  const testConfiguration = () => {
    const config = getOAuthConfig();
    const validation = validateOAuthConfig(config);
    
    setConfig({ ...config, validation });
    setError(null);
    
    if (validation.valid) {
      setSuccess('Configuration is valid!');
    } else {
      setError(`Configuration issues: ${validation.issues.join(', ')}`);
    }
  };

  const testGoogleSignIn = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      console.log('🧪 Testing Google sign-in...');
      
      // Test the OAuth URL generation
      const { url } = await signInWithSocial('google');
      
      console.log('✅ OAuth URL generated:', url);
      setSuccess(`OAuth URL generated successfully! Click the link below to test.`);
      
      // Store the URL for testing
      (window as any).testOAuthUrl = url;
      
    } catch (err) {
      console.error('❌ Google sign-in test failed:', err);
      setError(err instanceof Error ? err.message : 'Unknown error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  const testSupabaseConnection = async () => {
    try {
      setError(null);
      setSuccess(null);
      
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        setError(`Supabase connection error: ${error.message}`);
        return;
      }
      
      setSuccess(`Supabase connected successfully. Session: ${data.session ? 'Active' : 'None'}`);
    } catch (err) {
      setError(`Connection test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const runComprehensiveTest = async () => {
    try {
      setIsLoading(true);
      setError(null);
      setSuccess(null);
      
      const result = await runOAuthTest();
      setConfig(result);
      
      if (result.errors.length === 0) {
        setSuccess('All tests passed! Google sign-in should work correctly.');
      } else {
        setError(`Test failed: ${result.errors.join(', ')}`);
      }
      
      if (result.warnings.length > 0) {
        console.warn('OAuth warnings:', result.warnings);
      }
    } catch (err) {
      setError(`Comprehensive test failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  const openOAuthUrl = () => {
    const url = (window as any).testOAuthUrl;
    if (url) {
      window.open(url, '_blank');
    } else {
      setError('No OAuth URL available. Please run the test first.');
    }
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-2xl mx-auto">
      <h2 className="text-2xl font-bold text-gray-900 mb-6">Google Sign-In Test</h2>
      
      <div className="space-y-4">
        <div className="flex flex-wrap gap-4">
          <button
            onClick={testConfiguration}
            className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
          >
            Test Configuration
          </button>
          
          <button
            onClick={testSupabaseConnection}
            className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
          >
            Test Supabase Connection
          </button>
          
          <button
            onClick={testGoogleSignIn}
            disabled={isLoading}
            className="bg-red-500 hover:bg-red-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            {isLoading ? 'Testing...' : 'Test Google Sign-In'}
          </button>
          
          <button
            onClick={runComprehensiveTest}
            disabled={isLoading}
            className="bg-purple-500 hover:bg-purple-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
          >
            {isLoading ? 'Running...' : 'Run All Tests'}
          </button>
        </div>

        {config && (
          <div className="bg-gray-100 p-4 rounded-lg">
            <h3 className="font-semibold mb-2">Configuration:</h3>
            <pre className="text-sm overflow-auto">
              {JSON.stringify(config, null, 2)}
            </pre>
          </div>
        )}

        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded">
            <strong>Success:</strong> {success}
          </div>
        )}

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {(window as any).testOAuthUrl && (
          <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded">
            <p className="mb-2"><strong>OAuth URL Generated!</strong></p>
            <button
              onClick={openOAuthUrl}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg"
            >
              Open OAuth URL in New Tab
            </button>
          </div>
        )}

        <div className="bg-yellow-100 border border-yellow-400 text-yellow-700 px-4 py-3 rounded">
          <h3 className="font-semibold mb-2">Testing Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Click "Test Configuration" to verify your setup</li>
            <li>Click "Test Supabase Connection" to verify Supabase is working</li>
            <li>Click "Test Google Sign-In" to generate the OAuth URL</li>
            <li>Click "Open OAuth URL" to test the complete flow</li>
            <li>Complete the Google sign-in process</li>
            <li>Verify you're redirected back to your app</li>
          </ol>
        </div>

        <div className="bg-gray-100 p-4 rounded-lg">
          <h3 className="font-semibold mb-2">Expected Flow:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Click Google sign-in button</li>
            <li>Redirect to Google OAuth page</li>
            <li>User authorizes the app</li>
            <li>Google redirects to: <code className="bg-gray-200 px-1 rounded">http://localhost:5173/auth/callback</code></li>
            <li>Callback processes the authentication</li>
            <li>User is redirected to dashboard or success page</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
