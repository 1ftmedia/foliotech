import React from 'react';
import { motion } from 'framer-motion';
import { ArrowLeft, Home, ExternalLink } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

interface PageHeaderProps {
  title: string;
  subtitle?: string;
  description?: string;
  showBackButton?: boolean;
  backTo?: string;
  backText?: string;
  showHomeButton?: boolean;
  actions?: React.ReactNode;
  breadcrumbs?: Array<{
    label: string;
    href?: string;
    current?: boolean;
  }>;
  variant?: 'default' | 'hero' | 'minimal';
  className?: string;
}

export function PageHeader({
  title,
  subtitle,
  description,
  showBackButton = false,
  backTo,
  backText = 'Back',
  showHomeButton = false,
  actions,
  breadcrumbs,
  variant = 'default',
  className = ''
}: PageHeaderProps) {
  const navigate = useNavigate();

  const handleBack = () => {
    if (backTo) {
      navigate(backTo);
    } else {
      navigate(-1);
    }
  };

  const baseClasses = "relative overflow-hidden";
  const variantClasses = {
    default: "py-8 md:py-12 bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 border-b border-gray-200 dark:border-gray-700",
    hero: "py-16 md:py-24 bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50 dark:from-blue-900/20 dark:via-indigo-900/20 dark:to-purple-900/20 border-b border-blue-200 dark:border-blue-800",
    minimal: "py-6 md:py-8 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700"
  };

  return (
    <header className={`${baseClasses} ${variantClasses[variant]} ${className}`}>
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5 dark:opacity-10">
        <div className="absolute inset-0 bg-gradient-to-r from-blue-400 to-purple-400 transform rotate-12 scale-150"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumbs */}
        {breadcrumbs && breadcrumbs.length > 0 && (
          <nav className="mb-4" aria-label="Breadcrumb">
            <ol className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              {breadcrumbs.map((crumb, index) => (
                <li key={index} className="flex items-center">
                  {index > 0 && (
                    <svg className="h-4 w-4 mx-2 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  )}
                  {crumb.current ? (
                    <span className="font-medium text-gray-900 dark:text-white" aria-current="page">
                      {crumb.label}
                    </span>
                  ) : crumb.href ? (
                    <Link
                      to={crumb.href}
                      className="hover:text-gray-900 dark:hover:text-white transition-colors"
                    >
                      {crumb.label}
                    </Link>
                  ) : (
                    <span>{crumb.label}</span>
                  )}
                </li>
              ))}
            </ol>
          </nav>
        )}

        {/* Navigation Actions */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            {showBackButton && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
                onClick={handleBack}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-all duration-200"
                aria-label={backText}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                {backText}
              </motion.button>
            )}
            
            {showHomeButton && (
              <motion.button
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
                onClick={() => navigate('/')}
                className="inline-flex items-center px-3 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 dark:focus:ring-offset-gray-900 transition-all duration-200"
                aria-label="Go to home page"
              >
                <Home className="h-4 w-4 mr-2" />
                Home
              </motion.button>
            )}
          </div>

          {actions && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              {actions}
            </motion.div>
          )}
        </div>

        {/* Main Header Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="text-center md:text-left"
        >
          {subtitle && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
              className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2"
            >
              {subtitle}
            </motion.p>
          )}
          
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: 0.3 }}
            className={`font-bold text-gray-900 dark:text-white mb-4 ${
              variant === 'hero' 
                ? 'text-4xl md:text-5xl lg:text-6xl' 
                : variant === 'minimal'
                ? 'text-2xl md:text-3xl'
                : 'text-3xl md:text-4xl lg:text-5xl'
            }`}
          >
            {title}
          </motion.h1>
          
          {description && (
            <motion.p
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
              className={`max-w-3xl mx-auto md:mx-0 text-gray-600 dark:text-gray-400 ${
                variant === 'hero' ? 'text-lg md:text-xl' : 'text-base md:text-lg'
              }`}
            >
              {description}
            </motion.p>
          )}
        </motion.div>
      </div>
    </header>
  );
}
