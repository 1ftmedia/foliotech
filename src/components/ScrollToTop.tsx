import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';

interface ScrollToTopProps {
  /**
   * Whether to use smooth scrolling (default: true)
   * Set to false for instant scrolling
   */
  smooth?: boolean;
  
  /**
   * Routes that should scroll instantly instead of smoothly
   * Useful for admin panels or dashboard routes where instant feedback is preferred
   */
  instantScrollRoutes?: string[];
  
  /**
   * Custom scroll behavior for specific routes
   * Overrides the default smooth/instant behavior
   */
  customScrollBehavior?: Record<string, 'smooth' | 'instant'>;
  
  /**
   * Whether to scroll to top on hash changes (default: false)
   * Set to true if you want to scroll to top even for in-page navigation
   */
  scrollOnHashChange?: boolean;
}

/**
 * ScrollToTop Component
 * 
 * Automatically scrolls to the top of the page on route changes.
 * This ensures users start at the top when navigating between pages.
 * 
 * Features:
 * - Smooth scrolling behavior (configurable)
 * - Works with all route changes
 * - Preserves in-page anchor navigation by default
 * - Performance optimized with useEffect and useRef
 * - Configurable scroll behavior per route
 * - Instant scrolling for specific routes (e.g., admin panels)
 * 
 * @example
 * // Basic usage
 * <ScrollToTop />
 * 
 * // With custom configuration
 * <ScrollToTop 
 *   smooth={false}
 *   instantScrollRoutes={['/admin', '/dashboard']}
 *   customScrollBehavior={{
 *     '/profile': 'instant',
 *     '/settings': 'smooth'
 *   }}
 * />
 */
export function ScrollToTop({
  smooth = true,
  instantScrollRoutes = [],
  customScrollBehavior = {},
  scrollOnHashChange = false
}: ScrollToTopProps = {}) {
  const { pathname, hash } = useLocation();
  const previousPathname = useRef(pathname);
  const previousHash = useRef(hash);

  useEffect(() => {
    // Only scroll if the pathname has changed (not just hash)
    if (previousPathname.current !== pathname) {
      const shouldScrollSmooth = getScrollBehavior(
        pathname,
        smooth,
        instantScrollRoutes,
        customScrollBehavior
      );

      // Scroll to top on route change
      window.scrollTo({
        top: 0,
        left: 0,
        behavior: shouldScrollSmooth ? 'smooth' : 'auto'
      });

      // Update the previous pathname
      previousPathname.current = pathname;
    }

    // Handle hash changes if enabled
    if (scrollOnHashChange && previousHash.current !== hash) {
      // For hash changes, we might want to scroll to the element instead of top
      if (hash) {
        const element = document.querySelector(hash);
        if (element) {
          element.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
          });
        }
      } else {
        // If hash is removed, scroll to top
        window.scrollTo({
          top: 0,
          left: 0,
          behavior: 'smooth'
        });
      }
      
      previousHash.current = hash;
    }
  }, [pathname, hash, smooth, instantScrollRoutes, customScrollBehavior, scrollOnHashChange]);

  // This component doesn't render anything
  return null;
}

/**
 * Determines the scroll behavior for a given route
 */
function getScrollBehavior(
  pathname: string,
  defaultSmooth: boolean,
  instantScrollRoutes: string[],
  customScrollBehavior: Record<string, 'smooth' | 'instant'>
): boolean {
  // Check custom behavior first
  if (customScrollBehavior[pathname]) {
    return customScrollBehavior[pathname] === 'smooth';
  }

  // Check if this route should scroll instantly
  if (instantScrollRoutes.some(route => pathname.startsWith(route))) {
    return false;
  }

  // Return default behavior
  return defaultSmooth;
}

// Export default with common configurations
export default ScrollToTop;
