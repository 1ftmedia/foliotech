/**
 * Cache busting utilities to ensure fresh assets are loaded
 */

/**
 * Clear browser cache for the application
 */
export function clearApplicationCache(): void {
  // Clear localStorage items that might be stale
  const keysToPreserve = ['auth_redirect_url', 'rememberMe'];
  const allKeys = Object.keys(localStorage);
  
  allKeys.forEach(key => {
    if (!keysToPreserve.includes(key)) {
      localStorage.removeItem(key);
    }
  });

  // Clear sessionStorage
  sessionStorage.clear();

  // If service worker is available, update it
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.getRegistrations().then(registrations => {
      registrations.forEach(registration => {
        registration.update();
      });
    });
  }
}

/**
 * Force reload with cache bypass
 */
export function hardReload(): void {
  // Use location.reload(true) equivalent for modern browsers
  window.location.reload();
}

/**
 * Check if we need to bust cache (e.g., after a deployment)
 */
export function shouldBustCache(): boolean {
  const lastCacheBust = localStorage.getItem('last_cache_bust');
  const currentVersion = import.meta.env.VITE_APP_VERSION || 'unknown';
  
  if (!lastCacheBust || lastCacheBust !== currentVersion) {
    localStorage.setItem('last_cache_bust', currentVersion);
    return true;
  }
  
  return false;
}

/**
 * Add cache busting parameters to dynamic imports
 */
export function bustImportCache(): void {
  if (shouldBustCache()) {
    console.log('Cache bust detected, clearing application cache...');
    clearApplicationCache();
  }
}
