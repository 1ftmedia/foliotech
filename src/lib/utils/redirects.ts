/**
 * Utility functions for managing redirect URLs after authentication
 */

const REDIRECT_KEY = 'auth_redirect_url';

/**
 * Store the current URL for redirect after authentication
 */
export function storeRedirectUrl(url?: string): void {
  const redirectUrl = url || window.location.pathname + window.location.search;
  
  // Don't store auth-related URLs or callback URLs
  if (
    redirectUrl.includes('/auth/') ||
    redirectUrl.includes('/signin') ||
    redirectUrl.includes('/signup') ||
    redirectUrl === '/'
  ) {
    return;
  }
  
  localStorage.setItem(REDIRECT_KEY, redirectUrl);
}

/**
 * Get the stored redirect URL and clear it from storage
 */
export function getAndClearRedirectUrl(): string | null {
  const redirectUrl = localStorage.getItem(REDIRECT_KEY);
  if (redirectUrl) {
    localStorage.removeItem(REDIRECT_KEY);
    return redirectUrl;
  }
  return null;
}

/**
 * Clear the stored redirect URL without returning it
 */
export function clearRedirectUrl(): void {
  localStorage.removeItem(REDIRECT_KEY);
}

/**
 * Check if there's a stored redirect URL
 */
export function hasStoredRedirectUrl(): boolean {
  return localStorage.getItem(REDIRECT_KEY) !== null;
}
