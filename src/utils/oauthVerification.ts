/**
 * OAuth Verification Utilities
 * 
 * This file contains utilities to verify OAuth configuration and flow
 */

import { supabase } from '../lib/supabase/client';
import { siteConfig } from '../lib/supabase/config';

export interface OAuthConfig {
  supabaseUrl: string;
  supabaseKey: string;
  redirectUrl: string;
  currentOrigin: string;
  userAgent: string;
  timestamp: string;
}

export interface OAuthTestResult {
  config: OAuthConfig;
  supabaseConnection: boolean;
  oauthUrlGeneration: boolean;
  errors: string[];
  warnings: string[];
}

/**
 * Get current OAuth configuration
 */
export function getOAuthConfig(): OAuthConfig {
  return {
    supabaseUrl: supabase.supabaseUrl,
    supabaseKey: supabase.supabaseKey || 'Missing',
    redirectUrl: siteConfig.development.redirectUrl,
    currentOrigin: window.location.origin,
    userAgent: navigator.userAgent,
    timestamp: new Date().toISOString()
  };
}

/**
 * Test Supabase connection
 */
export async function testSupabaseConnection(): Promise<{ success: boolean; error?: string }> {
  try {
    const { data, error } = await supabase.auth.getSession();
    
    if (error) {
      return { success: false, error: error.message };
    }
    
    return { success: true };
  } catch (err) {
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error' 
    };
  }
}

/**
 * Test OAuth URL generation
 */
export async function testOAuthUrlGeneration(): Promise<{ success: boolean; url?: string; error?: string }> {
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: siteConfig.development.redirectUrl,
      },
    });

    if (error) {
      return { success: false, error: error.message };
    }

    if (!data.url) {
      return { success: false, error: 'No OAuth URL generated' };
    }

    return { success: true, url: data.url };
  } catch (err) {
    return { 
      success: false, 
      error: err instanceof Error ? err.message : 'Unknown error' 
    };
  }
}

/**
 * Run comprehensive OAuth test
 */
export async function runOAuthTest(): Promise<OAuthTestResult> {
  const config = getOAuthConfig();
  const errors: string[] = [];
  const warnings: string[] = [];

  // Test Supabase connection
  const connectionTest = await testSupabaseConnection();
  if (!connectionTest.success) {
    errors.push(`Supabase connection failed: ${connectionTest.error}`);
  }

  // Test OAuth URL generation
  const oauthTest = await testOAuthUrlGeneration();
  if (!oauthTest.success) {
    errors.push(`OAuth URL generation failed: ${oauthTest.error}`);
  }

  // Check for common configuration issues
  if (config.supabaseKey === 'Missing') {
    errors.push('Supabase anon key is missing');
  }

  if (!config.supabaseUrl.includes('supabase')) {
    warnings.push('Supabase URL may be incorrect');
  }

  if (config.redirectUrl !== `${config.currentOrigin}/auth/callback`) {
    warnings.push(`Redirect URL mismatch: expected ${config.currentOrigin}/auth/callback, got ${config.redirectUrl}`);
  }

  return {
    config,
    supabaseConnection: connectionTest.success,
    oauthUrlGeneration: oauthTest.success,
    errors,
    warnings
  };
}

/**
 * Validate OAuth configuration
 */
export function validateOAuthConfig(config: OAuthConfig): { valid: boolean; issues: string[] } {
  const issues: string[] = [];

  if (!config.supabaseUrl) {
    issues.push('Supabase URL is missing');
  }

  if (!config.supabaseKey || config.supabaseKey === 'Missing') {
    issues.push('Supabase anon key is missing');
  }

  if (!config.redirectUrl) {
    issues.push('Redirect URL is missing');
  }

  if (config.redirectUrl !== `${config.currentOrigin}/auth/callback`) {
    issues.push(`Redirect URL should be ${config.currentOrigin}/auth/callback`);
  }

  return {
    valid: issues.length === 0,
    issues
  };
}

