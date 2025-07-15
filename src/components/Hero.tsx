import React, { useState } from 'react';
import { ArrowRight, Play, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { useTourContext } from '../context/TourContext';

interface HeroProps {
  onApplyClick: () => void;
}

export default function Hero({ onApplyClick }: HeroProps) {
  const navigate = useNavigate();
  const { startTour } = useTourContext();
  const [showVideoModal, setShowVideoModal] = useState(false);
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const handleExplorePrograms = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    const programsSection = document.getElementById('featured-programs');
    if (programsSection) {
      const headerOffset = 80;
      const elementPosition = programsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      window.scrollTo({
        top: offsetPosition,
        behavior: prefersReducedMotion ? 'auto' : 'smooth'
      });

      programsSection.focus();
    }
  };

  const handleStartTour = () => {
    startTour();
  };

  const handlePlayVideo = () => {
    setShowVideoModal(true);
  };

  const handleCloseVideo = () => {
    setShowVideoModal(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCloseVideo();
    }
  };

  return (
    <div className="relative overflow-hidden min-h-screen">
      {/* Video Background */}
      <div className="absolute inset-0 z-0 overflow-hidden">
        <video
          autoPlay
          loop
          muted
          playsInline
          className="w-full h-full object-cover"
          aria-hidden="true"
        >
          <source src="https://res.cloudinary.com/dtzv2ckwm/video/upload/v1751307841/ScreenRecording_06-30-2025_18-50-53_1_po8njx.mov" type="video/mp4" />
        </video>
        <div className="absolute inset-0 bg-black bg-opacity-50 dark:bg-opacity-70"></div>
      </div>
      
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32 flex items-center justify-center min-h-screen">
          <div className="text-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: prefersReducedMotion ? 0 : 0.6 }}
              className="text-white"
            >
              <h1 className="tracking-tight font-extrabold">
                <span className="block text-4xl sm:text-5xl md:text-6xl mt-2">
                  FolioTech Institute
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-100 sm:mt-5 sm:text-lg md:mt-5 md:text-xl leading-relaxed max-w-xl mx-auto">
                Empowering the next generation of tech leaders through cutting-edge education, 
                industry partnerships, and hands-on learning experiences.
              </p>
              <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row gap-4 justify-center">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExplorePrograms}
                  className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-lg
                    text-white bg-transparent 
                    border-2 border-white
                    hover:bg-white/10
                    transition-colors md:py-4 md:text-lg md:px-10
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                    dark:focus:ring-offset-gray-900"
                  id="explore-programs-button"
                >
                  Explore Programs
                </motion.button>
                <button 
                  onClick={handlePlayVideo}
                  className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-lg
                    text-blue-600 bg-white
                    hover:bg-blue-50
                    transition-all duration-300 transform hover:scale-105
                    focus:outline-none focus:ring-2 focus:ring-white
                    flex items-center justify-center"
                  aria-label="Watch campus tour video"
                >
                  <Play className="mr-2 h-5 w-5" /> Watch Campus Tour
                </button>
              </div>
              <div className="mt-4">
                <motion.button
                  onClick={handleStartTour}
                  className="inline-flex items-center text-sm text-white hover:text-blue-200 focus:outline-none focus:ring-2 focus:ring-white rounded-md"
                  whileHover={{ scale: prefersReducedMotion ? 1 : 1.05 }}
                  whileTap={{ scale: prefersReducedMotion ? 1 : 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  Take a website tour
                </motion.button>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* Video Modal */}
      <AnimatePresence>
        {showVideoModal && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black bg-opacity-75"
            onClick={handleCloseVideo}
            onKeyDown={handleKeyDown}
            tabIndex={-1}
          >
            <motion.div 
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              tabIndex={0}
              role="dialog"
              aria-modal="true"
              aria-label="Video modal"
              className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={handleCloseVideo}
                className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close video"
                role="document"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="aspect-w-16 aspect-h-9">
                <video
                  src="https://res.cloudinary.com/dtzv2ckwm/video/upload/v1752610579/FolioTech_30sec_video_Intro_Video_with_audio_1280x720_website_yyfsvc.mp4"
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
                  playsInline
                  aria-label="FolioTech Institute campus tour video"
                >
                  Your browser does not support the video tag.
                </video>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export { Hero };
