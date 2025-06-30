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

  const handleExplorePrograms = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    
    const programsSection = document.getElementById('featured-programs');
    if (programsSection) {
      const headerOffset = 80;
      const elementPosition = programsSection.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;

      const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

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

  // Handle keyboard events for the video modal
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      handleCloseVideo();
    }
  };

  return (
    <div className="relative bg-white dark:bg-gray-900 overflow-hidden min-h-screen">
      <div className="max-w-[90rem] mx-auto px-4 sm:px-6 lg:px-8">
        <div className="relative z-10 py-16 sm:py-20 md:py-24 lg:py-28 xl:py-32">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-left"
            >
              <h1 className="tracking-tight font-extrabold text-gray-900 dark:text-white">
                <span className="block text-4xl sm:text-5xl md:text-6xl text-blue-600 dark:text-blue-400 mt-2">
                  FolioTech Institute
                </span>
              </h1>
              <p className="mt-3 text-base text-gray-500 dark:text-gray-400 sm:mt-5 sm:text-lg md:mt-5 md:text-xl leading-relaxed max-w-xl">
                Empowering the next generation of tech leaders through cutting-edge education, 
                industry partnerships, and hands-on learning experiences.
              </p>
              <div className="mt-5 sm:mt-8 flex flex-col sm:flex-row gap-4">
                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleExplorePrograms}
                  className="w-full sm:w-auto px-8 py-3 text-base font-medium rounded-lg 
                    text-blue-600 dark:text-blue-400 bg-transparent 
                    border-2 border-blue-600 dark:border-blue-400 
                    hover:bg-blue-50 dark:hover:bg-blue-900/20 
                    transition-colors md:py-4 md:text-lg md:px-10
                    focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 
                    dark:focus:ring-offset-gray-900"
                  id="explore-programs-button"
                >
                  Explore Programs
                </motion.button>
              </div>
              <div className="mt-4">
                <button
                  onClick={handleStartTour}
                  className="inline-flex items-center text-sm text-blue-600 dark:text-blue-400 hover:text-blue-700 dark:hover:text-blue-300"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 mr-1" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <circle cx="12" cy="12" r="10"></circle>
                    <line x1="12" y1="16" x2="12" y2="12"></line>
                    <line x1="12" y1="8" x2="12.01" y2="8"></line>
                  </svg>
                  Take a website tour
                </button>
              </div>
            </motion.div>
            <div className="mt-8 lg:mt-0 relative">
              <div className="relative overflow-hidden rounded-lg shadow-xl h-[70vh] flex items-center justify-center">
                <img 
                  src="https://res.cloudinary.com/dtzv2ckwm/image/upload/v1751277611/IMG_4453_i7e8pr.jpg"
                  alt="FolioTech students at work"
                  className="hero-image w-full h-full object-cover rounded-lg"
                  loading="lazy"
                />
                <button 
                  onClick={handlePlayVideo}
                  className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-30 hover:bg-opacity-40 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 rounded-lg"
                  aria-label="Play video about FolioTech"
                >
                  <div className="w-16 h-16 md:w-20 md:h-20 bg-white bg-opacity-80 rounded-full flex items-center justify-center transform hover:scale-110 transition-transform duration-300">
                    <Play className="h-8 w-8 md:h-10 md:w-10 text-blue-600 ml-1" />
                  </div>
                </button>
              </div>
            </div>
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
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative w-full max-w-4xl bg-black rounded-lg overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <button 
                onClick={handleCloseVideo}
                className="absolute top-4 right-4 z-10 p-2 bg-black bg-opacity-50 rounded-full text-white hover:bg-opacity-70 focus:outline-none focus:ring-2 focus:ring-white"
                aria-label="Close video"
              >
                <X className="h-6 w-6" />
              </button>
              <div className="aspect-w-16 aspect-h-9">
                <video 
                  src="https://res.cloudinary.com/dtzv2ckwm/video/upload/v1751307841/ScreenRecording_06-30-2025_18-50-53_1_po8njx.mov"
                  controls
                  autoPlay
                  className="w-full h-full object-contain"
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
