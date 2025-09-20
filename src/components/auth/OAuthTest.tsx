import React, { useState } from 'react';
import { supabase } from '../../lib/supabase/client';

/**
 * Simple OAuth Test Component
 * Tests the OAuth URL generation directly
 */
export function OAuthTest() {
  const [result, setResult] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);

  const testOAuthURL = async () => {
    try {
      setIsLoading(true);
      setResult('Testing OAuth URL generation...\n');
      
      const redirectUrl = `${window.location.origin}/auth/callback`;
      setResult(prev => prev + `Redirect URL: ${redirectUrl}\n`);
      
      // Test direct Supabase OAuth call
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
        }
      });

      if (error) {
        setResult(prev => prev + `❌ Error: ${error.message}\n`);
        setResult(prev => prev + `Status: ${error.status}\n`);
        setResult(prev => prev + `StatusText: ${error.statusText}\n`);
      } else {
        setResult(prev => prev + `✅ Success! OAuth URL: ${data.url}\n`);
        setResult(prev => prev + `\nClick this link to test: ${data.url}\n`);
      }
    } catch (err) {
      setResult(prev => prev + `💥 Exception: ${err instanceof Error ? err.message : 'Unknown error'}\n`);
    } finally {
      setIsLoading(false);
    }
  };

  const testSupabaseConfig = () => {
    setResult('Supabase Configuration:\n');
    setResult(prev => prev + `URL: ${supabase.supabaseUrl}\n`);
    setResult(prev => prev + `Key: ${supabase.supabaseKey ? 'Present' : 'Missing'}\n`);
    setResult(prev => prev + `Current Origin: ${window.location.origin}\n`);
  };

  return (
    <div className="p-4 border rounded-lg">
      <h3 className="text-lg font-semibold mb-4">OAuth Direct Test</h3>
      
      <div className="space-y-2 mb-4">
        <button
          onClick={testOAuthURL}
          disabled={isLoading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? 'Testing...' : 'Test OAuth URL Generation'}
        </button>
        
        <button
          onClick={testSupabaseConfig}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Test Supabase Config
        </button>
      </div>
      
      <div className="bg-gray-100 p-4 rounded font-mono text-sm whitespace-pre-wrap max-h-96 overflow-y-auto">
        {result || 'Click a button to start testing...'}
      </div>
    </div>
  );
}
