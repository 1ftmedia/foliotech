import React from 'react';
import { useFormContext } from 'react-hook-form';
import { Calendar, BookOpen, Clock, Target, Lightbulb } from 'lucide-react';
import type { ApplicationFormData } from '../../../lib/validation/application';

function ProgramSelectionStep() {
  const { register, watch, formState: { errors } } = useFormContext<ApplicationFormData>();
  const selectedProgram = watch('programSelection.program');

  // Course options based on selected program
  const getCourseOptions = () => {
    switch (selectedProgram) {
      case 'computer-technology':
        return [
          { value: 'comp-1', label: 'Computer Appreciation' },
          { value: 'comp-2', label: 'Computer Graphics' },
          { value: 'comp-3', label: 'Networking' },
          { value: 'comp-4', label: 'Web Development' },
          { value: 'comp-5', label: 'Mobile App Development' },
          { value: 'comp-6', label: 'Desktop Application Development' },
          { value: 'comp-7', label: 'Radio/Router Configuration' },
          { value: 'comp-8', label: 'Drone Technology' },
          { value: 'comp-9', label: 'Remote Control Systems' },
          { value: 'comp-10', label: 'Artificial Intelligence' }
        ];
      case 'vocational-studies':
        return [
          { value: 'voc-1', label: 'Plumbing-Pipe Fitting' },
          { value: 'voc-2', label: 'Welding & Fabrications' },
          { value: 'voc-3', label: 'Metal Folding Technology' },
          { value: 'voc-4', label: 'Electrical Installations & Maintenance' },
          { value: 'voc-5', label: 'Integrated Circuits' },
          { value: 'voc-6', label: 'Exotic Furniture' },
          { value: 'voc-7', label: 'Electronics & Related Equipment Maintenance' },
          { value: 'voc-8', label: 'Automobile Maintenance (Mechanical)' },
          { value: 'voc-9', label: 'Visual Arts' }
        ];
      case 'construction-technologies':
        return [
          { value: 'const-1', label: 'Carpentry' },
          { value: 'const-2', label: 'Block-Laying and Concrete Works' },
          { value: 'const-3', label: 'Steel Fabrication' },
          { value: 'const-4', label: 'Tiling' },
          { value: 'const-5', label: 'Aluminium Works' },
          { value: 'const-6', label: 'POP (Plaster of Paris) Design' },
          { value: 'const-7', label: 'Painting and Decorating' }
        ];
      default:
        return [];
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-6">
          Program Selection
        </h3>
        
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Program
        </label>
        <div className="mt-1 relative">
          <select
            {...register('programSelection.program')}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pl-10"
          >
            <option value="">Select a program</option>
            <option value="computer-technology">Computer Technology</option>
            <option value="vocational-studies">Vocational Studies</option>
            <option value="construction-technologies">Construction Technologies</option>
          </select>
          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        {errors.programSelection?.program && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.programSelection.program.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Course
        </label>
        <div className="mt-1 relative">
          <select
            {...register('programSelection.course')}
            disabled={!selectedProgram}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pl-10 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <option value="">
              {selectedProgram ? 'Select a course' : 'Please select a program first'}
            </option>
            {getCourseOptions().map(course => (
              <option key={course.value} value={course.value}>
                {course.label}
              </option>
            ))}
          </select>
          <BookOpen className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        {errors.programSelection?.course && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.programSelection.course.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Preferred Start Date
        </label>
        <div className="mt-1 relative">
          <input
            type="date"
            {...register('programSelection.startDate')}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pl-10"
          />
          <Calendar className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        {errors.programSelection?.startDate && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.programSelection.startDate.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Study Mode
        </label>
        <div className="mt-1 relative">
          <select
            {...register('programSelection.studyMode')}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pl-10"
          >
            <option value="">Select study mode</option>
            <option value="full-time">Full Time (Monday - Friday)</option>
            <option value="part-time">Part Time (Flexible Schedule)</option>
            <option value="weekend">Weekend (Saturday - Sunday)</option>
          </select>
          <Clock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
        </div>
        {errors.programSelection?.studyMode && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.programSelection.studyMode.message}
          </p>
        )}
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Previous Experience (Optional)
        </label>
        <div className="mt-1 relative">
          <textarea
            {...register('programSelection.previousExperience')}
            rows={3}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pl-10"
            placeholder="Describe any relevant experience you have in this field..."
          />
          <Lightbulb className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
          Career Goals
        </label>
        <div className="mt-1 relative">
          <textarea
            {...register('programSelection.careerGoals')}
            rows={4}
            className="block w-full rounded-md border-gray-300 dark:border-gray-600 shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 dark:text-white pl-10"
            placeholder="What are your career aspirations and how will this program help you achieve them?"
          />
          <Target className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
        </div>
        {errors.programSelection?.careerGoals && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {errors.programSelection.careerGoals.message}
          </p>
        )}
      </div>
      </div>
    </div>
  );
}

export { ProgramSelectionStep };
export default ProgramSelectionStep;