import React from 'react';
import { ScrollToTop } from './ScrollToTop';

interface RouteWrapperProps {
  children: React.ReactNode;
  /**
   * Whether to enable ScrollToTop for this route
   * Default: true
   */
  enableScrollToTop?: boolean;
  /**
   * Custom ScrollToTop configuration for this specific route
   */
  scrollConfig?: {
    smooth?: boolean;
    instantScrollRoutes?: string[];
    customScrollBehavior?: Record<string, 'smooth' | 'instant'>;
    scrollOnHashChange?: boolean;
  };
}

/**
 * RouteWrapper Component
 * 
 * Wraps routes with ScrollToTop functionality and other route-level features.
 * This ensures that ScrollToTop works within the Router context for all routes.
 * 
 * @example
 * // Basic usage
 * <RouteWrapper>
 *   <Layout>
 *     <PageContent />
 *   </Layout>
 * </RouteWrapper>
 * 
 * // With custom scroll configuration
 * <RouteWrapper 
 *   scrollConfig={{
 *     smooth: false,
 *     instantScrollRoutes: ['/admin']
 *   }}
 * >
 *   <AdminPanel />
 * </RouteWrapper>
 */
export function RouteWrapper({ 
  children, 
  enableScrollToTop = true,
  scrollConfig = {}
}: RouteWrapperProps) {
  // Default scroll configuration
  const defaultScrollConfig = {
    smooth: true,
    instantScrollRoutes: ['/dashboard', '/admin'],
    customScrollBehavior: {
      '/applications': 'smooth',
      '/profile': 'smooth',
      '/settings': 'smooth'
    },
    scrollOnHashChange: false,
    ...scrollConfig
  };

  return (
    <>
      {enableScrollToTop && (
        <ScrollToTop {...defaultScrollConfig} />
      )}
      {children}
    </>
  );
}
