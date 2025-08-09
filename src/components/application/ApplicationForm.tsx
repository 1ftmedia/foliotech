import React, { useState, useCallback, useEffect, lazy, Suspense } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Clock, CheckCircle } from 'lucide-react';
import { applicationSchema, type ApplicationFormData } from '../../lib/validation/application';
import { useApplicationStore } from '../../lib/store/applicationStore';
import { submitApplication, saveDraft } from '../../lib/api/applications';
import { FormProgress } from './FormProgress';
import { FormNavigation } from './FormNavigation';
import { LoadingSpinner } from '../LoadingSpinner';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../auth/AuthContext';
import { ErrorBoundary } from '../../lib/errors/ErrorBoundary';

// Lazy load form steps
const PersonalInfoStep = lazy(() => 
  import('./steps/PersonalInfoStep').then(module => ({ 
    default: module.PersonalInfoStep || module.default 
  }))
);
const AcademicBackgroundStep = lazy(() => 
  import('./steps/EducationStep').then(module => ({ 
    default: module.EducationStep || module.default 
  }))
);
const ProgramSelectionStep = lazy(() => 
  import('./steps/ProgramSelectionStep').then(module => ({ 
    default: module.ProgramSelectionStep || module.default 
  }))
);
const AccommodationStep = lazy(() => 
  import('./steps/AccommodationStep').then(module => ({ 
    default: module.AccommodationStep || module.default 
  }))
);
const RefereeStep = lazy(() => 
  import('./steps/RefereeStep').then(module => ({ 
    default: module.RefereeStep || module.default 
  }))
);

const StepLoadingFallback = () => (
  <div className="min-h-[300px] flex items-center justify-center">
    <LoadingSpinner size="md" message="Loading form..." />
  </div>
);

const formSteps = [
  { id: 'personal', title: 'Personal Information', component: PersonalInfoStep },
  { id: 'academic', title: 'Academic Background', component: AcademicBackgroundStep },
  { id: 'program', title: 'Program Selection', component: ProgramSelectionStep },
  { id: 'accommodation', title: 'Accommodation', component: AccommodationStep },
  { id: 'referee', title: 'Referee', component: RefereeStep },
];

interface ApplicationFormProps {
  onSubmit?: (data: ApplicationFormData) => void;
  programId?: string;
  courseId?: string;
  draftId?: string;
}

