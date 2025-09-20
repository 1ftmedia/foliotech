import React, { useState } from 'react';
import { signInWithSocial } from '../../lib/supabase/auth';
import { supabase } from '../../lib/supabase/client';

/**
 * OAuth Debugger Component
 * Use this to test and debug OAuth functionality
 */
export function OAuthDebugger() {
  const [logs, setLogs] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);

  const addLog = (message: string) => {
    setLogs(prev => [...prev, `${new Date().toLocaleTimeString()}: ${message}`]);
  };

  const testGoogleOAuth = async () => {
    try {
      setIsLoading(true);
      addLog('🚀 Starting Google OAuth test...');
      
      // Test Supabase client
      addLog(`🔧 Supabase URL: ${supabase.supabaseUrl}`);
      addLog(`🔑 Supabase Key: ${supabase.supabaseKey ? 'Present' : 'Missing'}`);
      
      // Test OAuth initiation
      addLog('🔄 Initiating Google OAuth...');
      const { url } = await signInWithSocial('google');
      
      addLog(`✅ OAuth URL generated: ${url}`);
      addLog('🔗 Redirecting to Google...');
      
      // Redirect to Google OAuth
      window.location.href = url;
    } catch (error) {
      addLog(`❌ Error: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.error('OAuth Debug Error:', error);
      setIsLoading(false);
    }
  };

  const testSupabaseConnection = async () => {
    try {
      addLog('🔍 Testing Supabase connection...');
      const { data, error } = await supabase.auth.getSession();
      
      if (error) {
        addLog(`❌ Supabase connection error: ${error.message}`);
      } else {
        addLog(`✅ Supabase connected. Session: ${data.session ? 'Active' : 'None'}`);
      }
    } catch (error) {
      addLog(`❌ Connection test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const clearLogs = () => {
    setLogs([]);
  };

  return (
    <div className="p-6 bg-gray-100 dark:bg-gray-800 rounded-lg">
      <h3 className="text-lg font-semibold mb-4">OAuth Debugger</h3>
      
      <div className="space-y-4">
        <div className="flex space-x-2">
          <button
            onClick={testGoogleOAuth}
            disabled={isLoading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
          >
            {isLoading ? 'Testing...' : 'Test Google OAuth'}
          </button>
          
          <button
            onClick={testSupabaseConnection}
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
          >
            Test Supabase Connection
          </button>
          
          <button
            onClick={clearLogs}
            className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
          >
            Clear Logs
          </button>
        </div>
        
        <div className="bg-black text-green-400 p-4 rounded font-mono text-sm max-h-96 overflow-y-auto">
          {logs.length === 0 ? (
            <div className="text-gray-500">Click "Test Google OAuth" to start debugging...</div>
          ) : (
            logs.map((log, index) => (
              <div key={index} className="mb-1">{log}</div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}
