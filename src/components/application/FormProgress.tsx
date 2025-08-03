import React, { memo } from 'react';
import { motion } from 'framer-motion';
import { Check } from 'lucide-react';
import { useApplicationStore } from '../../lib/store/applicationStore';

interface FormProgressProps {
  steps: Array<{ id: string; title: string }>;
  currentStep: number;
  'aria-label'?: string;
}

export const FormProgress = memo(function FormProgress({ steps, currentStep, 'aria-label': ariaLabel }: FormProgressProps) {
  const { stepCompletion } = useApplicationStore();

  return (
    <nav aria-label={ariaLabel || "Progress"} className="mb-8 bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Application Progress</h3>
      <ol role="list" className="space-y-4 md:flex md:space-y-0 md:space-x-4">
        {steps.map((step, index) => {
          const isComplete = stepCompletion[index];
          const isCurrent = index === currentStep;
          const isPast = index < currentStep;

          return (
            <li key={step.id} className="md:flex-1">
              <div className={`flex flex-col py-2 pl-4 md:pl-0 md:pt-4 border-l-4 md:border-l-0 md:border-t-4 transition-colors ${
                isCurrent 
                  ? 'border-blue-600' 
                  : isComplete 
                    ? 'border-green-500' 
                    : 'border-gray-300 dark:border-gray-600'
              }`}>
                <div className="flex items-center mb-1">
                  <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-medium mr-2 ${
                    isComplete 
                      ? 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-400'
                      : isCurrent
                        ? 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-400'
                        : 'bg-gray-100 text-gray-600 dark:bg-gray-700 dark:text-gray-400'
                  }`}>
                    {isComplete ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      index + 1
                    )}
                  </span>
                  <span className={`text-sm font-medium ${
                    isCurrent 
                      ? 'text-blue-600 dark:text-blue-400' 
                      : isComplete 
                        ? 'text-green-600 dark:text-green-400'
                        : 'text-gray-500 dark:text-gray-400'
                  }`}>
                  Step {index + 1}
                  </span>
                </div>
                <span className={`text-sm font-medium ${
                  isCurrent 
                    ? 'text-gray-900 dark:text-white' 
                    : 'text-gray-600 dark:text-gray-400'
                }`}>
                  {step.title}
                </span>
              </div>
            </li>
          );
        })}
      </ol>
    </nav>
  );
});

export default FormProgress;