import React, { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase/client';
import { siteConfig } from '../../lib/supabase/config';

export default function OAuthDiagnostic() {
  const [diagnostics, setDiagnostics] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const runDiagnostics = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      const results = {
        timestamp: new Date().toISOString(),
        environment: {
          nodeEnv: import.meta.env.MODE,
          isDev: import.meta.env.DEV,
          isProd: import.meta.env.PROD,
        },
        supabase: {
          url: supabase.supabaseUrl,
          key: supabase.supabaseKey ? 'Present' : 'Missing',
          keyLength: supabase.supabaseKey?.length || 0,
        },
        config: {
          siteUrl: siteConfig.development.siteUrl,
          redirectUrl: siteConfig.development.redirectUrl,
          currentOrigin: window.location.origin,
          currentUrl: window.location.href,
        },
        tests: {
          supabaseConnection: false,
          oauthUrlGeneration: false,
          redirectUrlMatch: false,
        },
        errors: [] as string[],
        warnings: [] as string[],
      };

      // Test 1: Supabase Connection
      try {
        const { data, error } = await supabase.auth.getSession();
        if (error) {
          results.errors.push(`Supabase connection failed: ${error.message}`);
        } else {
          results.tests.supabaseConnection = true;
        }
      } catch (err) {
        results.errors.push(`Supabase connection error: ${err instanceof Error ? err.message : 'Unknown'}`);
      }

      // Test 2: OAuth URL Generation
      try {
        const { data, error } = await supabase.auth.signInWithOAuth({
          provider: 'google',
          options: {
            redirectTo: siteConfig.development.redirectUrl,
          },
        });

        if (error) {
          results.errors.push(`OAuth URL generation failed: ${error.message}`);
          
          // Parse specific error messages
          if (error.message.includes('Invalid redirect URI')) {
            results.errors.push('❌ REDIRECT URI MISMATCH: Check Google Cloud Console redirect URIs');
          }
          if (error.message.includes('invalid_client')) {
            results.errors.push('❌ INVALID CLIENT: Check Google OAuth Client ID in Supabase');
          }
          if (error.message.includes('unauthorized_client')) {
            results.errors.push('❌ UNAUTHORIZED CLIENT: Check Google OAuth Client Secret in Supabase');
          }
          if (error.message.includes('access_denied')) {
            results.errors.push('❌ ACCESS DENIED: Check OAuth consent screen configuration');
          }
        } else if (data.url) {
          results.tests.oauthUrlGeneration = true;
          results.oauthUrl = data.url;
        } else {
          results.errors.push('OAuth URL generation returned no URL');
        }
      } catch (err) {
        results.errors.push(`OAuth URL generation error: ${err instanceof Error ? err.message : 'Unknown'}`);
      }

      // Test 3: Redirect URL Match
      const expectedRedirectUrl = `${window.location.origin}/auth/callback`;
      if (siteConfig.development.redirectUrl === expectedRedirectUrl) {
        results.tests.redirectUrlMatch = true;
      } else {
        results.warnings.push(`Redirect URL mismatch: expected ${expectedRedirectUrl}, got ${siteConfig.development.redirectUrl}`);
      }

      // Additional checks
      if (!supabase.supabaseKey || supabase.supabaseKey === 'Missing') {
        results.errors.push('❌ SUPABASE KEY MISSING: Check VITE_SUPABASE_ANON_KEY environment variable');
      }

      if (!supabase.supabaseUrl || !supabase.supabaseUrl.includes('supabase')) {
        results.errors.push('❌ INVALID SUPABASE URL: Check VITE_SUPABASE_URL environment variable');
      }

      if (supabase.supabaseKey && supabase.supabaseKey.length < 100) {
        results.warnings.push('Supabase key seems too short (should be ~100+ characters)');
      }

      setDiagnostics(results);
    } catch (err) {
      setError(`Diagnostic failed: ${err instanceof Error ? err.message : 'Unknown error'}`);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    runDiagnostics();
  }, []);

  const getStatusColor = (status: boolean) => {
    return status ? 'text-green-600' : 'text-red-600';
  };

  const getStatusIcon = (status: boolean) => {
    return status ? '✅' : '❌';
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-lg max-w-4xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold text-gray-900">OAuth Diagnostic Tool</h2>
        <button
          onClick={runDiagnostics}
          disabled={isLoading}
          className="bg-blue-500 hover:bg-blue-600 disabled:bg-gray-400 text-white px-4 py-2 rounded-lg"
        >
          {isLoading ? 'Running...' : 'Run Diagnostics'}
        </button>
      </div>

      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {error}
        </div>
      )}

      {diagnostics && (
        <div className="space-y-6">
          {/* Test Results */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Test Results</h3>
            <div className="space-y-2">
              <div className="flex items-center">
                <span className="mr-2">{getStatusIcon(diagnostics.tests.supabaseConnection)}</span>
                <span className={getStatusColor(diagnostics.tests.supabaseConnection)}>
                  Supabase Connection
                </span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">{getStatusIcon(diagnostics.tests.oauthUrlGeneration)}</span>
                <span className={getStatusColor(diagnostics.tests.oauthUrlGeneration)}>
                  OAuth URL Generation
                </span>
              </div>
              <div className="flex items-center">
                <span className="mr-2">{getStatusIcon(diagnostics.tests.redirectUrlMatch)}</span>
                <span className={getStatusColor(diagnostics.tests.redirectUrlMatch)}>
                  Redirect URL Match
                </span>
              </div>
            </div>
          </div>

          {/* Errors */}
          {diagnostics.errors.length > 0 && (
            <div className="bg-red-50 border border-red-200 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-red-800 mb-2">Critical Issues</h3>
              <ul className="space-y-1">
                {diagnostics.errors.map((error, index) => (
                  <li key={index} className="text-red-700 text-sm">
                    {error}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Warnings */}
          {diagnostics.warnings.length > 0 && (
            <div className="bg-yellow-50 border border-yellow-200 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-yellow-800 mb-2">Warnings</h3>
              <ul className="space-y-1">
                {diagnostics.warnings.map((warning, index) => (
                  <li key={index} className="text-yellow-700 text-sm">
                    {warning}
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Configuration Details */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h3 className="text-lg font-semibold mb-3">Configuration Details</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
              <div>
                <strong>Supabase URL:</strong> {diagnostics.supabase.url}
              </div>
              <div>
                <strong>Supabase Key:</strong> {diagnostics.supabase.key} ({diagnostics.supabase.keyLength} chars)
              </div>
              <div>
                <strong>Redirect URL:</strong> {diagnostics.config.redirectUrl}
              </div>
              <div>
                <strong>Current Origin:</strong> {diagnostics.config.currentOrigin}
              </div>
            </div>
          </div>

          {/* OAuth URL */}
          {diagnostics.oauthUrl && (
            <div className="bg-green-50 border border-green-200 p-4 rounded-lg">
              <h3 className="text-lg font-semibold text-green-800 mb-2">Generated OAuth URL</h3>
              <div className="break-all text-sm text-green-700 mb-2">
                {diagnostics.oauthUrl}
              </div>
              <button
                onClick={() => window.open(diagnostics.oauthUrl, '_blank')}
                className="bg-green-500 hover:bg-green-600 text-white px-4 py-2 rounded-lg"
              >
                Test OAuth URL
              </button>
            </div>
          )}

          {/* Fix Instructions */}
          <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
            <h3 className="text-lg font-semibold text-blue-800 mb-2">How to Fix 400 Bad Request</h3>
            <ol className="list-decimal list-inside space-y-2 text-sm text-blue-700">
              <li>
                <strong>Check Supabase Dashboard:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Go to Authentication → Providers → Google</li>
                  <li>Enable Google provider</li>
                  <li>Add your Google Client ID and Client Secret</li>
                  <li>Set redirect URL to: <code className="bg-blue-100 px-1 rounded">http://localhost:5173/auth/callback</code></li>
                </ul>
              </li>
              <li>
                <strong>Check Google Cloud Console:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Go to APIs & Services → Credentials</li>
                  <li>Find your OAuth 2.0 Client ID</li>
                  <li>Add authorized redirect URI: <code className="bg-blue-100 px-1 rounded">http://localhost:5173/auth/callback</code></li>
                  <li>Configure OAuth consent screen</li>
                  <li>Enable Google+ API if needed</li>
                </ul>
              </li>
              <li>
                <strong>Check Environment Variables:</strong>
                <ul className="list-disc list-inside ml-4 mt-1">
                  <li>Verify VITE_SUPABASE_URL is correct</li>
                  <li>Verify VITE_SUPABASE_ANON_KEY is correct</li>
                  <li>Restart your development server after changes</li>
                </ul>
              </li>
            </ol>
          </div>
        </div>
      )}
    </div>
  );
}