export function ApplicationForm({ onSubmit, programId, courseId, draftId }: ApplicationFormProps) {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [submissionSuccess, setSubmissionSuccess] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);
  const [draftSaving, setDraftSaving] = useState(false);
  const { 
    currentStep, 
    setCurrentStep, 
    formData, 
    updateFormData, 
    resetForm, 
    setStepCompletion 
  } = useApplicationStore();
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [currentDraftId, setCurrentDraftId] = useState<string | undefined>(draftId);
  
  const methods = useForm<ApplicationFormData>({
    resolver: zodResolver(applicationSchema),
    defaultValues: formData,
    mode: 'onBlur',
    reValidateMode: 'onChange',
  });

  const { handleSubmit, formState: { errors, isValid }, trigger, getValues, reset, clearErrors } = methods;

  const validateStep = useCallback(async () => {
    try {
      const stepFieldMap = {
        0: ['personalInfo'],
        1: ['academicBackground'],
        2: ['programSelection'],
        3: ['accommodation'],
        4: ['referee']
      };
      
      const fieldsToValidate = stepFieldMap[currentStep as keyof typeof stepFieldMap];
      if (!fieldsToValidate) return false;
      
      const isStepValid = await trigger(fieldsToValidate as any);
      return isStepValid;
    } catch (error) {
      console.error('Validation error:', error);
      return false;
    }
  }, [currentStep, trigger]);

  const handleStepChange = useCallback(async (newStep: number) => {
    try {
      // Validate current step before moving
      const isCurrentStepValid = await validateStep();
      setStepCompletion(currentStep, isCurrentStepValid);
      
      if (isCurrentStepValid || newStep < currentStep) {
        setCurrentStep(newStep);
        // Clear any previous errors when moving to a new step
        clearErrors();
      }
    } catch (error) {
      console.error('Error changing step:', error);
    }
  }, [currentStep, validateStep, setStepCompletion, setCurrentStep, clearErrors]);

  const handleNext = useCallback(() => {
    if (currentStep < formSteps.length - 1) {
      handleStepChange(currentStep + 1);
    }
  }, [currentStep, handleStepChange]);

  const handlePrevious = useCallback(() => {
    if (currentStep > 0) {
      handleStepChange(currentStep - 1);
    }
  }, [currentStep, handleStepChange]);
    

  useEffect(() => {
    const validateCurrentStep = async () => {
      try {
        const isStepValid = await validateStep();
        setStepCompletion(currentStep, isStepValid);
      } catch (error) {
        console.error('Error validating step:', error);
        setStepCompletion(currentStep, false);
      }
    };
    
    validateCurrentStep();
  }, [currentStep, validateStep, setStepCompletion]);

  const handleFormChange = useCallback(() => {
    const currentValues = getValues();
    updateFormData(currentValues);
  }, [getValues, updateFormData]);

  useEffect(() => {
    const subscription = methods.watch(handleFormChange);
    return () => subscription.unsubscribe();
  }, [methods, handleFormChange]);

  // Auto-save draft when form data changes
  useEffect(() => {
    const autoSaveDraft = async () => {
      if (!user || Object.keys(formData).length === 0) return;
      
      try {
        setDraftSaving(true);
        const result = await saveDraft(formData, currentDraftId);
        if (result.success) {
          setCurrentDraftId(result.draftId);
          setDraftSaved(true);
          // Hide the "Draft saved" message after 3 seconds
          setTimeout(() => setDraftSaved(false), 3000);
        }
      } catch (error) {
        console.error('Error auto-saving draft:', error);
      } finally {
        setDraftSaving(false);
      }
    };

    // Use debounce to avoid too many saves
    const debounceTimer = setTimeout(autoSaveDraft, 2000);
    return () => clearTimeout(debounceTimer);
  }, [formData, currentDraftId, user]);

  const handleFormSubmit = async (data: ApplicationFormData) => {
    try {
      setIsSubmitting(true);
      setError(null);
      
      // Validate all steps before submission
      const allStepsValid = await Promise.all(
        formSteps.map(async (_, index) => {
          const stepFieldMap = {
            0: ['personalInfo'],
            1: ['academicBackground'],
            2: ['programSelection'],
            3: ['accommodation'],
            4: ['referee']
          };
          
          const fieldsToValidate = stepFieldMap[index as keyof typeof stepFieldMap];
          return await trigger(fieldsToValidate as any);
        })
      );
      
      if (!allStepsValid.every(Boolean)) {
        throw new Error('Please complete all required fields before submitting');
      }
      
      // If custom onSubmit is provided, use it
      if (onSubmit) {
        await onSubmit(data);
      } else {
        // Submit to Supabase
        const result = await submitApplication(data);
        
        if (!result.success) {
          throw new Error(result.message);
        }
        
        toast.success('Application submitted successfully!');
      }
      
      setSubmissionSuccess(true);
      resetForm();
      reset();
      
      setTimeout(() => {
        navigate('/applications');
      }, 3000);
      
    } catch (error) {
      console.error('Error submitting form:', error);
      const errorMessage = error instanceof Error ? error.message : 'Failed to submit application. Please try again.';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setIsSubmitting(false);
    }
  };

  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      reset(formData);
    }
  }, []);

  if (submissionSuccess) {
    return (
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center py-12"
      >
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-green-100 dark:bg-green-900/30 mb-6">
          <CheckCircle className="w-8 h-8 text-green-600 dark:text-green-400" />
        </div>
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Application Submitted Successfully</h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
          Thank you for your application. We will review your information and contact you soon.
        </p>
        <p className="text-sm text-gray-500 dark:text-gray-500">
          Redirecting to applications page...
        </p>
      </motion.div>
    );
  }

  return (
    <ErrorBoundary>
      <FormProvider {...methods}>
        <form 
          onSubmit={handleSubmit(handleFormSubmit)} 
          className="space-y-8 pb-32"
          noValidate
          aria-label="Student Application Form"
        >
          {/* Fee Waiver Banner */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="bg-gradient-to-r from-green-500 to-green-600 text-white p-6 rounded-lg shadow-lg mb-8"
          >
            <div className="flex items-center justify-center space-x-3">
              <Clock className="h-6 w-6" />
              <div className="text-center">
                <h3 className="font-bold text-xl">LIMITED TIME OFFER: Application Fee Waived!</h3>
                <p className="text-sm opacity-90 mt-1">Start your academic journey at FolioTech Institute with no application fees</p>
              </motion.div>
            </div>
          </motion.div>

          <FormProgress 
            steps={formSteps} 
            currentStep={currentStep} 
            aria-label="Form Progress"
          />

          {/* Draft saved indicator */}
          <AnimatePresence>
            {draftSaved && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300 px-4 py-3 rounded-lg text-sm flex items-center justify-center shadow-sm"
              >
                <CheckCircle className="w-4 h-4 mr-2" />
                Draft saved automatically
              </motion.div>
            )}
          </AnimatePresence>

          {/* Error display */}
          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg text-red-700 dark:text-red-400 px-4 py-3"
              >
                <div className="flex items-center">
                  <svg className="w-5 h-5 mr-2 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                  </svg>
                  <span>{error}</span>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <AnimatePresence mode="wait">
            <motion.div
              key={currentStep}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              role="group"
              aria-label={formSteps[currentStep].title}
            >
              <ErrorBoundary>
                <Suspense fallback={<StepLoadingFallback />}>
                  {React.createElement(formSteps[currentStep].component)}
                </Suspense>
              </ErrorBoundary>
            </div>
          </AnimatePresence>

          <FormNavigation
            currentStep={currentStep}
            totalSteps={formSteps.length}
            onPrevious={handlePrevious}
            onNext={handleNext}
            isSubmitting={isSubmitting}
            onSubmit={handleSubmit(handleFormSubmit)}
          />

          {/* Submission overlay */}
          <AnimatePresence>
            {isSubmitting && (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50"
                role="alert"
                aria-busy="true"
              >
                <div className="bg-white dark:bg-gray-800 rounded-lg p-8 shadow-xl">
                  <LoadingSpinner size="lg" message="Submitting your application..." />
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </form>
      </FormProvider>
    </ErrorBoundary>
  );
}

export default ApplicationForm;