import React from 'react';
import { useFormContext } from 'react-hook-form';
import { User, Mail, Phone, MapPin, Users } from 'lucide-react';
import type { Referee } from '../../../lib/validation/application';

function RefereeStep() {
  const { register, formState: { errors } } = useFormContext<{ referee: Referee }>();

  return (
    <div className="space-y-8">
      <div className="bg-white dark:bg-gray-800 rounded-lg p-6 shadow-lg">
        <div className="flex items-center mb-6">
          <Users className="h-6 w-6 text-blue-600 dark:text-blue-400 mr-3" />
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
          Referee Information
          </h3>
        </div>

        <div className="grid gap-6 md:grid-cols-2">
          {/* Referee Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Full Name
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                {...register('referee.name')}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                  shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 
                  dark:text-white pl-10"
              />
              <User className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.referee?.name && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.referee.name.message}
              </p>
            )}
          </div>

          {/* Referee Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Email Address
            </label>
            <div className="mt-1 relative">
              <input
                type="email"
                {...register('referee.email')}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                  shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 
                  dark:text-white pl-10"
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.referee?.email && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.referee.email.message}
              </p>
            )}
          </div>

          {/* Referee Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Phone Number
            </label>
            <div className="mt-1 relative">
              <input
                type="tel"
                {...register('referee.phone')}
                placeholder="+234..."
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                  shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 
                  dark:text-white pl-10"
              />
              <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.referee?.phone && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.referee.phone.message}
              </p>
            )}
          </div>

          {/* Referee Address */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Address
            </label>
            <div className="mt-1 relative">
              <textarea
                {...register('referee.address')}
                rows={3}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                  shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 
                  dark:text-white pl-10"
              />
              <MapPin className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
            </div>
            {errors.referee?.address && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.referee.address.message}
              </p>
            )}
          </div>

          {/* Relationship */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Relationship to Applicant
            </label>
            <div className="mt-1 relative">
              <input
                type="text"
                {...register('referee.relationship')}
                className="block w-full rounded-md border-gray-300 dark:border-gray-600 
                  shadow-sm focus:border-blue-500 focus:ring-blue-500 dark:bg-gray-700 
                  dark:text-white pl-10"
              />
              <Users className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
            </div>
            {errors.referee?.relationship && (
              <p className="mt-1 text-sm text-red-600 dark:text-red-400">
                {errors.referee.relationship.message}
              </p>
            )}
          </div>
        </div>
      </div>

      <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-6 border border-blue-200 dark:border-blue-800">
        <div className="flex items-start">
          <svg className="h-5 w-5 text-blue-600 dark:text-blue-400 mr-2 mt-0.5 flex-shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <div>
            <h4 className="text-sm font-medium text-blue-800 dark:text-blue-300 mb-1">
              About Your Referee
            </h4>
            <p className="text-sm text-blue-700 dark:text-blue-400">
          Your referee should be someone who can vouch for your character and academic/professional capabilities. 
              This could be a teacher, employer, mentor, or community leader who knows you well.
            </p>
            <p className="text-xs text-blue-600 dark:text-blue-500 mt-2">
              <strong>Note:</strong> Your referee may be contacted as part of the application review process.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export { RefereeStep };
export default RefereeStep;