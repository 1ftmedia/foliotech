import React from 'react';
import { OAuthTest } from '../components/auth/OAuthTest';
import { OAuthDebugger } from '../components/auth/OAuthDebugger';

/**
 * OAuth Test Page
 * Use this page to debug OAuth issues
 */
export default function OAuthTestPage() {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 py-8">
      <div className="max-w-4xl mx-auto px-4">
        <h1 className="text-3xl font-bold text-center mb-8">OAuth Debugging Tools</h1>
        
        <div className="space-y-8">
          <OAuthTest />
          <OAuthDebugger />
        </div>
        
        <div className="mt-8 p-4 bg-yellow-100 dark:bg-yellow-900 rounded-lg">
          <h3 className="font-semibold mb-2">Instructions:</h3>
          <ol className="list-decimal list-inside space-y-1 text-sm">
            <li>Click "Test Supabase Config" to verify your configuration</li>
            <li>Click "Test OAuth URL Generation" to test the OAuth flow</li>
            <li>If successful, you'll get a Google OAuth URL to test</li>
            <li>If there's an error, check the error message for specific issues</li>
            <li>Use the OAuth Debugger below for more detailed testing</li>
          </ol>
        </div>
      </div>
    </div>
  );
}
