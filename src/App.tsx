import React, { useState } from 'react';
import { Hero } from './components/Hero';
import { Programs } from './components/Programs';
import { Testimonials } from './components/Testimonials';
import { AdmissionProcess } from './components/AdmissionProcess';
import { ErrorBoundary } from './components/ErrorBoundary';
import { LoadingSpinner } from './components/LoadingSpinner';
import { WelcomeModal } from './components/WelcomeModal';

function App() {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  
  const handleSignUpClick = () => {
    // This will be handled by the Layout component
    const authModal = document.querySelector('[role="dialog"]');
    if (authModal) {
      (authModal as HTMLElement).setAttribute('aria-hidden', 'false');
    }
  };

  return (
    <>
      {showWelcomeModal && (
        <WelcomeModal onClose={() => setShowWelcomeModal(false)} />
      )}
      <ErrorBoundary>
        <Hero onApplyClick={handleSignUpClick} />
      </ErrorBoundary>
      <ErrorBoundary>
        <Programs />
      </ErrorBoundary>
      <ErrorBoundary>
        <Testimonials />
      </ErrorBoundary>
      <ErrorBoundary>
        <AdmissionProcess onApplyClick={handleSignUpClick} />
      </ErrorBoundary>
    </>
  );
}

export default App;
