import React from 'react';
import { motion } from 'framer-motion';
import { cn } from '../../lib/utils';

interface PageSectionProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
  description?: string;
  variant?: 'default' | 'card' | 'bordered' | 'transparent';
  spacing?: 'none' | 'sm' | 'md' | 'lg' | 'xl';
  className?: string;
  id?: string;
  showDivider?: boolean;
  background?: 'white' | 'gray' | 'blue' | 'transparent';
  maxWidth?: 'sm' | 'md' | 'lg' | 'xl' | '7xl' | 'full';
}

export function PageSection({
  children,
  title,
  subtitle,
  description,
  variant = 'default',
  spacing = 'lg',
  className = '',
  id,
  showDivider = false,
  background = 'white',
  maxWidth = '7xl'
}: PageSectionProps) {
  const spacingClasses = {
    none: '',
    sm: 'py-4',
    md: 'py-8',
    lg: 'py-12',
    xl: 'py-16'
  };

  const maxWidthClasses = {
    sm: 'max-w-sm',
    md: 'max-w-md',
    lg: 'max-w-lg',
    xl: 'max-w-xl',
    '7xl': 'max-w-7xl',
    full: 'max-w-full'
  };

  const backgroundClasses = {
    white: 'bg-white dark:bg-gray-900',
    gray: 'bg-gray-50 dark:bg-gray-800',
    blue: 'bg-blue-50 dark:bg-blue-900/20',
    transparent: 'bg-transparent'
  };

  const variantClasses = {
    default: '',
    card: 'rounded-xl shadow-lg dark:shadow-gray-900/10 border border-gray-200 dark:border-gray-700',
    bordered: 'border border-gray-200 dark:border-gray-700 rounded-lg',
    transparent: ''
  };

  return (
    <section
      id={id}
      className={cn(
        'relative',
        spacingClasses[spacing],
        backgroundClasses[background],
        variantClasses[variant],
        className
      )}
    >
      {/* Background Pattern for certain variants */}
      {variant === 'card' && (
        <div className="absolute inset-0 opacity-5 dark:opacity-10">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-400 to-purple-400 rounded-xl"></div>
        </div>
      )}

      <div className={cn('relative mx-auto px-4 sm:px-6 lg:px-8', maxWidthClasses[maxWidth])}>
        {/* Section Header */}
        {(title || subtitle || description) && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: '-100px' }}
            transition={{ duration: 0.5 }}
            className="text-center mb-12"
          >
            {subtitle && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.4, delay: 0.1 }}
                className="text-sm font-semibold text-blue-600 dark:text-blue-400 uppercase tracking-wide mb-2"
              >
                {subtitle}
              </motion.p>
            )}
            
            {title && (
              <motion.h2
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.4, delay: 0.2 }}
                className="text-2xl md:text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white mb-4"
              >
                {title}
              </motion.h2>
            )}
            
            {description && (
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-100px' }}
                transition={{ duration: 0.4, delay: 0.3 }}
                className="max-w-3xl mx-auto text-lg text-gray-600 dark:text-gray-400"
              >
                {description}
              </motion.p>
            )}
          </motion.div>
        )}

        {/* Section Content */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: '-100px' }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {children}
        </motion.div>

        {/* Bottom Divider */}
        {showDivider && (
          <div className="mt-12 pt-8 border-t border-gray-200 dark:border-gray-700">
            <div className="w-24 h-1 bg-gradient-to-r from-blue-500 to-purple-500 mx-auto rounded-full"></div>
          </div>
        )}
      </div>
    </section>
  );
}
