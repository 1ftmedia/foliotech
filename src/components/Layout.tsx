import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { ErrorBoundary } from './ErrorBoundary';
import { Navigation } from './Navigation';
import { Footer } from './Footer';
import { BackToTop } from './BackToTop';
import { WhatsAppWidget } from './WhatsAppWidget';
import { ThemeProvider } from './ThemeProvider';
import { AuthDialog } from './auth/AuthDialog';
import { TourProvider } from '../context/TourContext';
import { AuthModalProvider, useAuthModal } from '../context/AuthModalContext';
import { useAuthContext } from '../lib/hooks/useAuth';

interface LayoutProps {
  children: React.ReactNode;
}

function LayoutContent({ children }: LayoutProps) {
  const location = useLocation();
  const { showAuthModal, authMode, closeAuthModal, openAuthModal } = useAuthModal();
  const { user } = useAuthContext();

  // Handle auth dialog from navigation state
  useEffect(() => {
    if (location.state && location.state.openAuthDialog) {
      const mode = location.state.authMode || 'signin';
      openAuthModal(mode);
      // Clear the state to prevent reopening on subsequent renders
      window.history.replaceState({}, document.title);
    }
  }, [location.state, openAuthModal]);

  // Close auth modal when user successfully logs in
  useEffect(() => {
    if (user && showAuthModal) {
      // Closing auth modal due to user login
      closeAuthModal();
    }
  }, [user, showAuthModal, closeAuthModal]);

  useEffect(() => {
    // Handle scroll to section after navigation
    if (location.state && location.state.scrollTo) {
      const element = document.getElementById(location.state.scrollTo);
      if (element) {
        // Wait for page to fully load and render
        setTimeout(() => {
          const headerOffset = 80; // Height of fixed header
          const elementPosition = element.getBoundingClientRect().top;
          const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

          // Check if user prefers reduced motion
          const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

          window.scrollTo({
            top: offsetPosition,
            behavior: prefersReducedMotion ? 'auto' : 'smooth'
          });

          // Set focus to the section for accessibility
          element.focus();
          
          // Clear the state to prevent scrolling on subsequent renders
          window.history.replaceState({}, document.title);
        }, 100);
      }
    }
  }, [location]);

  return (
    <ErrorBoundary>
      <ThemeProvider>
        <TourProvider>
          <div className="min-h-screen bg-white dark:bg-gray-900 transition-colors flex flex-col">
            <Navigation />
            <main className="flex-grow pt-safe-top pb-safe-bottom">
              {children}
            </main>
            <Footer />

            {/* Global UI Elements */}
            <React.Suspense fallback={null}>
              <BackToTop />
              <WhatsAppWidget />
            </React.Suspense>

            <AuthDialog 
              isOpen={showAuthModal}
              onClose={closeAuthModal}
              defaultMode={authMode}
            />
          </div>
        </TourProvider>
      </ThemeProvider>
    </ErrorBoundary>
  );
}

export function Layout({ children }: LayoutProps) {
  return (
    <AuthModalProvider>
      <LayoutContent>{children}</LayoutContent>
    </AuthModalProvider>
  );
}