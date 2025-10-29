/**
 * OAuth Configuration Checker
 * 
 * This utility helps verify OAuth configuration and provides specific fix instructions
 */

export interface OAuthConfigIssue {
  type: 'error' | 'warning' | 'info';
  message: string;
  fix?: string;
}

export interface OAuthConfigCheck {
  isValid: boolean;
  issues: OAuthConfigIssue[];
  recommendations: string[];
}

/**
 * Check OAuth configuration and return specific issues
 */
export function checkOAuthConfig(): OAuthConfigCheck {
  const issues: OAuthConfigIssue[] = [];
  const recommendations: string[] = [];

  // Check environment variables
  const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
  const supabaseKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

  if (!supabaseUrl) {
    issues.push({
      type: 'error',
      message: 'VITE_SUPABASE_URL is not set',
      fix: 'Add VITE_SUPABASE_URL to your .env file'
    });
  } else if (!supabaseUrl.includes('supabase')) {
    issues.push({
      type: 'error',
      message: 'VITE_SUPABASE_URL does not appear to be a valid Supabase URL',
      fix: 'Check your VITE_SUPABASE_URL in .env file'
    });
  }

  if (!supabaseKey) {
    issues.push({
      type: 'error',
      message: 'VITE_SUPABASE_ANON_KEY is not set',
      fix: 'Add VITE_SUPABASE_ANON_KEY to your .env file'
    });
  } else if (supabaseKey.length < 100) {
    issues.push({
      type: 'warning',
      message: 'VITE_SUPABASE_ANON_KEY seems too short',
      fix: 'Verify your VITE_SUPABASE_ANON_KEY is correct'
    });
  }

  // Check redirect URL configuration
  const currentOrigin = window.location.origin;
  const expectedRedirectUrl = `${currentOrigin}/auth/callback`;
  
  if (currentOrigin !== 'http://localhost:5173') {
    issues.push({
      type: 'warning',
      message: `Application is running on ${currentOrigin}, not http://localhost:5173`,
      fix: 'Update your redirect URLs in Supabase and Google Cloud Console'
    });
  }

  // Add recommendations based on common issues
  if (issues.some(issue => issue.type === 'error')) {
    recommendations.push('Fix all errors before testing OAuth');
  }

  recommendations.push('Verify Google OAuth is enabled in Supabase dashboard');
  recommendations.push('Check redirect URI is added to Google Cloud Console');
  recommendations.push('Ensure OAuth consent screen is configured');
  recommendations.push('Restart development server after changing environment variables');

  return {
    isValid: issues.filter(issue => issue.type === 'error').length === 0,
    issues,
    recommendations
  };
}

/**
 * Get specific fix instructions for 400 Bad Request error
 */
export function get400ErrorFixes(): string[] {
  return [
    '1. Check Supabase Dashboard:',
    '   - Go to Authentication → Providers → Google',
    '   - Enable Google provider',
    '   - Add Google Client ID and Client Secret',
    '   - Set redirect URL to: http://localhost:5173/auth/callback',
    '',
    '2. Check Google Cloud Console:',
    '   - Go to APIs & Services → Credentials',
    '   - Find your OAuth 2.0 Client ID',
    '   - Add authorized redirect URI: http://localhost:5173/auth/callback',
    '   - Configure OAuth consent screen',
    '   - Enable Google+ API if needed',
    '',
    '3. Check Environment Variables:',
    '   - Verify VITE_SUPABASE_URL is correct',
    '   - Verify VITE_SUPABASE_ANON_KEY is correct',
    '   - Restart development server after changes',
    '',
    '4. Common Issues:',
    '   - Redirect URI mismatch between Supabase and Google',
    '   - Missing or incorrect Client ID/Secret',
    '   - OAuth consent screen not configured',
    '   - Google+ API not enabled',
    '   - Wrong environment variables'
  ];
}

/**
 * Validate redirect URL format
 */
export function validateRedirectUrl(url: string): { isValid: boolean; message: string } {
  try {
    const urlObj = new URL(url);
    
    if (urlObj.protocol !== 'http:' && urlObj.protocol !== 'https:') {
      return { isValid: false, message: 'Redirect URL must use http or https protocol' };
    }
    
    if (!urlObj.pathname.endsWith('/auth/callback')) {
      return { isValid: false, message: 'Redirect URL must end with /auth/callback' };
    }
    
    return { isValid: true, message: 'Redirect URL format is valid' };
  } catch {
    return { isValid: false, message: 'Redirect URL is not a valid URL' };
  }
}

